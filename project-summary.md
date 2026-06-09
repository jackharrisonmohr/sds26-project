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
