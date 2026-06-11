# Competitive Analysis — Patient-Specific OR Prep

*SDS 2026 Group 3. Supports the "Feasibility & novelty / not-yet-solved" rubric line.*

## TL;DR for the pitch

The OR-prep space is **crowded at the edges but empty in the middle**. Every individual
layer of our idea already exists commercially — preference-card optimization, supply/pick-list
automation, case coordination, surgical video analytics, preop risk prediction — but **no one
fuses them into a single per-case artifact**, and crucially **no commercial tool mines what was
*actually used* from surgical video** to correct the card. That fusion is our white space.

**One honest caveat we must address head-on:** patient-specific *substitution* of preference-card
items is **prior art** — Cerner patented it in 2012 (filed 2002), latex-allergy example included.
So we must NOT pitch "personalize the card for the patient" as the novelty. The defensible novelty
is the **dual move nobody combines: (a) video-mined ground-truth usage as the waste-pruning signal,
and (b) risk-prediction-driven *additions* — staging safety/rescue items for predicted events**
(conversion-to-open, bleeding), not just swapping incompatible ones.

---

## The competitive landscape — 6 layers

### 1. Preference-card optimization — **commoditized, our "do not pitch this" zone**
These reduce waste by trimming cards using **scan/charge/ORIS usage logs** (not video). Direct
overlap with the "strip waste" half of our objective.

| Company | What it does | Note |
|---|---|---|
| **PREFcards** | SaaS preference-card optimization; **US Patent 12,308,115** (Nov 2025) for automated data aggregation + predictive modeling | Newest patent in the space — IP-active |
| **DOCSI** (Minneapolis, surgeon-founded) | Mobile-first preference dashboard; took **iGan Partners investment Aug 2025** | Funded, growing; closest "modern startup" competitor |
| **Medline PrefConnect** | Cloud card-cleansing app; interfaces with ORIS to optimize utilization | Distribution muscle |
| **Vizient** | Continuous card-quality monitoring + savings guidance | GPO incumbent |
| **Picis** | Monitors cases to update supply recs from actual usage | Periop EHR incumbent |
| **LiveData, HST Pathways, PegaSys (ORion), HealthTrust** | Card management / optimization variants | Long tail |

**Takeaway:** this layer is *solved and saturated*. JAMA Surgery (2024) + UCSD release (Nov 2025)
make it academically settled too. We reference it as "the solved part we build on," never our pitch.

### 2. Surgical supply chain / inventory / pick lists — **adjacent incumbents**
Automate case carts, pick lists, charge capture, tray tracking.

- **Owens & Minor SurgiTrack** — custom surgery packs picked + delivered ready-to-use.
- **BD Pyxis ProcedureStation** — item picked/returned tracking, case costing, charge capture.
- **IDENTI Medical** — AI inventory, "stop losing 2% OR revenue."
- **STERIS SPM / Censis CensiTrac** — instrument-tray tracking; CensiTrac auto-builds case-specific
  picklists from the OR schedule.
- **GHX, Cardinal Health, MEDITECH Expanse Surgical** — supply-chain / real-time supply tracking.

**Takeaway:** they own the *logistics* of the pick list but build it from the **same static cards**.
They don't decide *what should be on it for this patient*. We sit upstream of them.

### 3. Case coordination / readiness / scheduling — **closest to "a prep artifact"**
- **DocSpera** ("Surgery Care Operating System") — pre-op planning, implant/vendor sync, case
  readiness, OR-cancellation reduction; orthopedic plans via TraumaCad. **The nearest neighbor to
  our concept** — but it's coordination/implant-logistics, *not* AI-generated patient-specific
  safety prep, and not video-grounded.
- **ExplORer Surgical (a GHX company)** — intraoperative digital playbooks/checklists tailored per
  procedure, role-specific OR "big board." Procedure-level, not patient-level; intra-op not prep.
- **Qventus, LeanTaaS iQueue, Hospital IQ, Apella** — OR throughput/scheduling analytics, not prep
  content.

**Takeaway:** DocSpera and ExplORer prove demand for "structured per-case guidance," but both
stop at procedure/implant logistics. **Neither personalizes prep content to the patient's risk
profile, and neither closes the video loop.**

