# NOLO — "Set up the OR" group exercise

A live audience-participation demo for the NOLO pitch. Everyone scans a QR, drags the
team + equipment onto a 2D OR map for the *same* lap chole, and submits. The big screen
reveals how far apart everyone placed things — the variance **is** the argument: today's
verbal / preference-card instructions are underspecified, so the OR gets set up
differently every time. Then one button shows the NOLO spec: one shared layout, zero
ambiguity.

Built to match `demo/nolo-ipad.html` — same room model (OR 4, 6.4 × 5.8 m), same
`KINDS` catalog and glyphs, positions stored as room fractions (`fx,fy`) exactly like
the demo layout.

## Run it

```bash
exercise/start.sh
```

This starts the server on `:3000` and opens a public tunnel:
- **cloudflared** if installed (no account, clean link) — install once: `brew install cloudflared`
- otherwise **ngrok** (already on this machine; free tier shows each phone a one-time
  "Visit Site" page)
- otherwise prints a **LAN** URL (needs everyone on the same wifi with no client isolation)

Copy the printed `https://…` URL and open **`<that-url>/board`** on the projector.
The board's QR auto-points to `<that-url>/join`, so participants just scan it.

Local testing without a tunnel:
```bash
node exercise/server.js      # then http://localhost:3000/board  and  /join
```

## Running the moment (presenter)

1. Open `/board` on the projector — a clean lobby: big **QR**, live **count**,
   **Reveal**, **Reset**. Nothing else until you reveal.
2. Audience scans → moves/rotates the **OR table**, places 6 items → submits. Count climbs live.
3. Hit **Reveal results** → small dots per element + centroid + faint 1σ spread, and a
   **show/hide panel** sorted by disagreement (the monitor and surgeon are usually worst;
   the OR table also reports angle spread, e.g. `±41°`).
4. Tick elements on/off (or **None** then one) to **isolate** a single element live.
5. **Colour by role** → CS vs clinical vs other (even within a group, people disagree).
6. **Show NOLO spec** → the punchline: one shared layout, zero ambiguity.
7. **Back to QR** returns to the lobby; **Reset** clears everything for the next run.

The board updates live, so latecomers appear without re-revealing. Every submission is
also written to `exercise/submissions.json` if you want to keep the data.

## Files

- `server.js` — zero-dependency Node server: pages, `/submit`, `/state`, SSE `/events`, `/reset`.
- `public/shared.js` — room model + renderer ported from the demo, geometry + stats helpers.
- `public/join.html` — mobile participant page. **Pointer Events** drag (works on touch);
  the OR table is movable + rotatable (drag body, drag the ⟳ knob).
- `public/board.html` — projector: QR lobby, dot reveal, per-element show/hide, role
  colours, NOLO spec.
- `start.sh` — boots server + tunnel.

## Tuning

- **Items / room:** edit `TOKENS`, `ELEMENTS`, `KINDS`, `CANON`, `ROOM` in `public/shared.js`.
- **Reset key:** `RESET_KEY=… exercise/start.sh` (default `nolo`; the board's Reset uses `nolo`).
- **Port:** `PORT=4000 exercise/start.sh`.
