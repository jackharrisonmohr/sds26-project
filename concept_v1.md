# NOLO — The Shared Per-Case OR Setup

*SDS 2026 Summer School — Group 3. Demo + research pitch, Fri 12 Jun. Supersedes `concept_v0.md`.*

**NOLO = "No One Left Out."** A shared, per-case **OR setup artifact** that syncs with the day's
schedule and generates, for *each* case: the **patient-specific pick list + safety staging** *and*
the **role-based floor plan + patient positioning** — then pushes it to the **whole team, including
the prep/turnover crew** nobody else builds for.

> One line for the judges: *Today the OR runs on stale, surgeon-centric, un-shared artifacts —
> preference cards, whiteboards, nurses' cheat sheets, the surgeon's head. NOLO turns them into one
> shared per-case setup that covers **materials + people + space + position**, personalized to the
> procedure, the surgeon/team, and **this patient**.*

---

## 1. The clinical problem (real need)

The same root pathology shows up on two axes:

**Materials axis (waste + safety):**
- 26% of opened sterile supplies go unused; ~40% of items on a preference card are never used.
- Missing-instrument delays pause cases with the patient under anesthesia → downstream delays,
  same-day cancellations. "Never events" (count discrepancies) still occur.

**People / space / positioning axis (dead time + communication):**
- Large fraction of OR time is non-operative (turnover, positioning, induction, prep). Turnover and
  setup depend on slow, verbal, surgeon-centric communication.
- **Patient positioning** is a major surgeon-communicated item (lateral decubitus, bean bag, etc.)
  that today lives on a whiteboard or in the scrub nurse's head — and breaks when plans change.
- The **prep/turnover crew** that actually sets up and flips the room is invisible to every existing tool.

> The slide-stat: preference cards (and whiteboards) optimize for the *average* case with the *core*
> team. Nobody prepares **this patient, this case, this whole crew.**

## 2. What we're building (the product)

