# Project Summary — Bone Surface Extraction from Ultrasound

*SDS 2026 Summer School — Group 3. Demo + research pitch due Fri 12 Jun.*

## The clinical problem

Orthopedic surgery (fracture reduction, implant/needle placement, spine, pelvis, distal
radius) traditionally relies on **fluoroscopy** for intraoperative guidance — i.e. **X-rays /
ionizing radiation**, repeatedly, for both patient and surgical team. **Ultrasound (US) is a
radiation-free, cheap, portable, real-time alternative** — *if* the bone surface can be
reliably extracted from the image. The hard part: bone in US is obscured by speckle noise,
acoustic shadowing, signal dropout, and only shows up clearly when the probe is roughly
perpendicular to the surface.

## The dataset (centerpiece): UltraBones100k

Wu et al. (2025), Balgrist / ETH Zurich. The largest public dataset for this task:

- **~100k 2D B-mode US images** of human cadaver lower limbs (tibia, fibula, foot bones),
  each with a **bone-surface label**.
- Labels are generated **automatically** (not hand-drawn): a CT bone model is tracked and
  superimposed onto tracked US frames, then refined with an intensity-based optimization —
  capturing even low-intensity bone regions that human annotators miss.
- Ships with a **pretrained U-Net** for 2D bone segmentation. Public on GitHub.

## The research thread Larissa assembled

The annotated papers form an argument, not just a reading list:

1. **Phase-based features (2009)** — frames the clinical problem + the old, hand-crafted approach.
2. **UltraBones100k (2025)** — the dataset + pretrained 2D segmentation model.
3. **FUNSR (2024)** — reconstructs 3D bone surfaces via *signed* distance functions; **fails on
   thin/open surfaces**.
4. **UltraBoneUDF (2026)** — fixes that with *unsigned* distance functions (handles open/thin
   surfaces) → current state of the art. **But it requires 3D ultrasound.**

## What's already solved vs. what's open

"Bone from ultrasound" isn't one problem — it's a chain, solved at different levels. The core
**geometry** problem is largely solved (mostly by this same Balgrist/ETH group). The **clinical
translation** problem is not.

| Sub-problem | Status | Who / what |
|---|---|---|
| **1. 2D segmentation** — bone contour in one B-mode frame | **Largely solved** (in-distribution) | UltraBones100k U-Net *beats expert manual labels*; UBS-Net at 21 fps |
| **2. Auto-labeling** — big datasets without hand-drawing | **Solved** | UltraBones100k's core contribution (tracked CT → labels) |
| **3. 3D reconstruction from *tracked* sweeps** | **Largely solved, recently** | FUNSR (closed) → UltraBoneUDF (open/thin, sub-mm–1.6 mm), Jan 2026 |
| **4. Trackless 3D** — reconstruct from a 2D sweep *without* a tracker | **Open / hard** | "Sensorless freehand US" — active research, not solved well |
| **5. Ex-vivo → in-vivo** — works on cadaver; does it work on live patients? | **Open** | Paper itself notes performance *drops* in vivo |
| **6. New anatomy** — spine, pelvis, skull, upper limb | **Mostly open** | Model is lower-limb; some femur/pelvis generalization, with caveats |
| **7. Clinical decision loop** — does the bone surface *change* a surgical action/outcome? | **Open / barely touched** | Papers report geometric metrics (Chamfer/Dice), not surgical task success |

