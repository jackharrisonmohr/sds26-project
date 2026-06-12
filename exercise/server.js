/* ============================================================
   NOLO — OR set-up exercise. Zero-dependency Node server.
   Serves the join + board pages, collects submissions (one per
   device, latest wins), live-pushes to the board via SSE, and
   write-throughs to submissions.json so you keep the data.
   ============================================================ */
const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT      = process.env.PORT || 3000;
const RESET_KEY = process.env.RESET_KEY || 'nolo';
const PUBLIC    = path.join(__dirname, 'public');
const DATA_FILE = path.join(__dirname, 'submissions.json');

const subs = new Map();      // clientId -> submission
const clients = new Set();   // SSE responses

const TYPES = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8' };

function snapshot(){ return { count: subs.size, submissions: [...subs.values()] }; }
function broadcast(){ const p = `data: ${JSON.stringify(snapshot())}\n\n`; for(const res of clients) res.write(p); }
function persist(){ try{ fs.writeFileSync(DATA_FILE, JSON.stringify([...subs.values()], null, 2)); }catch(_){} }

function num(v){ const n = +v; return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : null; }

function handleSubmit(req, res){
  let body = '';
  req.on('data', c => { body += c; if(body.length > 1e5) req.destroy(); });
  req.on('end', () => {
    try{
      const d = JSON.parse(body);
      const cid = String(d.clientId || '').slice(0, 64) || 'anon-' + Math.random().toString(36).slice(2);
      const placements = {};
      for(const k in (d.placements || {})){
        const p = d.placements[k]; const fx = num(p && p.fx), fy = num(p && p.fy);
        if(fx !== null && fy !== null) placements[k] = { fx, fy };
      }
      let table = null;
      if(d.table){
        const fx = num(d.table.fx), fy = num(d.table.fy);
        if(fx !== null && fy !== null){
          const angle = Number.isFinite(+d.table.angle) ? +d.table.angle : 0;
          table = { fx, fy, angle };
        }
      }
      subs.set(cid, {
        clientId: cid,
        name: String(d.name || '').slice(0, 24),
        role: ['cs','clinical','other'].includes(d.role) ? d.role : 'other',
        table,
        placements,
        ts: Date.now(),
      });
      persist(); broadcast();
      res.writeHead(200, { 'Content-Type':'application/json' }).end(JSON.stringify({ ok:true, count:subs.size }));
    }catch(err){
      res.writeHead(400, { 'Content-Type':'application/json' }).end(JSON.stringify({ ok:false, error:'bad payload' }));
    }
  });
}

function serveStatic(req, res){
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if(rel === '/' || rel === '/join') rel = '/join.html';
  else if(rel === '/board') rel = '/board.html';
  const file = path.normalize(path.join(PUBLIC, rel));
  if(!file.startsWith(PUBLIC)){ res.writeHead(403).end('forbidden'); return; }
  fs.readFile(file, (err, data) => {
    if(err){ res.writeHead(404, { 'Content-Type':'text/plain' }).end('not found'); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-cache' }).end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if(req.method === 'POST' && url === '/submit') return handleSubmit(req, res);

  if(req.method === 'POST' && url === '/reset'){
    const key = new URL(req.url, 'http://x').searchParams.get('key');
    if(key !== RESET_KEY){ res.writeHead(403).end('forbidden'); return; }
    subs.clear(); persist(); broadcast();
    res.writeHead(200, { 'Content-Type':'application/json' }).end(JSON.stringify({ ok:true }));
    return;
  }

  if(req.method === 'GET' && url === '/state'){
    res.writeHead(200, { 'Content-Type':'application/json', 'Cache-Control':'no-cache' }).end(JSON.stringify(snapshot()));
    return;
  }

  if(req.method === 'GET' && url === '/events'){
    res.writeHead(200, { 'Content-Type':'text/event-stream', 'Cache-Control':'no-cache', 'Connection':'keep-alive', 'X-Accel-Buffering':'no' });
    res.write(`data: ${JSON.stringify(snapshot())}\n\n`);
    clients.add(res);
    const ping = setInterval(() => res.write(':\n\n'), 15000);
    req.on('close', () => { clearInterval(ping); clients.delete(res); });
    return;
  }

  if(req.method === 'GET') return serveStatic(req, res);
  res.writeHead(405).end('method not allowed');
});

server.listen(PORT, () => {
  console.log(`\n  NOLO OR set-up exercise running`);
  console.log(`  ├─ participants : http://localhost:${PORT}/join`);
  console.log(`  └─ big screen   : http://localhost:${PORT}/board`);
  console.log(`\n  Start a tunnel, then open  <public-url>/board  on the projector.\n`);
});
