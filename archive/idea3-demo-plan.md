# Demo Build Plan — Idea 3: AI "No-Go Zone" to Prevent Ureter Injury in Hysterectomy

*SDS 2026 Summer School — Group 3. Demo + research pitch due Fri 12 Jun. Build window: Wed AM → Fri AM.*

> Companion to `ideas/idea3.md` (the pitch). This doc is the **engineering plan**: architecture,
> the exact annotation protocol, the proximity/alert logic, the pre-compute file format, and the
> day-by-day split. Goal: a working end-to-end demo by **Wednesday night**, then Thu/Fri for quality.

---

## 0. The one-line goal

Play a **real laparoscopic-hysterectomy clip**; during the high-risk phase, overlay a **predicted
ureter danger-corridor** (inferred from visible anatomy, not segmented directly), and raise a
**proximity alert** when the active energy device enters it — with **calibrated uncertainty**.

**What judges see:** a clean video player with a phase indicator, a translucent corridor heatmap that
arms only at the dangerous step, an instrument-tip marker, and a big **SAFE / CAUTION / NO-GO** chip —
plus a **predict-then-reveal** validation slide.

---

## 1. Scope discipline (read before building)

The novelty lives in a *narrow* place. Hold this line or it collapses into prior art.

**We ARE building:** *predict a non-visible structure's danger corridor from visible landmarks +
phase-gated proximity alert, in hysterectomy.*

**We are NOT claiming / NOT building:**
- ❌ Pixel-perfect **ureter segmentation** (already published, Dice 0.86; and the ureter is usually
  not visible at the moment of danger).
- ❌ "We invented the **no-go zone**" (GoNoGoNet / CVS own the concept; we transplant it).
- ❌ True **3D proximity** — we work in **2D image space**. Say so explicitly.
- ❌ A crisp corridor line — always a **soft probabilistic region** with uncertainty shown.

**Terminology:** it is the **ureter**, not the urethra. Lock this before the talk.

---

## 2. Architecture

```
clip ─► [1] PHASE GATE ─► [2] CORRIDOR PREDICTOR ─► [3] INSTRUMENT TIP ─► [4] PROXIMITY/ALERT ─► overlay
              │                    │                        │                     │
        AutoLaparo phase    surgeon-annotated         AutoLaparo            2D distance +
        labels / model      atlas template            instrument seg       uncertainty + status
```

Three of four stages run off **existing AutoLaparo labels/models** — only the corridor needs new work.

### [1] Phase gate — *free, build first*
Use AutoLaparo's phase labels (or the provided phase model) to detect the high-risk steps
(uterine-vessel ligation / colpotomy). Emit boolean `armed`. This is why the alert doesn't cry wolf.

### [2] Corridor predictor — *three escalating versions; never get stuck*

| Ver | What | Needs | When |
|---|---|---|---|
| **v0** | **Geometric rule**: corridor placed lateral to the cervico-uterine junction at a fixed offset from the **uterus mask** (AutoLaparo labels the uterus). | nothing new | **Wed** — guarantees end-to-end runs |
| **v1** | **Anatomy-anchored probabilistic atlas**: average surgeon-annotated corridors in a frame anchored on the detected uterus/cervix → soft heat-template; per frame, detect uterus → register → project template. Uncertainty = heat spread. | surgeon annotations (§4) | **Thu** — the primary system |
| **v2** | **Learned CNN**: finetune a small U-Net to regress the corridor heatmap end-to-end from the raw frame. | annotations + training time | **stretch only** |

v1 is the pitch made literal ("infer the hidden region from a visible landmark"), needs almost no
training data, and gives uncertainty for free. Default to v1; keep v0 as the always-works fallback.

### [3] Instrument tip — *free*
Use AutoLaparo's instrument segmentation (finetune lightly if needed) → active energy-device tip
`(x, y)` per frame. Tip = farthest mask point from the instrument's entry side, or mask centroid of
the distal third.

### [4] Proximity / alert / uncertainty — see §5.

---

## 3. Data setup