**Implication for originality:** rows 1–3 are solved (re-running them = reproduction; "2D
UltraBoneUDF" is plausibly the authors' own next paper). The room is in **rows 4–7**:

- **Row 5 (ex-vivo→in-vivo)** — most demo-friendly: run the pretrained model live on a
  volunteer/phantom; failure cases are themselves a finding. (Needs a probe — Q10.)
- **Row 7 (clinical decision)** — best clinical-relevance score: build a downstream measurement
  (fracture gap/displacement, curvature angle, leg-length) on top of segmentation. Clinical members own this.
- **Row 4 (trackless 3D)** — most original, highest risk; matches Larissa's "no tracker" instinct.
  Likely too hard to *solve* in 4 days, but pitchable as direction + proof-of-concept.
- **Row 6 (new anatomy)** — medium; depends on getting data for another bone.

Strongest pitches **combine two** — e.g. run SOTA live in-vivo (row 5) *and* turn its output into a
fracture-displacement measurement a surgeon acts on (row 7): feasible, original, clinically grounded.

## What she's proposing

Bring bone extraction into the **clinically practical 2D-ultrasound setting**, rather than the
expensive 3D setting the SOTA assumes. Her note: *"3D u/s machine = \$\$\$ + limited
availability; we work with 2D because it's practical and accessible."* The UltraBones100k
dataset + pretrained model are the natural tools, since they're fundamentally 2D.

## What we'd be building

Two readings, very different in scope — **needs to be pinned down before we build**:

- **Safe / demo-ready:** 2D bone-surface segmentation on US frames using UltraBones100k + the
  pretrained model. Clinically motivated, low-risk, achievable by Friday.
- **Ambitious:** bring UltraBoneUDF-style **3D open-surface reconstruction** to the cheap 2D
  setting — only feasible if we also handle probe pose/tracking.

## Key nuance to get right

What the papers call **"3D ultrasound" is *freehand* 3D US** — a normal **2D probe** swept over
the anatomy, with each frame placed in 3D via an **optical tracking system** (+ CT registration).
The expensive, limited-availability part is the **tracker**, *not* a special 3D US machine. So:

- 2D segmentation → easy (data + weights exist).
- 3D reconstruction from 2D US **without tracking** → hard ("sensorless freehand US"); a research
  problem in itself, ambitious for 4 days.

## Open questions for the team 

1. **2D segmentation, or 3D reconstruction?** (the biggest fork)
2. If 3D: do we assume *any* pose/tracking info, or is trackless the goal?
3. What's actually in the shared Colab / GitHub repo (data format, weights) that's runnable now?

## Additional questions (strategic — maps to judging: originality, clinical relevance, demo)

The above are *technical scoping*. These decide whether the pitch is strong or a reproduction.

**Originality (biggest risk)** — the dataset, pretrained model, *and* the 2D-vs-3D framing all come
from the same group (Wu / Fürnstahl, Balgrist + ETH; UltraBoneUDF is Jan 2026).

4. What do *we* add beyond re-running their pretrained model on their data? (Need a wedge.)
5. Isn't "2D version of UltraBoneUDF" just their obvious next paper — are we racing the dataset's
   own authors?

**Clinical relevance (lean on the 3 clinical members)**

6. Which procedure / anatomy are we pitching? Data is **ex-vivo lower limb** (tibia, fibula, foot) —
   is that the right story, or is it distal-radius fracture / spine / pelvis / needle guidance?
7. What does the surgeon actually need — a contour overlay, a *measurement* (e.g. fracture
   gap/displacement), a 3D model, or real-time feedback?
8. What would make a clinician say "I'd use this" vs. "neat tech demo"?

**Ex-vivo → in-vivo gap** (dataset is cadaver; paper notes performance drops on live tissue)

9. Do we have any in-vivo US data, or can we capture our own?
10. **Is a 2D US probe available at the school?** A live probe → real-time bone overlay would be the
    single biggest boost to demo quality — and is achievable with the pretrained 2D model.

**Release contents (sharpens Q3)**

11. Does the public release include tracking + CT data, or only images + labels? (Make-or-break for
    the 3D path — no poses/CT → reconstruction isn't reproducible.)
12. Colab Pro: enough for fine-tuning, or inference-only?

**Logistics**

13. What's the concrete demo artifact the judges see on Friday? (Decide early, work backward.)
14. How do 3 CS + 3 clinical split the work over 4 days?
15. What do our two assigned mentors specialize in — can they steer the angle or unlock data/a probe?

> If only two get asked first: **#4** (our original contribution) and **#10** (probe / in-vivo data
> for a live demo) — these decide strong pitch vs. reproduction.
