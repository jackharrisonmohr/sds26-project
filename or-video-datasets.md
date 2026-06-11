# OR-Room Video Datasets (for the roadmap / research plan)

## The honest gap (state this in the pitch)
**No public dataset labels back-table *supply consumption*** — what was opened, what went unused.
That's PHI/proprietary. So OR-room video gives us **scene understanding** (who/what is in the room,
gross activity, large equipment) — **not** "this sponge was used."

Crucially, **ambient room cameras cannot identify fine-grained or micro-instruments** — tools
distinguished only by stamped sizes/catalog numbers (implants, screws, broaches), under heavy
occlusion, at distance, with specular metal and motion blur. So **room CV is for the
people / space / workflow axis, not for reading the pick list.** Fine-grained "what was used" comes
from **barcode / RFID / UDI scan + tray tracking**, not vision. Closing the patient-linked
supply-usage gap = our prospective data contribution, not a download.

Also note: our provided datasets (**Cholec80 / AutoLaparo**) are the **laparoscopic in-body feed** —
they cover intracorporeal *instruments*, not the room or the back table. OR-room datasets below are a
**different modality** and the substrate for the "full supply ground-truth" roadmap.

## Usable OR-room / scene datasets

| Dataset | What it is | Modality & size | Access | Use for us |
|---|---|---|---|---|
| **MVOR** (CAMMA, Strasbourg) | **Real** interventions (vertebroplasty, lung biopsy) | 3× RGB-D, 732 multiview frames; human bboxes + 2D/3D pose | **Free, direct on GitHub** | Easiest real OR-room frame to show the "room-camera modality" on a slide |
| **4D-OR** (TUM) | **Simulated** total-knee-replacement surgeries (realistic mock OR) | 6× ceiling RGB-D @1fps, 6734 scenes; **semantic scene graphs**, 6D object poses, clinical roles | Google-form agreement; **MIT** | Scene-graph reasoning; object/instrument *presence* in the room |
| **MM-OR** (TUM, CVPR 2025) | Extends 4D-OR; real + sim OR scenes | RGB-D + **audio + speech + robot logs + tracking**; **panoptic segmentation** (staff/equipment/large tools) + scene graphs | Google-form agreement; **Apache-2.0** | Substrate for the **people/space/turnover** axis (staff, equipment, room state) — *not* micro-instrument identity |
| **EgoExOR** (2025) | Ego + exo-centric OR, surgical activity understanding | Multi-view ego/exo video | Check repo (arXiv 2505.24287) | Newer; activity/workflow angle |
| **OR-AR** | ~400 full-length videos, 85+ procedures (incl. da Vinci robot cases) | 4× time-of-flight cameras | **Proprietary / not public** | Reference only — cite as evidence the modality works at scale; we can't obtain it |

## Open-surgery flavor (field-of-work view, NOT room camera — different but related)
| Dataset | What it is | Access |
|---|---|---|
| **AVOS** (Annotated Videos of Open Surgery) | 1997 YouTube open-surgery videos; tool + hand bounding boxes (cautery, needle driver, forceps) | Public |
| **EgoSurgery-Tool** | Head-cam egocentric open surgery; 15.4K frames, 15 tool classes, 49.7K tool instances | Public (arXiv 2406.03095) |

## What to actually do
- **For tomorrow's demo:** none are trainable overnight. Grab **one MVOR frame** (free, instant) to
  *show* the room-camera modality on the roadmap slide. Keep the live CV result on Cholec80
  (in-body instruments) — that's the real, finished asset.
- **For the research-plan slide:** name **MM-OR** as the substrate for the **people/space/turnover**
  axis (staff, equipment, room state). Materials ground truth = **barcode/RFID/UDI scan + tray
  tracking**, *not* room CV. Our novel data contribution = a **prospective collection linking
  scan/UDI/tray/count data to patient records** (plus OR-room video for the workflow axis). Submit the
  **4D-OR / MM-OR Google forms now** if you want the room-video assets in hand (agreement is instant).

## Links
- MVOR — https://github.com/CAMMA-public/MVOR · CAMMA datasets: https://camma.unistra.fr/datasets/
- 4D-OR — https://github.com/egeozsoy/4D-OR (access form: https://forms.gle/9cR3H5KcFUr5VKxr9)
- MM-OR — https://github.com/egeozsoy/MM-OR (access form: https://forms.gle/kj47QXEcraQdGidg6) · paper: https://arxiv.org/abs/2503.02579
- EgoExOR — https://arxiv.org/pdf/2505.24287
- OR-AR (robot-assisted OR activity) — https://arxiv.org/pdf/2006.16166
- AVOS — https://www.mdpi.com/2076-3417/12/20/10473
- EgoSurgery-Tool — https://arxiv.org/abs/2406.03095
