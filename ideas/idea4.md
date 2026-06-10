# Project Summary — Patient-Specific OR Prep: Smart Per-Surgery Checklist & Pick List

*SDS 2026 Summer School — Group 3. Demo + research pitch due Fri 12 Jun.*

## The clinical problem

OR preparation today runs on **static surgeon "preference cards"** that drift out of date as they
are copied and reused. The result is simultaneous **waste** and **risk**:

- **26%** of opened sterile supplies go unused; **~40%** of items on a typical preference card are
  never used in the case.
- ~**$15M/yr** in wasted surgical supplies (one estimate); **$230–810 wasted per case** in a
  neurosurgery series.
- **Missing-instrument delays** force pauses with the patient under anesthesia → a domino effect
  of downstream delays and **same-day cancellations**.
- "**Never events**" (instrument/sponge count discrepancies) are predictable but still occur.

> **The slide-stat:** preference cards optimize for the *average* case; nobody prepares for **this
> patient, this case**. ~40% waste sits right next to missing-item delays — both stem from the
> same un-personalized list.

## The wedge (our original contribution)

Generic preference-card optimization is **already commercial** (see below). Our novelty is the
layer nobody has built: a **per-surgery prep artifact that fuses three inputs** —
**(1) what the procedure actually needs**, **(2) team/surgeon preferences**, and
**(3) patient-specific needs** — with a **dual objective: strip waste *and* add patient-specific
safety items.**

> **Our pitch:** input *(procedure + patient profile + team prefs)* → output a **tailored prep
> checklist + pick list + patient-specific safety flags.** Examples of personalization no card
> does today:
> - latex allergy → swap the supply set; anticoagulated → pre-stage hemostatics / blood;
> - prior surgery/adhesions or high BMI → add specific instruments / longer tools / retractors;
> - predicted **conversion-to-open** or bleeding risk → stage the open tray;
> - comorbidity/imaging-derived **safety flags** surfaced at prep time.

## The asset-fit bridge (fixes novelty *and* uses the provided CV data)

The plain app ignores the surgical-video datasets + pretrained models the school gave us. Bridge it:

> **Mine what was *actually used* from surgical video** — tool-presence detection on
> **Cholec80 / AutoLaparo** with the provided models — to produce the ground-truth "what this
> procedure really needs," and use it to **auto-correct the preference card.** Then layer
> patient-specific personalization on top.

This (a) uses the provided CV assets, (b) closes a loop current tools can't — they rely on
billing/scan logs, not on what was truly on-field — and (c) gives us a real **model** so
"Adequate AI methods" isn't just prompt-engineering. It also visibly unites the CV and clinical
halves of the team.

## What exists vs. what's open

| Piece | Status |
|---|---|
| Preference-card optimization from usage data | **Done & commercial** — JAMA Surgery 2024, automated time-series algorithm, $1.1M-savings studies, Medline/Vizient/Incision, UCSD supply-list release (Nov 2025) |
| Instrument-tray optimization | **Done** — Operations Research paper, systematic reviews, 54% unused-instrument reduction |
| Dynamic / context-aware checklists | Exists (ICU); generative-AI dynamic checklists being actively discussed |
| Patient risk / complication prediction | **Mature** — "Patient Optimizer" & others, AUC 0.74–0.91 |
| **Patient-personalized prep (waste + safety) + video-mined usage** | **Open** — our target |

## Datasets (and the honest gap)

- **No clean public OR-prep dataset** — patient + supply-usage data is PHI/proprietary. This is the
  central evidence risk.
- Usable building blocks: **Cholec80 / AutoLaparo** (for video-mined tool usage), the provided
  pretrained tool-presence models.
- **Mitigation:** curate a small **knowledge base + synthetic patient vignettes with our three
  surgeons** (they encode the preference logic, procedure requirements, and patient-safety rules).
  Good enough to demo; the rigorous proof is the proposed study below.

## What we'd build (demo)

An **LLM-driven structured-generation app**, very buildable in 2 days and visually compelling:

1. **Input** — procedure + structured patient profile (allergies, comorbidities, anticoagulation,
   BMI, prior surgery, imaging flags) + team/surgeon preference set.
2. **Engine** — generates a **tailored prep checklist + pick list**, with **waste pruning** (drop
   items historically/video-confirmed unused) and **patient-specific safety additions**.
3. **(Optional, asset-fit) usage model** — tool-presence detection on Cholec80/AutoLaparo feeds
   "what's actually used" back into the card.
4. **Output UI** — clean checklist with safety flags highlighted and a short "why each item"
   rationale.

## How it maps to the rubric

- **Problem statement:** best "real need" of all our ideas — hard waste/safety numbers.
- **Methodology:** LLM generation + (optional) video-mined usage model + curated clinical rules.
- **Prototype quality:** finishable, demoable, frontend-friendly.
- **Clinical-evidence plan:** prospective study — waste reduction (opened-unused %), missing-item
  delays, checklist compliance, near-miss rate **vs. current preference cards**.
- **Feasibility & novelty:** highly deliverable; novelty rests on **personalization + video-mined
  usage** (not generic card optimization, which is solved).
- **Attractiveness & group dynamics:** relatable to any OR audience; **best idea for showing
  CS+clinical teamwork** — surgeons own the rules, CS owns the engine.

## Pros / cons vs. the other ideas

- **+** Easiest to *finish* by Friday; strongest real-need + group-dynamics; visually compelling.
- **−** Components are commercialized → novelty depends entirely on holding the personalization +
  video-mined-usage wedge; no public data → evidence is a *proposed* study, not a result.
- Risk profile is the **inverse of idea3** (ureter): that one is high-novelty/clinical but
  data-constrained; this one is high-deliverability but moderate-novelty.

## Verdict across all four ideas

**idea3 (ureter no-go zone)** = highest-novelty, most-clinical, data-constrained.
**idea4 (this)** = most deliverable, best group-dynamics, novelty needs the wedge.
These two are the real finalists. The **video-generation idea** is best as a *supporting method*
(synthesize rare events) for idea3, not a standalone.

## Open questions before committing

1. **What's in the shared Colab/Drive?** Tool-presence models for Cholec80/AutoLaparo? Decides
   whether the video-mined-usage bridge is feasible.
2. **Will our surgeons curate** ~3–5 procedures' worth of preference logic + patient-safety rules
   by Thursday?
3. **Personalization wedge confirmed?** Lock that we are NOT pitching generic preference-card
   optimization (solved) but patient-specific prep + waste/safety dual objective.

## Sources

- Preference Card Optimization — JAMA Surgery (2024) — https://jamanetwork.com/journals/jamasurgery/fullarticle/2841793
- Automated preference-card optimization algorithm — https://pmc.ncbi.nlm.nih.gov/articles/PMC8661396/
- Data-Driven Surgical Tray Optimization (Operations Research) — https://dl.acm.org/doi/abs/10.1287/opre.2022.2426
- Tray-optimization systematic review — https://pmc.ncbi.nlm.nih.gov/articles/PMC12084675/
- Data-driven surgical supply lists reduce cost & waste — UCSD (Nov 2025) — https://health.ucsd.edu/news/press-releases/2025-11-26-data-driven-surgical-supply-lists-can-reduce-hospital-cost-and-waste/
- The real cost of surgical waste — Incision — https://www.incision.care/blog/the-real-cost-of-waste-in-surgery
- ML for patient safety in surgery (never events) — https://link.springer.com/article/10.1186/s13037-024-00422-y
- Situation Awareness for Automated Surgical Check-listing — https://arxiv.org/pdf/2209.05056
- Patient Optimizer (POP) surgical-risk ML — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10929113/
