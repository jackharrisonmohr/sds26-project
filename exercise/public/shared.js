/* ============================================================
   NOLO — group exercise: shared room model + renderer.
   Positions are stored as room fractions (fx,fy in 0..1).
   The OR table also carries an angle (degrees, 0 = head up).
   ============================================================ */
(function (g) {
  const NS = 'http://www.w3.org/2000/svg';
  const U = 24;        // viewBox units per metre
  const MARGIN = 15;   // padding around the room

  const ROOM = { w: 6.4, h: 5.8, door: { side: 'bottom', at: 0.22, width: 1.2 } };
  const VBW = ROOM.w * U + 2 * MARGIN;   // 183.6
  const VBH = ROOM.h * U + 2 * MARGIN;   // 169.2

  // colours chosen to be distinct on the reveal (dots + legend)
  const KINDS = {
    table:    { label: 'OR table',             short: 'OR table',     color: '#f59e0b', cat: 'table', w: 0.6,  h: 2.0  },
    surgeon:  { label: 'Surgeon',              short: 'Surgeon',      color: '#0a84ff', cat: 'person' },
    scrub:    { label: 'Scrub nurse',          short: 'Scrub',        color: '#28b463', cat: 'person' },
    anaes:    { label: 'Anaesthetist',         short: 'Anaes.',       color: '#a855e0', cat: 'person' },
    anesm:    { label: 'Anaesthesia machine',  short: 'Anes. m/c',    color: '#ec4899', cat: 'equip', w: 0.85, h: 0.65 },
    tower:    { label: 'Lap tower / monitor',  short: 'Monitor',      color: '#8e8e93', cat: 'equip', w: 0.65, h: 0.60 },
    backtable:{ label: 'Equipment table',      short: 'Equip. table', color: '#14b8c4', cat: 'equip', w: 1.5,  h: 0.6  },
  };

  // tray tokens (people + equipment the participant drags in)
  const TOKENS = ['surgeon', 'scrub', 'anaes', 'anesm', 'tower', 'backtable'];
  // everything the board can show/hide (table first)
  const ELEMENTS = ['table', 'surgeon', 'scrub', 'anaes', 'anesm', 'tower', 'backtable'];

  // canonical "NOLO spec" layout (from the demo)
  const CANON = {
    table:    { fx: 0.50, fy: 0.50, angle: 0 },
    surgeon:  { fx: 0.34, fy: 0.46 },
    scrub:    { fx: 0.70, fy: 0.64 },
    anaes:    { fx: 0.50, fy: 0.20 },
    anesm:    { fx: 0.34, fy: 0.14 },
    tower:    { fx: 0.72, fy: 0.26 },
    backtable:{ fx: 0.84, fy: 0.58 },
  };

  const ROLE_ICON = {
    surgeon: '<circle cx="12" cy="8.6" r="3.3"/><path d="M5.8 19.6c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6"/><path d="M8.1 6.5c.9-1.6 2.3-2.4 3.9-2.4s3 .8 3.9 2.4"/>',
    scrub:   '<circle cx="12" cy="8.4" r="3.1"/><path d="M6 19.6c0-3.3 2.7-5.4 6-5.4s6 2.1 6 5.4"/><path d="M12 15.3v3.4M10.3 17h3.4"/>',
    anaes:   '<path d="M5 9.3c2.2-1 4.5-1.5 7-1.5s4.8.5 7 1.5c-.4 3-2 5.7-4.2 7.3-.8.6-1.7.9-2.8.9s-2-.3-2.8-.9C7 15 5.4 12.3 5 9.3z"/><path d="M5 9.3 3.2 8M19 9.3l1.8-1.3"/>',
  };
  const EQUIP_ICON = {
    tower:    '<rect x="7.5" y="4.5" width="9" height="6.3" rx="1"/><rect x="7.5" y="13.2" width="9" height="6.3" rx="1"/>',
    anesm:    '<rect x="6.5" y="4.5" width="11" height="15" rx="1.5"/><path d="M9 8.5h6M9 11.5h6"/><circle cx="12" cy="15.5" r="1.5"/>',
    backtable:'<rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M6 12v6M18 12v6"/>',
  };
  // role glyphs for the board's "icon by role" markers (filled, 24x24 box)
  const ROLE_GLYPH = {
    clinical: '<circle cx="12" cy="8" r="3.7"/><path d="M5 20.5c0-3.7 3.1-6.4 7-6.4s7 2.7 7 6.4z"/>',
    cs:       '<rect x="3.3" y="4.6" width="17.4" height="11.4" rx="1.8"/><rect x="9.2" y="16.6" width="5.6" height="2.1"/><rect x="6.4" y="18.9" width="11.2" height="2.1" rx="1"/>',
  };

  // ---- coordinate helpers -------------------------------------------------
  const FX = fx => MARGIN + fx * ROOM.w * U;
  const FY = fy => MARGIN + fy * ROOM.h * U;
  const pctX = fx => (FX(fx) / VBW) * 100;
  const pctY = fy => (FY(fy) / VBH) * 100;
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const fxFromClient = (cx, rect) => clamp01(((((cx - rect.left) / rect.width) * VBW) - MARGIN) / (ROOM.w * U));
  const fyFromClient = (cy, rect) => clamp01(((((cy - rect.top) / rect.height) * VBH) - MARGIN) / (ROOM.h * U));

  // mean + per-axis std (room fractions); spread in metres = RMS of the axes
  function stats(points) {
    const n = points.length; if (!n) return null;
    let mx = 0, my = 0; points.forEach(p => { mx += p.fx; my += p.fy; }); mx /= n; my /= n;
    let vx = 0, vy = 0; points.forEach(p => { vx += (p.fx - mx) ** 2; vy += (p.fy - my) ** 2; });
    const sx = Math.sqrt(vx / n), sy = Math.sqrt(vy / n);
    return { mx, my, sx, sy, spread: Math.hypot(sx * ROOM.w, sy * ROOM.h), n };
  }
  // circular stats for the table angle
  function angleStats(degs) {
    const n = degs.length; if (!n) return null;
    let sc = 0, ss = 0; degs.forEach(d => { const a = d * Math.PI / 180; sc += Math.cos(a); ss += Math.sin(a); });
    sc /= n; ss /= n; const R = Math.hypot(sc, ss);
    return { meanDeg: Math.atan2(ss, sc) * 180 / Math.PI, stdDeg: R > 1e-6 ? Math.sqrt(-2 * Math.log(R)) * 180 / Math.PI : 180, n };
  }

  // ---- backdrop renderer (room shell only — table is now interactive) -----
  function drawRoomBackdrop(svg) {
    svg.innerHTML = '';
    svg.setAttribute('viewBox', `0 0 ${VBW} ${VBH}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    const add = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; };
    const X = mx => MARGIN + mx * U, Y = my => MARGIN + my * U;

    const uid = 'sh' + Math.floor(VBW);
    const defs = add('defs', {});
    const f1 = add('filter', { id: uid, x: '-25%', y: '-25%', width: '150%', height: '150%' }, defs);
    add('feDropShadow', { dx: 0, dy: 3, stdDeviation: 3.6, 'flood-color': '#1e3c70', 'flood-opacity': 0.16 }, f1);

    add('rect', { x: X(0), y: Y(0), width: ROOM.w * U, height: ROOM.h * U, rx: 4.5, fill: '#f7fafe', filter: `url(#${uid})` });
    const grid = add('g', {});
    for (let gx = 1; gx < ROOM.w; gx++) add('line', { x1: X(gx), y1: Y(0.06), x2: X(gx), y2: Y(ROOM.h - 0.06), stroke: '#dfe7f1', 'stroke-width': 0.7 }, grid);
    for (let gy = 1; gy < ROOM.h; gy++) add('line', { x1: X(0.06), y1: Y(gy), x2: X(ROOM.w - 0.06), y2: Y(gy), stroke: '#dfe7f1', 'stroke-width': 0.7 }, grid);
    add('rect', { x: X(0), y: Y(0), width: ROOM.w * U, height: ROOM.h * U, rx: 4.5, fill: 'none', stroke: '#93a4bb', 'stroke-width': 2.8 });

    const d = ROOM.door, w = d.width * U, r = Math.min(w, MARGIN - 2);
    const dx = X(d.at * ROOM.w), dy = Y(ROOM.h), a = dx - w / 2;
    add('line', { x1: a, y1: dy, x2: dx + w / 2, y2: dy, stroke: '#f7fafe', 'stroke-width': 4 });
    add('path', { d: `M${a} ${dy} A ${r} ${r} 0 0 1 ${a} ${dy - r}`, fill: 'none', stroke: '#aeb9c9', 'stroke-width': 1, 'stroke-dasharray': '2.5 2' });
    add('line', { x1: a, y1: dy, x2: a, y2: dy - r, stroke: '#94a3b6', 'stroke-width': 1.5 });

    return { add, FX, FY };
  }

  g.NOLO = {
    NS, U, MARGIN, ROOM, VBW, VBH, KINDS, TOKENS, ELEMENTS, CANON, ROLE_ICON, EQUIP_ICON, ROLE_GLYPH,
    FX, FY, pctX, pctY, fxFromClient, fyFromClient, clamp01, stats, angleStats, drawRoomBackdrop,
  };
})(window);
