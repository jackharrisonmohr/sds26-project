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

1. Open `/board` on the projector. It shows the QR + live submission count.
2. Audience scans → places 6 items → submits. Watch the count climb.
3. Hit **Reveal results** → scatter + centroid + 1σ spread per item, and a
   **disagreement leaderboard** (the monitor and surgeon are usually the worst).
4. **Colour by role** → CS vs clinical vs other (even within a group, people disagree).
5. **Show NOLO spec** → the punchline: one shared layout, zero ambiguity.
6. **Reset** clears everything for the next run (or between rehearsal and the real thing).

`Re-reveal` recomputes to include latecomers. Every submission is also written to
`exercise/submissions.json` if you want to keep the data.

## Files

- `server.js` — zero-dependency Node server: pages, `/submit`, `/state`, SSE `/events`, `/reset`.
- `public/shared.js` — room model + renderer ported from the demo, geometry + stats helpers.
- `public/join.html` — mobile participant page. **Pointer Events** drag (works on touch),
  fixed patient table as a shared frame.
- `public/board.html` — projector dashboard: QR, live count, reveal, role colours, NOLO spec.
- `start.sh` — boots server + tunnel.

## Tuning

- **Items / room:** edit `TOKENS`, `KINDS`, `CANON`, `ROOM` in `public/shared.js`.
- **Reset key:** `RESET_KEY=… exercise/start.sh` (default `nolo`; the board's Reset uses `nolo`).
- **Port:** `PORT=4000 exercise/start.sh`.