**Dataset:** AutoLaparo (21 laparoscopic-hysterectomy videos; phase + instrument + uterus seg).
CC-BY-NC-SA, request form. **Confirm it's in the shared Colab/Drive first (Open Q1).**

**Clip selection (pick 2–3):**
1. Must contain the high-risk phase (uterine-vessel ligation / colpotomy).
2. **Prefer clips where the ureter or a landmark becomes visible later** → enables predict-then-reveal
   validation (§6). This is worth optimizing for.
3. Decent image quality; energy device clearly used in-phase.

---

## 4. Annotation protocol (the surgeons' job — the ground-truth)

We annotate the **danger corridor** (the region to keep energy *out* of), **not** the ureter contour.

**Definition to give the surgeons:** *the zone lateral to the cervix at the level of the uterine
vessels where the ureter most probably courses, plus a safety margin.* Annotate it as a filled region.

**Tool — SAM2 as an annotation accelerator** (cheap labels from few clicks):
1. Surgeon scrubs to the **start of the high-risk phase**.
2. On one keyframe, clicks a few points inside the corridor (or draws a coarse polygon).
3. **SAM2 propagates** the region across the clip's high-risk segment.
4. Surgeon scrubs and **corrects drift** every ~20–30 frames (re-click).
5. Save per-frame masks → `annotations/<clip_id>/<frame_idx>.png` (binary).

**Coverage target:** 2–3 clips × the high-risk segment ≈ **200–600 frames** total via propagation.

**Two surgeons annotate an overlapping subset** → compute **inter-annotator IoU**; this becomes the
"surgeon-agreement" number in the pitch (and your sanity check that "corridor" is well-defined).

---

## 5. Proximity / alert logic (concrete)

Work in **normalized image units** (fraction of image diagonal `diag`) so it's resolution-independent.
Tune the constants *with the surgeons* on day 2.

```python
# per frame
def status_for_frame(frame):
    if not frame.armed:
        return "SAFE", alert=False           # alert only during the dangerous phase

    region = frame.corridor.mask >= TAU_PROB # TAU_PROB ~ 0.5: the "in-corridor" region
    d = min_distance_px(frame.instrument_tip, region) / frame.diag  # normalized 2D distance
    conf = frame.corridor.confidence         # 0..1 from atlas heat concentration

    if   d > D_CAUTION: status = "SAFE"
    elif d > D_NOGO:    status = "CAUTION"
    else:              status, alert = "NO_GO", True

    low_conf = conf < C_MIN                   # show "low confidence — verify", widen rendered zone
    return status, alert, low_conf

# starting thresholds (tune Thu with surgeons)
D_CAUTION = 0.15      # ~15% of image diagonal
D_NOGO    = 0.07      # ~7%
TAU_PROB  = 0.50
C_MIN     = 0.40
```

**Notes:**
- `min_distance_px` = distance from the tip to the nearest in-corridor pixel; **0 if the tip is inside**.
- Add light **temporal smoothing** (e.g., require 3 consecutive NO_GO frames before firing) to avoid
  flicker — alarm-fatigue is a real clinical objection, mention you handled it.
- If you have a pixel-size calibration, also display `d_mm`; otherwise keep it normalized and *don't*
  claim millimetric precision.

---

## 6. Validation artifact (what makes it credible)

1. **Predict-then-reveal (the money slide):** on ≥1 clip, show frame **X** with the predicted corridor,
   then a later frame **Y** where the ureter (or ICG signal) is revealed **inside** that corridor.
   "We flagged it before it was visible, and we were right."
2. **Surgeon agreement:** inter-annotator IoU on the corridor (§4).
3. If **no reveal frames** exist: lean honestly on expert-consensus + calibrated uncertainty, and
   state rigorous validation (reader study / near-miss rate / universal cystoscopy ground truth) as
   the **proposed study**. Do not fake it.

---

## 7. Pre-compute everything (the single most important build decision)

Run the full pipeline **offline on Colab**, cache results, and have the app **play cached results** —
no GPU on stage, no latency gamble, looks real-time. Then **screen-record a full run as backup**.

