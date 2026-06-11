# Competitive Landscape + Our Wedge (1-pager)

## The space is crowded at the edges, empty in the middle
Every layer of our idea already ships. **Nobody combines them.**

- **Preference-card optimization** (trim waste from billing/scan logs) — *solved, commoditized:*
  [PREFcards](https://www.prefcards.com/) · [DOCSI](https://www.docsihealth.com/) ·
  [Medline PrefConnect](https://www.medline.com/perioperative/preference-card/) ·
  [Vizient](https://www.vizientinc.com/what-we-do/spend-management/supply-chain/physician-preference-cards) ·
  [Picis](https://www.picis.com/preferencecards/)
- **Supply / pick-list logistics** — build from static cards:
  [Owens & Minor SurgiTrack](https://www.owens-minor.com/services/surgitrack-unitized-delivery/) ·
  [BD Pyxis](https://www.bd.com/en-us/products-and-solutions/products/product-families/bd-pyxis-procedurestation-system) ·
  [Censis CensiTrac](https://censis.com/solutions/censitrac/)
- **Case coordination / readiness** — our *closest neighbor*, but implant/vendor logistics only:
  [DocSpera](https://docspera.com/) ·
  [ExplORer Surgical (GHX)](https://www.ghx.com/)
- **Surgical video analytics** — detect tools from video, but for docs/training, *never supply prep:*
  [Caresyntax](https://caresyntax.com/) · [Theator](https://theator.io/) ·
  [Touch Surgery / Medtronic](https://www.touchsurgery.com/)
- **Pre-op risk prediction** — output a risk *score*, not a staging *action:*
  [Hoopcare](https://www.hoopcare.com/) · [Calcium](https://calciumhealth.com/) ·
  [Duke PROMISE](https://dihi.org/project/optimization-of-perioperative-care-through-machine-learning/)

## The one thing that shapes our claim
⚠️ **Cerner patent [US 8,095,378](https://patents.google.com/patent/US8095378B2/en)** (2012) already
covers patient-specific *substitution* on cards — **using the exact latex-allergy example.**
So **"we personalize the card to the patient" is NOT our novelty.** Don't pitch it.

## Our wedge (say exactly this)
The empty corner = **(patient-risk-personalized) × (video-ground-truth).** Two moves nobody combines:

1. **Video-mined instrument usage** — Cholec80/AutoLaparo are the *laparoscopic (in-body) feed*, so
   scope the claim honestly: we correct the **working-instrument** set from what actually entered the
   surgical field (tool-presence on the scope video), vs competitors' billing/scan-log inference.
   *Full back-table supply ground truth needs OR-room cameras (OR Black Box-style) — that's our roadmap, not the demo.*
2. **Risk → physical staging (the additive half)** — not "swap the allergic item" (Cerner, 2002) but
   *"predicted bleeding → stage hemostatics + blood; adhesions → stage the open tray."* **This is our
   lead leg — fully open territory, and unaffected by the in-body-only video limit.**

→ One fused per-case artifact: **instrument-true usage + team prefs + patient risk → checklist +
pick list + safety flags.** Pieces are scattered across 5 vendor categories; **the fusion is the product.**
