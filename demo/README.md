# NOLO demo

Single self-contained file: **`nolo.html`** — no build, no server, no dependencies.

## Run it
Just open it in a browser:
```bash
open demo/nolo.html        # macOS
```
(Everything is inline, so `file://` works in Chrome/Safari. If a browser ever blocks it,
serve the folder: `cd demo && python3 -m http.server 8000` then open http://localhost:8000/nolo.html)

## What it shows (the 90-second demo)
A shared, per-case **"OR Setup"** artifact that fuses both project axes:
- **NOLO axis (hero):** role-based OR **floor plan** + **patient positioning** + **whole-crew** list (incl. turnover staff).
- **v0 axis (layers):** patient-specific **pick list** + **safety-staged** items + **video-mined instrument usage**.

## Live demo script (buttons are bottom-left)
1. **Reset** → generic Lap Chole. "This is the static card today."
2. **Apply video-mined usage** → scissors/bipolar flagged <40% on-field. *"We correct the instrument set from the in-body laparoscopic feed — billing logs miss this."*
3. **Load risky patient** (Dr. B + anticoag + adhesions) → safety items **added** (hemostatics, blood, open-conversion tray), C-arm appears, scrub table mirrors to Dr. B's side. *"Risk → physical staging. Nobody does this."*
4. **Load large patient** (BMI 41 + difficult airway) → bariatric trocars added, `+Transfer` and `+Anaes` crew appear in the plan. *"No one left out — height/weight drive staffing, not cosmetics."*
5. Switch **Procedure → Total Hip** → whole plan reflows: lateral decubitus + bean bag, implant table, THA instruments.
6. Toggle **role layers** (legend chips) → show how each role sees only their setup.

## Everything is curated/illustrative
Procedures, surgeon preferences, and patient rules live in the `PROCEDURES`, `SURGEONS`,
and `FACTORS` objects in the `<script>` block — **this is where the clinical team edits content.**
The "AI" in the real product = LLM fusion + video model over these same structures.