### 4. Surgical video analytics — **the asset-fit angle (our CV bridge); also our risk**
These do the tool-presence / phase detection we'd use on Cholec80/AutoLaparo.

- **Caresyntax** — CV annotates incision/stapling/suction events into structured timelines.
- **Theator** — cloud surgical-intelligence, step detection, skills scoring.
- **Touch Surgery Enterprise (Medtronic / Digital Surgery)** — records + analyzes minimal-access
  procedures, time-based step analysis.
- **Surgical Safety Technologies (OR Black Box), Proximie, Apella** — OR capture/analytics.
- Market is real: AI surgical video analytics projected **+$1B by 2034** (Jan 2026 report).

**Takeaway — important:** these companies *can* detect tools/phases from the laparoscopic feed, so
the CV capability isn't novel. **What's novel is the *application*: routing video-derived
intracorporeal-instrument usage back into prep/card correction.** None of them does supply prep —
they do documentation, training, and performance review. (Note the data limit: scope video sees
in-body instruments, not the back table — so it corrects the *instrument* set, not all supplies.) That gap is exactly our bridge, but we should expect "couldn't Caresyntax
add this?" as a Q&A challenge and have an answer (data access, EHR/patient-data fusion, workflow).

### 5. Pre-op risk prediction / optimization — **the "add safety items" engine, also exists**
- **Hoopcare** — AI pre-op evaluation; flags cardiac/COPD/infection risk, chart-review notes.
- **Calcium** — perioperative readiness/risk platform.
- **Duke PROMISE, POTTER (MGH/MIT), SORT, SURPAS, "Patient Optimizer" (POP)** — validated surgical
  risk models, AUC ~0.74–0.91.

**Takeaway:** risk *prediction* is mature. But these output a **risk score / optimization plan for
the patient's body** — they do **not** translate risk into **a materials/instrument staging action**
("predicted bleeding → pre-stage hemostatics + cross-matched blood; predicted conversion → stage the
open tray"). That translation — risk → physical prep — is unclaimed territory and is our strongest
novelty leg.

### 6. IP / prior-art landscape — **read before finalizing the deck**
- **Cerner (Oracle Health) US 8,095,378** (granted 2012, filed 2002): *automatically substitutes
  preference-card items incompatible with patient demographics — explicitly the latex-allergy →
  latex-free swap.* ⚠️ **This is our exact latex example.** Patient-specific *substitution/removal*
  is NOT novel. (Filed 2002 → 20-yr term likely lapsed, so not an IP *blocker*, but it is published
  prior art that kills "we personalize the card" as a novelty claim.)
- **PREFcards US 12,308,115** (2025) — automated aggregation + predictive modeling for cards.
- *Not found:* any patent/product fusing **video-mined actual usage + risk-driven safety staging**
  into per-case prep. That's the gap.

---

## Positioning map (how to draw the white space on a slide)

```
                 PATIENT-SPECIFIC  ───────────────►
                 (risk-personalized)

  GENERIC        Cerner '378 patent           ★ OUR WEDGE
  (one card      (substitution only)          patient-risk-driven
   per           DOCSI / PREFcards /           ADD + STRIP, grounded
   procedure)    Medline / Vizient            in video-mined usage
        │        ───────────────────          ──────────────────
        │        Caresyntax / Theator /        (empty today)
        │        Touch Surgery  →  video        DocSpera = closest,
        ▼        analytics, but no prep         but logistics only
   USAGE-BLIND ──────────────────────────► VIDEO-GROUND-TRUTH
   (billing/scan logs)                      (in-body instrument usage; OR-room cams = roadmap)
```

Two axes nobody occupies the far corner of: **(patient-risk-personalized) × (video-ground-truth)**.
Everyone else is generic+log-based, or video-but-no-prep, or patient-but-substitution-only.

## Our defensible novelty (say exactly this)

1. **Video-mined instrument usage as a correction signal.** Cholec80/AutoLaparo are the *laparoscopic
   (in-body) feed*, so scope it honestly: tool-presence detection gives an **objective usage signal
   for the intracorporeal working instruments** (the 7 Cholec80 tools) — correcting the instrument
   portion of the card from what actually entered the field, vs competitors who infer even that from
   billing/scan logs. *Full back-table supply ground truth (sponges, sutures, open tray) needs
   OR-room cameras — that's the roadmap, not the demo.* Narrower than "all OR usage," but real, uses
   the provided CV models, and unclaimed commercially.
2. **Risk → physical staging, the additive half — our LEAD leg.** Not "swap the allergic item"
   (Cerner did that in 2002) but **"this patient's predicted events → stage these rescue materials
   now."** Risk models exist; the translation to a prep/pick action does not. Fully open, and
   unaffected by the in-body-only video limit.
3. **One fused per-case artifact.** Procedure-true usage + team prefs + patient risk → a single
   checklist+pick-list+safety-flags object. The pieces are scattered across 5 vendor categories;
   the fusion is the product.

## Threats / hard questions to pre-empt in Q&A

- **"Cerner / DOCSI already personalize cards to the patient."** → Yes, for *substitution of
  incompatible items*. We add the **additive, risk-predicted staging** layer and the **video
  ground-truth** layer they don't have. (Have the '378 latex line ready — owning it shows rigor.)
