# Project Summary — AI "No-Go Zone" to Prevent Ureter Injury in Hysterectomy

*SDS 2026 Summer School — Group 3. Demo + research pitch due Fri 12 Jun.*

## The clinical problem

The **ureter** is the dreaded urologic casualty of hysterectomy. It runs retroperitoneally and
crosses *under* the uterine artery at the cervix — the classic **"water under the bridge"** —
exactly where the surgeon clamps, cuts, or cauterizes the uterine vessels. Get it wrong and the
patient faces fistula, a lost kidney, reoperation, and litigation, often detected days later.

- Benign hysterectomy: ureteral injury **~0.3–1%** (laparoscopic ~0.42%).
- Radical hysterectomy: **5–30%**.
- **The slide-stat:** **>75% of injuries occur in cases the surgeon called routine, with normal
  anatomy** — so they are *not* predictable from pre-op risk factors. That is the core argument
  for **intra-operative** AI assistance rather than pre-op planning.

> **Terminology note:** the surgeon said "urethra," but every dataset and paper concerns the
> **ureter** — the urethra is not in the hysterectomy field. Confirm with the team before the
> talk; a sharp audience will catch the slip.

## The wedge (our original contribution)

The naive idea — "segment the ureter with a CNN" — is **already published** (see below), and the
ureter is usually **not even visible** at the moment of danger (it's under tissue). That double
failure is our novelty.

> **Our pitch:** reframe from *"draw the ureter"* to ***"prevent the cut."*** Predict a
> **ureter danger-corridor / no-go zone** from *visible landmarks* during the **specific
> high-risk phase**, and raise a **proximity alert** when an active energy instrument
> (LigaSure / hook) enters that zone — with **calibrated, uncertainty-aware** confidence so we
> never fake certainty. This is the **Critical-View-of-Safety paradigm** (mature for gallbladder
> surgery) **transplanted to hysterectomy**, where it barely exists.

## What exists vs. what's open

| Area | Status |
|---|---|
| Real-time **ureter segmentation in gynae laparoscopy** | **Demonstrated** — Dice 0.86, 11 surgeries / 3,368 frames, 55-surgeon Turing eval. Dataset **not public**. → plain segmentation = low novelty |
| Ureter ID in **colorectal** (sigmoidectomy) | **Done** 2025, YOLOv8/11, real-time — confirms approach, not our turf |
| **Cholecystectomy** Critical View of Safety / Go-No-Go | **Mature & commercial** (~98% mAP; Medtronic, Theator) — our *template* |
| ICG fluorescence ureteral catheters | Clinical, **hardware**, no AI — the status quo to position against |
| **Phase-aware danger-corridor + energy-proximity alert in hysterectomy** | **Open** — our target |

## Datasets (and the honest gap)

- **AutoLaparo** (MICCAI 2022) — *the* public laparoscopic-hysterectomy dataset: 21 full videos,
  **surgical-phase labels**, **instrument + anatomy segmentation**. Request form, CC-BY-NC-SA.
  **Central gap: the only anatomy class labeled is the *uterus* — there is no ureter label.**
  That missing label is precisely our opportunity.
- The published **gynae ureter dataset is not public** → nobody can trivially clone that result;
  another reason to build on AutoLaparo.
- Auxiliary / analogy: **CholecSeg8k / Cholec80** (CVS template), **Dresden Surgical Anatomy**,
  **SurgVU** (Intuitive, Jan 2025), **SurgBench**.
- **Mitigation for the missing label:** have our **surgeons annotate the ureter danger-corridor**
  on a handful of AutoLaparo clips. This is both our **ground truth** *and* our
  "whole-team-worked-together" artifact (group-dynamics rubric item).

## What we'd build (demo)

Inference can be **pre-computed per clip** so it looks real-time without live GPU:

1. **Phase gate** — use AutoLaparo phase labels to detect the high-risk steps (uterine-vessel
   ligation / colpotomy) and **only arm the alert then**. Easy win on existing annotations.
2. **Instrument tracking** — use AutoLaparo's instrument segmentation to follow the energy-device
   tip.
3. **No-go corridor overlay** — model (or surgeon-annotated prior) predicts the ureter danger
   zone from visible landmarks.
4. **Proximity alert + calibrated confidence** — warn when the active instrument enters the zone;
   show "low confidence — verify" rather than pretending to be perfect.

Clinical members own the **alert-ergonomics** slide: when does a warning *help* vs. *annoy*, and
how to define a "near-miss." That is the half CS can't do — exactly what assessors want to see.

## How it maps to the rubric

- **Problem statement:** strong real need; the ">75% in routine cases" stat lands it.
- **Methodology:** concrete plan on a real public dataset + a defined annotation step.
- **Prototype quality:** overlays on **real surgical video**.
- **Clinical-evidence plan:** prospective reader / near-miss study — time-to-ureter-ID or
  near-miss rate **with vs. without** the assist; **universal cystoscopy** as injury ground truth;
  cite the existing 55-surgeon Turing eval as a template.
- **Novelty / not-yet-solved:** CVS-style danger-zone + energy-proximity is *open* for hysterectomy;
  predicting the *non-visible* corridor is the under-explored, more clinically honest angle.

## Pros / cons vs. idea1 & idea2

- **+** Directly surgeon-driven (real clinical co-author), real public dataset (AutoLaparo),
  visually compelling demo, clear CVS analogy de-risks the methodology.
- **−** Plain ureter segmentation is taken → we *must* hold the "danger-corridor / proximity /
  phase-aware" framing to stay novel. Ureter often not visible/annotated → don't promise
  pixel-perfect segmentation.
- Strongest **clinical-relevance + feasibility** combo of the three **if** we keep scope to a few
  well-annotated clips rather than the whole dataset.

## Biggest feasibility risk to plan around

The ureter is often **not visible/annotated** in AutoLaparo. **Do not** promise pixel-perfect
ureter segmentation. Keep the claim to *"predicted danger zone + proximity alert on the high-risk
phase,"* and annotate a small, surgeon-curated clip set as ground truth.

## Open questions before committing

1. **What's in the shared Colab/Drive?** Is AutoLaparo (or Cholec80) already there, with pretrained
   models? Decides how much we build vs. fine-tune.
2. **Can our surgeons annotate** the ureter danger-corridor on ~5–10 clips by Thursday?
3. **Confirm ureter vs. urethra** framing with the clinical team and lock the one-line problem
   statement.

## Sources

- Real-time ureter auto-segmentation in gynae laparoscopy — https://pubmed.ncbi.nlm.nih.gov/38115728/
- AutoLaparo dataset — https://autolaparo.github.io/ · https://arxiv.org/abs/2208.02049
- Ureter ID in laparoscopic sigmoidectomy (YOLOv8/11, 2025) — https://pubmed.ncbi.nlm.nih.gov/40263136/
- Automated critical-structure ID in cholecystectomy (CVS) — https://pubmed.ncbi.nlm.nih.gov/36272018/
- Systematic review, AI anatomy ID in cholecystectomy — https://link.springer.com/article/10.1007/s00423-025-03651-6
- Ureteral-injury incidence review — https://pmc.ncbi.nlm.nih.gov/articles/PMC8491787/
- Preventing urinary-tract injury at hysterectomy — https://www.contemporaryobgyn.net/view/preventing-urinary-tract-injury-time-hysterectomy
- ICG for ureter identification in TLH — https://link.springer.com/chapter/10.1007/978-981-97-3226-5_21