**On-disk layout (per clip):**
```
precomputed/<clip_id>/
  meta.json                 # clip_id, fps, width, height, diag, source video ref
  frames/000123.jpg         # (optional) extracted frames, or reference source video
  corridor/000123.png       # soft heatmap (8-bit, 0..255 = prob)
  timeline.json             # per-frame state (below) — the source of truth
  overlays/000123.png       # (optional) pre-rendered RGBA overlay for guaranteed-smooth playback
```

**`timeline.json` (per-frame records):**
```json
{
  "clip_id": "case07_seg3",
  "fps": 25,
  "width": 1280, "height": 720, "diag": 1469,
  "frames": [
    {
      "idx": 123,
      "phase": "uterine_vessel_ligation",
      "armed": true,
      "corridor": { "mask_png": "corridor/000123.png", "confidence": 0.62 },
      "instrument_tip": { "x": 612, "y": 430, "active": true, "tool": "ligasure" },
      "proximity_norm": 0.05,
      "status": "NO_GO",
      "alert": true,
      "low_conf": false
    }
  ]
}
```

The Gradio app reads `timeline.json`, composites the corridor + tip marker + status chip, and honors
the **with-assist / without-assist** toggle by simply showing/hiding overlays. Geometry is the source
of truth; pre-rendered `overlays/` are an optional belt-and-suspenders for playback smoothness.

---

## 8. Demo UX

- Clean **Gradio** (or Streamlit) video player, shareable Colab link.
- **Top:** current phase + an **ARMED** indicator that lights at the danger step.
- **Overlay:** translucent corridor heatmap (only when armed), instrument-tip marker, proximity meter.
- **Status chip:** big **SAFE / CAUTION / NO-GO**; "low confidence — verify" sub-state.
- **Bottom timeline:** phase track + markers where alerts fired (click to seek).
- **Toggle:** with-assist / without-assist (sells the value in one click).
- **Validation panel:** the predict-then-reveal pair + the surgeon-agreement number.

---

## 9. Tech stack

Python on Colab Pro: provided **phase** + **instrument-seg** models (finetune if needed), **SAM2** for
annotation, **NumPy/OpenCV** for geometry/proximity/registration, **Gradio** for the UI. Nothing exotic;
all runs on one Colab GPU for the offline pass.

---

## 10. Work split + timeline

| | **Wed** | **Thu** | **Fri AM** |
|---|---|---|---|
| **CS-1** | phase gate + instrument tip on 1 clip | wire full pipeline; tune thresholds w/ surgeons | rehearse / freeze |
| **CS-2** | **v0 geometric corridor → end-to-end runs** | **v1 atlas corridor** + SAM2 annotation tool | backup buffer |
| **CS-3** | Gradio skeleton + scrubber + `timeline.json` reader | proximity/uncertainty render; **pre-compute all clips + record backup** | — |
| **Clin-1/2** | pick clips; start corridor annotation (§4) | finish annotation; **find predict-then-reveal frames** | — |
| **Clin-3** | problem statement + alert-ergonomics slides | validation framing | **drive the talk** |

**Guiding principle — vertical slice first:** by Wed night the *whole chain* runs on one clip with the
v0 geometric corridor. Everything after is quality, not existence.

---

## 11. Confirm before Wednesday (blockers)

1. **Is AutoLaparo (+ phase/instrument models) in the shared Colab/Drive?** Decides build-vs-finetune.
2. **Will the surgeons annotate ~2–3 clips' high-risk segments by Thu?** (Make-or-break for v1 + validation.)
3. **Any clip where the ureter is exposed/ICG-lit later?** (Make-or-break for predict-then-reveal.)
4. **Ureter vs. urethra** wording locked.

---

## 12. The novelty line to hold (put on a slide verbatim)

> *We don't segment the ureter — it's invisible when it matters. We predict its **danger corridor**
> from visible anatomy, arm the alert **only during the high-risk phase**, and warn when the energy
> device enters the zone — with calibrated uncertainty. It's the cholecystectomy Critical-View-of-Safety
> paradigm, transplanted to hysterectomy, for a structure you can't see.*
</content>
</invoke>
