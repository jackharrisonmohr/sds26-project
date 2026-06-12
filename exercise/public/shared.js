/* ============================================================
   NOLO — group exercise: shared room model + renderer.
   Ported from demo/nolo-ipad.html so the map looks like the product.
   Positions are stored as room fractions (fx,fy in 0..1), exactly
   like the demo's layout — that's what we compare across people.
   ============================================================ */
(function (g) {
  const NS = 'http://www.w3.org/2000/svg';
  const U = 24;        // viewBox units per metre  (matches the demo)
  const MARGIN = 15;   // padding around the room

  // OR 4 — General Surgery, the lap-chole room from the demo schedule
  const ROOM = { w: 6.4, h: 5.8, door: { side: 'bottom', at: 0.22, width: 1.2 } };

  const VBW = ROOM.w * U + 2 * MARGIN;   // 183.6
  const VBH = ROOM.h * U + 2 * MARGIN;   // 169.2

  // colours + footprints (metres) — subset of the demo's KINDS
  const KINDS = {
    surgeon: { label: 'Surgeon',             short: 'Surgeon',   color: '#0a84ff', cat: 'person' },
    assist:  { label: 'Camera / Assistant',  short: 'Camera',    color: '#32ade6', cat: 'person' },
    scrub:   { label: 'Scrub nurse',         short: 'Scrub',     color: '#28b463', cat: 'person' },
    anaes:   { label: 'Anaesthetist',        short: 'Anaes.',    color: '#a855e0', cat: 'person' },
    anesm:   { label: 'Anaesthesia machine', short: 'Anes. m/c', color: '#a855e0', cat: 'equip', w: 0.85, h: 0.65 },
    tower:   { label: 'Lap tower / monitor', short: 'Monitor',   color: '#8e8e93', cat: 'equip', w: 0.65, h: 0.60 },
  };

  // the six movable tokens, in tray order
  const TOKENS = ['surgeon', 'assist', 'scrub', 'anaes', 'anesm', 'tower'];

  // canonical "NOLO spec" layout (from the demo) — used for the punchline
  const CANON = {
    surgeon: { fx: 0.34, fy: 0.46 },
    assist:  { fx: 0.34, fy: 0.64 },
    scrub:   { fx: 0.70, fy: 0.64 },
    anaes:   { fx: 0.50, fy: 0.20 },
    anesm:   { fx: 0.34, fy: 0.14 },
    tower:   { fx: 0.72, fy: 0.26 },
  };

  const ROLE_ICON = {
    surgeon: '<circle cx="12" cy="8.6" r="3.3"/><path d="M5.8 19.6c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6"/><path d="M8.1 6.5c.9-1.6 2.3-2.4 3.9-2.4s3 .8 3.9 2.4"/>',
    assist:  '<circle cx="12" cy="8.6" r="3.3"/><path d="M5.8 19.6c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6"/>',
    scrub:   '<circle cx="12" cy="8.4" r="3.1"/><path d="M6 19.6c0-3.3 2.7-5.4 6-5.4s6 2.1 6 5.4"/><path d="M12 15.3v3.4M10.3 17h3.4"/>',
    anaes:   '<path d="M5 9.3c2.2-1 4.5-1.5 7-1.5s4.8.5 7 1.5c-.4 3-2 5.7-4.2 7.3-.8.6-1.7.9-2.8.9s-2-.3-2.8-.9C7 15 5.4 12.3 5 9.3z"/><path d="M5 9.3 3.2 8M19 9.3l1.8-1.3"/>',
  };
  const EQUIP_ICON = {
    tower: '<rect x="7.5" y="4.5" width="9" height="6.3" rx="1"/><rect x="7.5" y="13.2" width="9" height="6.3" rx="1"/>',
    anesm: '<rect x="6.5" y="4.5" width="11" height="15" rx="1.5"/><path d="M9 8.5h6M9 11.5h6"/><circle cx="12" cy="15.5" r="1.5"/>',
  };

  // ---- coordinate helpers -------------------------------------------------
  // room fraction -> viewBox units
  const FX = fx => MARGIN + fx * ROOM.w * U;
  const FY = fy => MARGIN + fy * ROOM.h * U;
  // room fraction -> percentage of the stage box (for HTML token placement)
  const pctX = fx => (FX(fx) / VBW) * 100;
  const pctY = fy => (FY(fy) / VBH) * 100;
  // client pixel -> room fraction, given the stage's bounding rect
  function fxFromClient(clientX, rect) {
    const vx = ((clientX - rect.left) / rect.width) * VBW;
    return clamp01((vx - MARGIN) / (ROOM.w * U));
  }
  function fyFromClient(clientY, rect) {
    const vy = ((clientY - rect.top) / rect.height) * VBH;
    return clamp01((vy - MARGIN) / (ROOM.h * U));
  }
  const clamp01 = v => Math.max(0, Math.min(1, v));

  // mean + per-axis std (in room fractions) for a set of {fx,fy}
  function stats(points) {
    const n = points.length;
    if (!n) return null;
    let mx = 0, my = 0;
    points.forEach(p => { mx += p.fx; my += p.fy; });
    mx /= n; my /= n;
    let vx = 0, vy = 0;
    points.forEach(p => { vx += (p.fx - mx) ** 2; vy += (p.fy - my) ** 2; });
    const sx = Math.sqrt(vx / n), sy = Math.sqrt(vy / n);
    // spread in metres = RMS of the two axes
    const spread = Math.hypot(sx * ROOM.w, sy * ROOM.h);
    return { mx, my, sx, sy, spread, n };
  }

  // ---- backdrop renderer (static room) ------------------------------------
  // draws floor, 1m grid, walls, door, the FIXED patient table + sterile field.
  function drawRoomBackdrop(svg) {
    svg.innerHTML = '';
    svg.setAttribute('viewBox', `0 0 ${VBW} ${VBH}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    const add = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; };
    const txt = (a, s, p) => { const e = add('text', a, p); e.textContent = s; return e; };
    const X = mx => MARGIN + mx * U, Y = my => MARGIN + my * U;

    const uid = 'sh' + Math.floor(VBW), nid = 'ns' + Math.floor(VBH);
    const defs = add('defs', {});
    const f1 = add('filter', { id: uid, x: '-25%', y: '-25%', width: '150%', height: '150%' }, defs);
    add('feDropShadow', { dx: 0, dy: 3, stdDeviation: 3.6, 'flood-color': '#1e3c70', 'flood-opacity': 0.16 }, f1);
    const f2 = add('filter', { id: nid, x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
    add('feDropShadow', { dx: 0, dy: 0.8, stdDeviation: 1, 'flood-color': '#22304a', 'flood-opacity': 0.22 }, f2);

    // floor slab
    add('rect', { x: X(0), y: Y(0), width: ROOM.w * U, height: ROOM.h * U, rx: 4.5, fill: '#f7fafe', filter: `url(#${uid})` });
    // 1 m grid
    const grid = add('g', {});
    for (let gx = 1; gx < ROOM.w; gx++) add('line', { x1: X(gx), y1: Y(0.06), x2: X(gx), y2: Y(ROOM.h - 0.06), stroke: '#dfe7f1', 'stroke-width': 0.7 }, grid);
    for (let gy = 1; gy < ROOM.h; gy++) add('line', { x1: X(0.06), y1: Y(gy), x2: X(ROOM.w - 0.06), y2: Y(gy), stroke: '#dfe7f1', 'stroke-width': 0.7 }, grid);
    // walls
    add('rect', { x: X(0), y: Y(0), width: ROOM.w * U, height: ROOM.h * U, rx: 4.5, fill: 'none', stroke: '#93a4bb', 'stroke-width': 2.8 });
    // door (bottom)
    const d = ROOM.door, w = d.width * U, r = Math.min(w, MARGIN - 2);
    const dx = X(d.at * ROOM.w), dy = Y(ROOM.h), a = dx - w / 2;
    add('line', { x1: a, y1: dy, x2: dx + w / 2, y2: dy, stroke: '#f7fafe', 'stroke-width': 4 });
    add('path', { d: `M${a} ${dy} A ${r} ${r} 0 0 1 ${a} ${dy - r}`, fill: 'none', stroke: '#aeb9c9', 'stroke-width': 1, 'stroke-dasharray': '2.5 2' });
    add('line', { x1: a, y1: dy, x2: a, y2: dy - r, stroke: '#94a3b6', 'stroke-width': 1.5 });

    // sterile field around the fixed table (vertical table at centre)
    add('ellipse', {
      cx: FX(0.5), cy: FY(0.5), rx: (0.6 / 2 + 0.85) * U, ry: (2 / 2 + 0.85) * U,
      fill: '#00a3c4', 'fill-opacity': 0.05, stroke: '#00a3c4', 'stroke-opacity': 0.3, 'stroke-dasharray': '3 2.5', 'stroke-width': 0.8
    });
    // FIXED OR table (vertical), patient supine, head at top
    const tw = 0.6 * U, th = 2 * U, cx = FX(0.5), cy = FY(0.5);
    add('rect', { x: cx - tw / 2, y: cy - th / 2, width: tw, height: th, rx: 5, fill: '#e3eeff', stroke: '#0a84ff', 'stroke-width': 1.3, 'stroke-opacity': 0.75, filter: `url(#${nid})` });
    add('circle', { cx: cx, cy: cy - th / 2 + 0.34 * U, r: 0.27 * U, fill: '#0a84ff', 'fill-opacity': 0.85 });
    const labStyle = { 'text-anchor': 'middle', fill: '#566071', 'font-size': 5.5, 'font-weight': 700, 'letter-spacing': 0.3, stroke: '#fbfcfe', 'stroke-width': 1.6, 'stroke-opacity': 0.85, 'paint-order': 'stroke' };
    txt({ ...labStyle, x: cx, y: cy - th / 2 - 4 }, 'PATIENT HEAD');
    txt({ ...labStyle, x: cx, y: cy + th / 2 + 9, fill: '#9aa4b2' }, 'FEET');

    return { add, FX, FY };
  }

  g.NOLO = {
    NS, U, MARGIN, ROOM, VBW, VBH, KINDS, TOKENS, CANON, ROLE_ICON, EQUIP_ICON,
    FX, FY, pctX, pctY, fxFromClient, fyFromClient, clamp01, stats, drawRoomBackdrop,
  };
})(window);