One **per-case setup artifact**, delivered on a schedule-synced iPad app (syncs overnight with the
day's OR list → no PHI breach, mirrors how hospitals already operate). For a selected OR it shows:

| Layer | Content | Axis |
|---|---|---|
| **Floor plan** | Role-based, color-coded OR layout (surgeon, assistant, scrub + back table, anaesthesia, circulating/**turnover**, imaging, equipment), with the **sterile field** + drape boundary | NOLO |
| **Positioning** | Patient position + required equipment (e.g. lateral decubitus → bean bag, hip posts), broadcast to the whole team | NOLO |
| **Crew & turnover** | Every role + their setup/turnover task — *no one left out* | NOLO |
| **Pick list** | Patient-specific instruments/supplies, with **waste pruning** + **safety-staged additions** | v0 |
| **Video-mined usage** | Instrument usage corrected from the laparoscopic feed (Cholec80) | v0 |

Everything reflows with **procedure × surgeon preference × patient factors** (allergy, anticoagulation,
adhesions, BMI, difficult airway, imaging flags).

## 3. The wedge — our original contribution

The space is **crowded at the edges, empty in the middle** (full detail in `competitive-analysis.md`).
Every layer ships commercially; **no one fuses them into one shared per-case artifact.** Two moves
nobody combines:

1. **Risk → physical staging (our LEAD leg).** Not "swap the allergic item" (Cerner patented that in
   2002) but *"this patient's predicted events → stage these materials **and** these people/position
   now"* — anticoagulated → hemostatics + blood; adhesions → open-conversion tray; BMI 41 → bariatric
   table + 2 extra transfer staff. Risk *models* are mature; the translation into a **prep/pick/staffing
   action** is open.
2. **Shared, whole-team, schedule-synced setup.** Not a surgeon's card, not an analytics dashboard —
   a single artifact every role (incl. turnover) sees, that encodes each **team's tribal knowledge**
   (floor plan + positioning templates) and updates when plans change.

Supporting asset (uses the school's CV data): **video-mined instrument usage** from the laparoscopic
feed corrects the **reusable-instrument** set from what *actually entered the field* — the part where
scan/charge data is silent (reusable lap instruments aren't scanned per case). Disposable supplies and
implants come from existing **barcode/RFID/UDI scan**, not vision. Ambient OR-room cameras can't read
fine-grained or micro-instruments, so **vision is not our materials ground truth** (see §8).

**What we must NOT claim as novel** (own these on stage): patient-specific *substitution* of card items
(Cerner US 8,095,378), and **camera-based turnover analytics (Apella — shipped, peer-reviewed)**. Our
novelty is the *shared per-case setup that fuses materials + people + position*, not cameras-in-the-OR.

## 4. Competitive landscape (one-screen version)

| Category | Players | Why they don't close the gap |
|---|---|---|
| Preference-card optimization | PREFcards, DOCSI, Medline, Vizient, Picis | Surgeon-centric, billing-log waste only; no patient risk staging, no people/space |
| Supply / pick-list logistics | Owens & Minor, BD Pyxis, Censis | Own the logistics, build from static cards |
| Case coordination / readiness | **DocSpera**, ExplORer (GHX) | Closest neighbors; implant/vendor logistics, not patient-risk prep or shared positioning |
| Surgical video analytics | **Apella**, Caresyntax, Theator, Touch Surgery | Cameras → turnover/timestamps/docs; never the per-case *setup artifact* |
| Pre-op risk prediction | Hoopcare, Calcium, Duke PROMISE | Output a risk *score*, not a materials/staffing *action* |

Full detail + URLs in `competitive-analysis.md` and `competitive-summary.md`.

## 5. The demo (what exists for Friday)

**`demo/nolo.html`** — a single self-contained file (no build/server/deps; just `open` it). It's the
unified setup screen: live OR floor plan + positioning + crew on the left, pick list + safety flags +
video-usage on the right. See `demo/README.md`.

**90-second stage script** (scripted buttons make it one-click reliable):
1. **Reset** → generic Lap Chole. "This is the static card + whiteboard today."
2. **Apply video-mined usage** → scissors/bipolar flagged <40% on-field. *"Corrected from the in-body feed."*
3. **Load risky patient** (anticoag + adhesions) → hemostatics/blood/open-tray **added**, C-arm + scrub-side reflow. *"Risk → physical staging."*
4. **Load large patient** (BMI 41 + difficult airway) → bariatric trocars + **+2 transfer crew** + 2nd anaesthetist appear in the plan. *"No one left out."*
5. **Switch to Total Hip** → whole plan reflows: lateral decubitus + bean bag, implant table, THA instruments.
6. **Toggle role layers** → each role sees their own setup; anaesthesia sits outside the sterile field.

## 6. AI methodology

- **Fusion engine (LLM, structured generation):** input *(procedure + surgeon/team prefs + structured
  patient profile)* → output the structured setup object (pick list, safety staging, positioning,
  floor-plan placement, crew tasks) with a per-item **"why" rationale.**
- **Video usage model (CV):** tool-presence detection on **Cholec80/AutoLaparo** with the provided
  pretrained models → instrument usage histogram → auto-corrects the instrument set.
- **Curated clinical knowledge base:** procedure templates, surgeon-preference sets, patient-safety
  rules, and floor-plan/positioning templates — authored by our surgeons (this is the clinical IP and
  the group-dynamics story).

## 7. Clinical evidence plan

Prospective study vs. current preference cards + whiteboards. Endpoints across both axes:
- **Materials:** opened-but-unused %, missing-item delays, count-discrepancy near-misses.
- **People/space:** turnover/setup dead time, positioning-communication errors, "everyone knew the plan" compliance.
- **Safety:** patient-specific safety items present at incision; conversion-readiness when predicted.
- Design: stepped-wedge across ORs; start in **simulation**, then **elective cases at a tertiary center.**

## 8. Data plan — match each signal to what it can actually capture

A clinical reviewer flagged that **ambient OR-room cameras cannot identify most instruments** — micro-
tools, items distinguished only by stamped sizes/catalog numbers (implants, screws, broaches), heavy
occlusion (hands/trays/drapes), distance, specular metal and motion blur all defeat fine-grained tool
ID from a ceiling camera. They're right — so we match each ground-truth signal to what it can really see:

| What we need to know | Right signal | Why |
|---|---|---|
| **Disposable supplies + implants used** | Barcode / RFID / **UDI** scan + charge capture | Captured at point of use; UDI is regulatory. How Pyxis / IDENTI / Censis actually work — not vision. |
| **Reusable instruments actually used** | **In-body laparoscopic CV** (Cholec80 tool-presence) | Reusable lap instruments aren't scanned per case → scan data is silent; the scope feed shows what truly entered the field. Right-sizes instrument trays. |
| **People / space / positioning / turnover** | **OR-room cameras** (Apella-style; gross visible entities) | People, draping, patient-in/out, room state ARE visible. The only place ambient room CV belongs — and it's the NOLO axis. |

- **Today (demo):** Cholec80/AutoLaparo (reusable-instrument usage) + surgeon-curated templates & vignettes.
- **Honest gap:** no clean public OR-prep dataset linking patient + supply usage (PHI/proprietary) — the central evidence risk.
- **Roadmap / data contribution:** a prospective collection that **links existing scan/UDI/tray/count
  data to patient records** (the labeled supply-consumption data nobody has), **plus** OR-room video
  (MM-OR / 4D-OR / MVOR substrate) for the **people/space/turnover** axis only — *not* for reading tools.
  Detail in `or-video-datasets.md`.

Progression to show: **scan/UDI + in-body CV (today's signals) → linked to patient records
(prospective collection) → OR-room CV for workflow (roadmap).** The deliberate split: **vision is NOT
our materials ground truth — scan/UDI is.**

## 9. Team & group dynamics (who owns what)

| Person | Lane |
|---|---|
| CS 1 | Frontend / the single setup screen + interactions |
| CS 2 | LLM fusion engine + structured schema + rationale + caching/fallback |
| CS 3 | Video pipeline (Cholec80 tool-presence → usage JSON) |
| Clinical 1 | Procedure base cards + floor-plan / positioning templates |
| Clinical 2 | Patient-safety rules (risk → materials/staffing/position) |
| Clinical 3 | Evidence-plan + problem framing + live clinical narration |

Surgeons own the rules/templates; CS owns the engine/UI/CV. Visibly unites both halves of the team.

## 10. Implementation / TRL roadmap

Beta in **surgical simulation** (controlled, no interruption) → reach **TRL 8/9** → deploy for
**elective cases at a tertiary center** (lower stress, fewer complications) → **full scale** once
validated. Camera-based auto-learning of templates is a later-stage feature, not the MVP.

## 11. How it maps to the rubric

- **Problem statement:** hard waste/safety numbers **+** dead-time/positioning pain — strongest real need.
- **Methodology:** LLM fusion + video usage model + curated clinical rules.
- **Prototype:** finishable, single-file, visually compelling (floor plan + live toggles).
- **Clinical evidence:** prospective stepped-wedge across both axes.
- **Feasibility & novelty:** highly deliverable; novelty = the **shared per-case setup** corner
  (not card optimization, not camera analytics — both solved).
- **Attractiveness & group dynamics:** "No One Left Out" hook; surgeons own rules, CS owns engine.

## 12. Risks & open questions

1. **Scope creep** — NOLO can sprawl into 6 products. Hold the line: the demo is the *setup artifact*;
   camera-learning + live scheduling integration are roadmap.
2. **Novelty framing** — do NOT pitch patient personalization (Cerner) or camera/turnover (Apella) as
   novel; lead with risk→staging + the shared whole-team artifact.
3. **Colab assets** — confirm the pretrained tool-presence model + Cholec80 are accessible (decides
   real vs mock video leg).
4. **Surgeon-curated content** — lock 1–2 procedures' templates + patient rules tonight.

## Related docs
- `competitive-analysis.md` / `competitive-summary.md` — full landscape + URLs + the Cerner/Apella threats.
- `or-video-datasets.md` — OR-room datasets for the roadmap (MM-OR / 4D-OR / MVOR) + access.
- `demo/nolo.html` + `demo/README.md` — the working prototype + stage script.
- `concept_v0.md` — prior (materials-only) version, superseded by this.
