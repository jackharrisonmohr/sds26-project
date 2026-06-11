# Project Summary — Vision-Based Fatigue Monitoring for the Surgical Team

*SDS 2026 Summer School — Group 3. Demo + research pitch due Fri 12 Jun.*

## The clinical problem

Surgeon fatigue measurably degrades performance — sleep deprivation increases technical
errors in laparoscopic tasks, and fatigue-induced hand tremor (4–25 Hz) rises with muscle
fatigue during long cases. Yet fatigue is currently managed only with **blunt duty-hour
limits**, which ignore real-time, intra-operative fluctuation. Cars solved the analogous
problem with driver-monitoring cameras. The OR has no equivalent.

## The wedge (our original contribution)

The naive idea — "put a driver-drowsiness camera in the OR" — **fails**, and that failure is
our novelty. Driver monitoring assumes (1) an unobstructed face and (2) a static seated
operator. The OR violates **both**: surgeons are **masked**, wear **loupes/headlights**, look
**down or at a laparoscopy screen**, and the team is **mobile**.

> **Our pitch:** estimate fatigue from the signals that *survive* the OR — **periocular
> dynamics** (eyes are all you see above a mask), **body pose** (postural strain, sway,
> micro-rest), and **instrument-motion smoothness/tremor** — and track a **temporal fatigue
> index across a case**, at the **team** level, not just the lead surgeon. Instrument
> telemetry is the OR's version of a car's steering/lane signal.

## What exists vs. what's open

| Area | Status |
|---|---|
| Driver fatigue (PERCLOS/EAR/yawn) | **Solved**, commodity — but assumes full face → doesn't transfer |
| Surgeon-fatigue AI | **Aspirational** — 2025 reviews list HRV/EEG/eye-tracking but report *no datasets, no validation* |
| OR team pose / scene understanding | **Mature CV** (MVOR, 4D-OR, MM-OR) — but **not about fatigue** |
| Vision-based intra-op fatigue from OR-surviving signals | **Open** — our target |

## Datasets (and the honest gap)

- **No public surgeon-fatigue-labeled OR dataset exists** (privacy + masks). This is the
  central risk: we can't quantitatively *prove* fatigue detection from public data alone.
- Usable building blocks: **MVOR** (732 multi-view RGB-D frames, real surgery, pose),
  **4D-OR** (10 simulated knee replacements), **MM-OR**; **JIGSAWS** (robotic kinematics, but
  *skill*-labeled, not fatigue).
- **Mitigation — self-collected pilot (Tue–Thu):** one team member does a repeated fine-motor
  task (box trainer / peg transfer / tracing) **fresh vs. fatigued**; label by time-on-task +
  **NASA-TLX / Karolinska Sleepiness Scale**. Converts "neat idea" → "we saw the signal in
  pilot data."

## What we'd build (demo)

Off-the-shelf, **no training required**, runs live:

1. **Periocular fatigue meter** — MediaPipe Face Landmarker → blink rate + eye-closure
   (PERCLOS/EAR) from the **eye region only** (lower face masked, OR-honest).
2. **Pose/ergonomic-strain meter** — MediaPipe Pose / RTMPose → postural sway, neck/back angle
   (RULA/REBA-style), micro-rest rate. Run live **and** on MVOR/4D-OR clips (real OR footage).
3. **Fused fatigue index** trended over time — the climbing curve is the story.

Clinical members own the **ethics/acceptance** slide (autonomy, privacy/GDPR, "support not
surveil") — flagged in the literature as the #1 adoption barrier.

## Pros / cons vs. idea1 (bone-from-ultrasound)

- **+** Cleaner novelty wedge (invert the car paradigm), more clinically relatable, demos live.
- **−** No ground-truth labels → validation is qualitative unless we self-collect.
- idea1 is the safer/more rigorous *project*; this is the stronger *pitch* **if** novelty is
  the dominant scoring axis and we collect a small pilot set.

## Open questions before committing

1. **What's in the shared Colab?** Laparoscopic video (Cholec80-type)? Any kinematics? Any
   OR-pose data? (Decides whether the instrument-motion angle is possible.)
2. **Can we self-collect** 1–2 hrs of fresh-vs-tired motor-task video? (Make-or-break for
   validation.)
3. **Can mentors unlock** even 10 min of de-identified real OR / box-trainer footage?