- **"Couldn't Caresyntax/Theator just add prep?"** → They're optimized for documentation/training
  and don't touch patient data or the supply card; the moat is **data fusion across video + patient
  record + card**, plus workflow placement at *prep time*, not post-op review.
- **"Where's your data?"** → Honest: no clean public OR-prep dataset (PHI). Demo on Cholec80/
  AutoLaparo + surgeon-curated vignettes; the rigorous proof is the proposed prospective study.
- **"Isn't this just an LLM wrapper?"** → The video-usage model is a real CV method on the provided
  assets; the LLM is the fusion/explanation layer, not the whole product.

## Sources

- PREFcards patent (US 12,308,115) — https://www.businesswire.com/news/home/20251111779756/en/PREFcards-Secures-U.S.-Patent-for-Innovative-Surgical-Preference-Card-Optimization
- PREFcards — https://www.prefcards.com/
- DOCSI + iGan investment — https://www.prnewswire.com/news-releases/igan-partners-invests-in-docsi-to-transform-surgical-supply-chain-optimization-302523717.html
- DOCSI — https://www.docsihealth.com/
- Medline PrefConnect — https://www.medline.com/perioperative/preference-card/
- Vizient preference cards — https://www.vizientinc.com/what-we-do/spend-management/supply-chain/physician-preference-cards
- Picis preference cards — https://www.picis.com/preferencecards/
- Owens & Minor SurgiTrack — https://www.owens-minor.com/services/surgitrack-unitized-delivery/
- IDENTI Medical — https://identimedical.com/
- BD Pyxis ProcedureStation — https://www.bd.com/en-us/products-and-solutions/products/product-families/bd-pyxis-procedurestation-system
- Censis CensiTrac — https://censis.com/solutions/censitrac/
- DocSpera — https://docspera.com/
- ExplORer Surgical (GHX) — https://www.ghx.com/news-releases/2022/explorer-surgical-a-ghx-company-chosen-by-pediatric-orthopedic-medical-device-innovator-to-support-surgical-workflow-and-remote-case-management/
- Caresyntax — https://caresyntax.com/news/caresyntax-data-analytics-platform-for-surgery-is-more-than-the-sum-of-its-individual-connections/
- AI surgical video analytics market (+$1B by 2034) — https://www.globenewswire.com/news-release/2026/01/06/3213865/28124/en/AI-Enhanced-Surgical-Video-Analytics-Global-Report-2025-Market-to-Expand-by-1-Billion-by-2034.html
- Hoopcare (pre-op AI eval) — https://www.hoopcare.com/
- Calcium (perioperative) — https://calciumhealth.com/the-role-of-predictive-analytics-in-perioperative-planning/
- Duke PROMISE — https://dihi.org/project/optimization-of-perioperative-care-through-machine-learning/
- Cerner patent US 8,095,378 (patient-specific substitution, 2012) — https://patents.google.com/patent/US8095378B2/en
- SurgeryLLM (RAG surgical decision support) — https://www.medrxiv.org/content/10.1101/2024.10.05.24314932.full.pdf
