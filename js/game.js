/* Ctrl+Alt+Harsh: engine, simulation and UI. */
(() => {
  'use strict';
  const D = DATA, A = ART, WD = WORLD, TS = 16, MW = WD.W, MH = WD.H;
  const $ = (id) => document.getElementById(id);
  const cv = $('game'), g = cv.getContext('2d');
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[(Math.random() * a.length) | 0];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const TPL = {}; D.TICKETS.forEach((t) => { TPL[t.id] = t; });
  const SLA = { 1: 110, 2: 150, 3: 190 }, BASEXP = { 1: 100, 2: 170, 3: 290 };
  const SAVE_KEY = 'ctrl-alt-harsh-v1';
  let VW = 384, VH = 216, SC = 3;

  /* ---------- state ---------- */
  const fresh = () => ({
    started: false, f: 0, xp: 0, lvl: 0, day: 1, clock: 540, wm: 0, energy: 85, csat: [], solved: {}, kb: {}, tickets: [], track: null,
    inv: [], coffee: 0, snacks: 0, uid: 1041, nextSpawn: 4, buff: 0, pizzaDay: 0, lunchToast: 0, talkDay: {}, quizUsed: [], mute: false, won: false,
    stats: { closed: 0, firstTry: 0, wrong: 0, late: 0, coffees: 0, snacks: 0, chats: 0, quiz: 0, quizOk: 0 }, today: { closed: 0, xp: 0, late: 0 },
  });
  let S = fresh();
  const P = { x: 2.5 * TS, y: 3 * TS + 10, dir: 0, fr: 0, at: 0, moving: false };
  const ui = { dlg: null, modal: null, fade: null, near: null, room: '', hudT: 0, shake: 0, promoQ: [], forced: false };
  const cam = { x: 0, y: 0 };
  const keys = {}; const joy = { x: 0, y: 0 };
  const parts = [], pops = [], confetti = [];

  /* ---------- build world visuals ---------- */
  const FR = WD.floors.map((F) => A.renderFloor(F));
  const inter = [[], []];
  WD.floors.forEach((F, fi) => {
    for (const f of F.furn) {
      f.spr = A.sprite(f.type, f.v);
      f.dx = f.x * TS + ((f.fw * TS - f.spr.lw) >> 1); f.dy = (f.y + f.fh) * TS - f.spr.lh; f.sy = (f.y + f.fh) * TS - 1;
      if (f.type === 'chairF') f.sy -= 8;
      if (f.type === 'stool') f.sy -= 6;
      if (f.type === 'door') f.dy = (f.y + 1) * TS - f.spr.lh;
      if (f.act) {
        const o = { f: fi, act: f.act, label: f.label, ref: f, x: (f.x + f.fw / 2) * TS, y: (f.y + f.fh) * TS + 5 };
        if (f.type === 'desk' && f.owner) o.x = (f.x + 1.5) * TS;
        inter[fi].push(o);
      }
    }
    for (const d of F.walls) if (d.act) inter[fi].push({ f: fi, act: d.act, label: d.label, ref: d, x: (d.x + d.w / 2) * TS, y: (d.y + 1) * TS + 5 });
  });
  const harshSheet = A.charSheet(D.HARSH);

  /* ---------- NPCs ---------- */
  const NPC = D.EMP.map((e) => {
    const seat = WD.seats[e.id];
    const n = { e, id: e.id, first: e.name.split(' ')[0], f: e.f, sheet: A.charSheet(e.look), seat, st: 'sit', t: rnd(10, 60), path: null, dir: seat.dir, fr: 0, at: 0, emo: null, emoT: 0, x: 0, y: 0 };
    sitDown(n); return n;
  });
  const npcById = {}; NPC.forEach((n) => { npcById[n.id] = n; });
  function sitDown(n) { n.x = (n.seat.x + 0.5) * TS; n.y = (n.seat.y + 1) * TS - (n.seat.dir === 3 ? 4 : 3); n.dir = n.seat.dir; n.st = 'sit'; n.path = null; n.fr = 0; }

  function bfs(F, sx, sy, tx, ty) {
    const grid = F.npcSolid, prev = new Int32Array(MW * MH).fill(-1), q = [sy * MW + sx]; prev[q[0]] = q[0];
    const goal = ty * MW + tx;
    for (let h = 0; h < q.length; h++) {
      const c = q[h]; if (c === goal) break;
      const cx = c % MW, cy = (c / MW) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy; if (nx < 0 || ny < 0 || nx >= MW || ny >= MH) continue;
        const k = ny * MW + nx; if (prev[k] !== -1) continue; if (grid[k] && k !== goal) continue;
        prev[k] = c; q.push(k);
      }
    }
    if (prev[goal] === -1) return null;
    const out = []; let c = goal; while (c !== prev[c]) { out.push([c % MW, (c / MW) | 0]); c = prev[c]; }
    return out.reverse();
  }
  const npcTile = (n) => [Math.floor(n.x / TS), Math.floor((n.y - 2) / TS)];
  function sendHome(n) { if (n.st === 'sit') return; const [tx, ty] = npcTile(n); const p = bfs(WD.floors[n.f], tx, ty, n.seat.x, n.seat.y); if (p && p.length) { n.path = p; n.st = 'back'; } else sitDown(n); }

  function updateNPC(n, dt) {
    if (n.emoT > 0) { n.emoT -= dt; if (n.emoT <= 0) n.emo = null; }
    const busy = !!openTicketFor(n.id);
    if (n.st === 'sit') {
      n.t -= dt;
      if (n.t <= 0) {
        if (busy || S.clock > 990 || n.id === 'helen') { n.t = rnd(8, 16); return; }
        const F = WD.floors[n.f], sp = pick(F.spots);
        if (NPC.some((o) => o !== n && o.f === n.f && o.goal && o.goal[0] === sp[0] && o.goal[1] === sp[1])) { n.t = 6; return; }
        const p = bfs(F, n.seat.x, n.seat.y, sp[0], sp[1]);
        if (p && p.length) { n.path = p; n.st = 'go'; n.goal = sp; } else n.t = 12;
      }
    } else if (n.st === 'go' || n.st === 'back') {
      if (busy && n.st === 'go') { sendHome(n); n.goal = null; return; }
      const tgt = n.path[0]; if (!tgt) { arrive(n); return; }
      const tx = (tgt[0] + 0.5) * TS, ty = (tgt[1] + 1) * TS - 4, dx = tx - n.x, dy = ty - n.y, d = Math.hypot(dx, dy), sp = 30 * dt;
      if (d <= sp) { n.x = tx; n.y = ty; n.path.shift(); if (!n.path.length) arrive(n); }
      else { n.x += dx / d * sp; n.y += dy / d * sp; n.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0); }
      n.at += dt; n.fr = ((n.at * 7) | 0) % 4;
    } else if (n.st === 'idle') {
      n.t -= dt; if (n.t <= 0 || busy) { n.goal = null; sendHome(n); }
    }
  }
  function arrive(n) {
    if (n.st === 'go') { n.st = 'idle'; n.t = rnd(5, 11); n.fr = 0; n.dir = 3; n.emo = pick(['cup', 'chat', 'cup', 'note']); n.emoT = n.t; }
    else { sitDown(n); n.t = rnd(25, 75); n.goal = null; }
  }

  /* ---------- helpers ---------- */
  const floor = () => WD.floors[S.f];
  const openTicketFor = (id) => S.tickets.find((t) => t.who === id && t.st !== 'done');
  const tracked = () => S.tickets.find((t) => t.uid === S.track && t.st === 'mine') || S.tickets.find((t) => t.st === 'mine');
  const fmt = (m) => { m = Math.round(m); const h = Math.floor(m / 60), mm = m % 60, h12 = ((h + 11) % 12) + 1; return h12 + ':' + String(mm).padStart(2, '0') + (h >= 12 ? ' PM' : ' AM'); };
  const lvlName = () => D.LEVELS[S.lvl].t;
  const csatAvg = () => S.csat.length ? S.csat.reduce((a, b) => a + b, 0) / S.csat.length : 5;
  function addMin(m) { S.clock += m; S.wm += m; S.energy = clamp(S.energy - m * 0.3, 0, 100); }
  const seatRoom = (id) => { const s = WD.seats[id]; return WD.roomAt(s.f, s.x, s.y) + ', Floor ' + (s.f + 1); };
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* ---------- audio ---------- */
  let AC = null, master = null, musicT = 0, step = 0;
  function audio() {
    if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); master = AC.createGain(); master.gain.value = S.mute ? 0 : 0.5; master.connect(AC.destination); } catch (e) { AC = null; } }
    if (AC && AC.state === 'suspended') AC.resume();
  }
  function tone(f, d, type, v, when, slide) {
    if (!AC) return; const o = AC.createOscillator(), gn = AC.createGain(), t0 = AC.currentTime + (when || 0);
    o.type = type || 'square'; o.frequency.setValueAtTime(f, t0); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, f + slide), t0 + d);
    gn.gain.setValueAtTime(v || 0.05, t0); gn.gain.exponentialRampToValueAtTime(0.0001, t0 + d); o.connect(gn); gn.connect(master); o.start(t0); o.stop(t0 + d + 0.03);
  }
  const sfx = {
    blip: () => tone(620 + Math.random() * 80, 0.03, 'square', 0.018), sel: () => tone(880, 0.06, 'square', 0.05),
    ticket: () => { tone(784, 0.09, 'square', 0.06); tone(1047, 0.16, 'square', 0.06, 0.1); },
    ok: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.13, 'square', 0.06, i * 0.08)),
    bad: () => { tone(190, 0.18, 'sawtooth', 0.07); tone(140, 0.24, 'sawtooth', 0.07, 0.13); },
    coffee: () => { tone(260, 0.3, 'triangle', 0.07, 0, 240); tone(900, 0.05, 'square', 0.03, 0.3); },
    munch: () => { tone(300, 0.05, 'square', 0.05); tone(240, 0.05, 'square', 0.05, 0.09); tone(300, 0.05, 'square', 0.05, 0.18); },
    promo: () => [523, 523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, 'square', 0.07, i * 0.11)),
    door: () => { tone(500, 0.08, 'triangle', 0.06); tone(750, 0.2, 'triangle', 0.06, 0.1); },
    key: () => tone(1300 + Math.random() * 300, 0.012, 'square', 0.012),
  };
  const CH = [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]];
  function music(dt) {
    if (!AC || S.mute || !S.started) return;
    musicT -= dt; if (musicT > 0) return; musicT += 0.24;
    const bar = (step >> 3) % 4, c = CH[bar], i = step % 8, hz = (n) => 130.81 * Math.pow(2, n / 12);
    if (i === 0 || i === 4) tone(hz(c[0]) / 2, 0.3, 'triangle', 0.05);
    if (i % 2 === 0 || i === 7) tone(hz(c[[0, 1, 2, 1, 2, 0, 1, 2][i]] + 12), 0.12, 'square', 0.011);
    step++;
  }

  /* ---------- toasts / popups ---------- */
  function toast(html, cls) {
    const d = document.createElement('div'); d.className = 'toast ' + (cls || ''); d.innerHTML = html; $('toasts').appendChild(d);
    setTimeout(() => d.classList.add('out'), 4200); setTimeout(() => d.remove(), 4800);
  }
  const pop = (s, c) => pops.push({ s, c: c || '#ffb23e', t: 0, x: P.x, y: P.y - 30 });

  /* ---------- tickets ---------- */
  function pickRequester(tpl) {
    let pool = D.EMP.filter((e) => e.id !== 'dana' && !openTicketFor(e.id));
    if (tpl.who) { const dept = tpl.who.split(':')[1]; pool = pool.filter((e) => e.dept === dept); }
    else if (tpl.target === 'meeting' || tpl.target === 'printer1') pool = pool.filter((e) => e.f === 0);
    else if (tpl.target === 'printer2') pool = pool.filter((e) => e.f === 1);
    return pool.length ? pick(pool).id : null;
  }
  function pickTemplate() {
    const max = Math.min(3, S.lvl + 1), open = new Set(S.tickets.filter((t) => t.st !== 'done').map((t) => t.id));
    let tier = max; if (max > 1 && Math.random() > 0.68) tier = 1 + ((Math.random() * (max - 1)) | 0);
    let pool = D.TICKETS.filter((t) => t.tier === tier && !open.has(t.id));
    const unsolved = pool.filter((t) => !S.solved[t.id]); if (unsolved.length) pool = unsolved;
    if (!pool.length) pool = D.TICKETS.filter((t) => t.tier <= max && !open.has(t.id));
    return pool.length ? pick(pool) : null;
  }
  function spawnTicket(id, who) {
    const tpl = id ? TPL[id] : pickTemplate(); if (!tpl) return null;
    who = who || pickRequester(tpl); if (!who) return null;
    const t = { uid: S.uid++, id: tpl.id, who, st: 'new', made: S.wm, due: S.wm + SLA[tpl.tier], asked: [], checks: [], wrong: 0, need: null, log: [], talked: false, lateWarn: false };
    S.tickets.push(t);
    const n = npcById[who]; sendHome(n);
    toast(`<b>New ticket #${t.uid}</b><br>${esc(tpl.title)} <span class="dim">from ${n.first}</span>`, 'tk'); sfx.ticket();
    return t;
  }
  function assign(t) { if (t.st !== 'new') return; const cur = S.tickets.find((x) => x.uid === S.track && x.st === 'mine'); t.st = 'mine'; if (!cur) S.track = t.uid; sfx.sel(); }
  function rewards(t, fix) {
    const tpl = TPL[t.id], notes = []; let mult = 1;
    const keyIdx = tpl.checks.map((c, i) => c.k ? i : -1).filter((i) => i >= 0), gotKeys = keyIdx.every((i) => t.checks.includes(i));
    if (gotKeys) { mult += 0.2; notes.push(['Checked the evidence before fixing', '+20%']); } else notes.push(['Skipped some diagnostics', '+0%']);
    if (t.wrong === 0) { mult += 0.15; notes.push(['Right fix on the first try', '+15%']); } else { mult -= 0.15 * t.wrong; notes.push([t.wrong + ' wrong fix' + (t.wrong > 1 ? 'es' : ''), '-' + 15 * t.wrong + '%']); }
    if (t.asked.length) { mult += 0.1; notes.push(['Asked the user good questions', '+10%']); }
    const late = S.wm > t.due; if (late) { mult -= 0.25; notes.push(['Missed the SLA', '-25%']); }
    if (fix.ok === 2) { mult *= 0.6; notes.push(['Workaround, not best practice', 'x0.6']); }
    const xp = Math.max(20, Math.round(BASEXP[tpl.tier] * Math.max(0.35, mult) / 5) * 5);
    const cs = clamp(5 - t.wrong - (late ? 1 : 0) - (fix.ok === 2 ? 1 : 0) - (t.asked.length ? 0 : 0.5), 1, 5);
    return { xp, cs, notes, late };
  }
  function closeTicket(t) {
    const r = t.result; t.st = 'done'; S.solved[t.id] = 1; S.kb[t.id] = 1; S.csat.push(r.cs);
    S.stats.closed++; S.today.closed++; if (t.wrong === 0) S.stats.firstTry++; S.stats.wrong += t.wrong; if (r.late) { S.stats.late++; S.today.late++; }
    const n = npcById[t.who]; n.emo = 'heart'; n.emoT = 7;
    toast(`<b>#${t.uid} closed</b> <span class="good">+${r.xp} XP</span><br><span class="dim">${n.first}: ${pick(['Thank you!!', 'You are a lifesaver.', 'That was fast. Thanks!', 'I owe you a coffee.', 'Magic. Actual magic.'])}</span>`, 'ok');
    const nx = S.tickets.find((x) => x.st === 'mine'); S.track = nx ? nx.uid : null;
    addXP(r.xp); save();
  }
  function addXP(n) {
    S.xp += n; S.today.xp += n; pop('+' + n + ' XP', '#6fe3a1');
    while (S.lvl < 3 && S.xp >= D.LEVELS[S.lvl + 1].xp) { S.lvl++; ui.promoQ.push(S.lvl); }
    hud();
  }

  /* ---------- dialogs ---------- */
  function dlg(o) {
    ui.dlg = { o, n: 0, done: false, acc: 0 };
    const box = $('dlg'); box.classList.add('on');
    $('dlg-name').textContent = o.n ? o.n.e.name : (o.name || 'Harsh'); $('dlg-role').textContent = o.n ? o.n.e.role : (o.role || '');
    const pc = $('dlg-face'), pg = pc.getContext('2d'); pg.clearRect(0, 0, 18, 17); pg.drawImage((o.n ? o.n.sheet : harshSheet).f[0][0], 0, 0);
    $('dlg-text').textContent = ''; $('dlg-ch').innerHTML = ''; $('dlg-more').style.display = 'none';
  }
  function dlgFinish() {
    const d = ui.dlg; if (!d) return; d.done = true; $('dlg-text').textContent = d.o.text;
    const ch = d.o.choices || [];
    $('dlg-ch').innerHTML = ch.map((c, i) => `<button data-i="${i}"><b>${i + 1}</b> ${esc(c.t)}</button>`).join('');
    $('dlg-more').style.display = ch.length ? 'none' : 'block';
  }
  function dlgAdvance() {
    const d = ui.dlg; if (!d) return;
    if (!d.done) { dlgFinish(); return; }
    if ((d.o.choices || []).length) return;
    dlgClose(); if (d.o.next) d.o.next();
  }
  function dlgClose() { ui.dlg = null; $('dlg').classList.remove('on'); }
  function dlgChoose(i) { const d = ui.dlg; if (!d || !d.done) return; const c = (d.o.choices || [])[i]; if (!c) return; sfx.sel(); dlgClose(); if (c.fn) c.fn(); }
  $('dlg-ch').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { dlgChoose(+b.dataset.i); e.stopPropagation(); } });
  $('dlg').addEventListener('click', () => dlgAdvance());
  const say = (text, next) => dlg({ text, next, name: 'Harsh', role: lvlName() });

  /* ---------- talking ---------- */
  const nearDesk = (n) => S.f === n.seat.f && Math.hypot(P.x - (n.seat.vx + 0.5) * TS, P.y - (n.seat.vy + 0.8) * TS) < 46;
  function talk(n) {
    if (n.st !== 'sit') n.dir = Math.abs(P.x - n.x) > Math.abs(P.y - n.y) ? (P.x < n.x ? 1 : 2) : (P.y < n.y ? 3 : 0);
    const t = openTicketFor(n.id);
    if (n.id === 'dana') return danaTalk(n);
    if (t) {
      if (t.st === 'new') return dlg({ n, text: `Harsh! I just put in a ticket: "${TPL[t.id].title}". Any chance you can take it?`, choices: [{ t: 'I am on it', fn: () => { assign(t); S.track = t.uid; ticketTalk(n, t); } }, { t: 'Give me a few minutes' }] });
      return ticketTalk(n, t);
    }
    smallTalk(n);
  }
  function ticketTalk(n, t) {
    const tpl = TPL[t.id], first = !t.talked; t.talked = true; const ch = [];
    tpl.clues.forEach((c, i) => { if (!t.asked.includes(i)) ch.push({ t: c[0], fn: () => { t.asked.push(i); addMin(2); t.log.push({ k: 'q', s: 'You asked: ' + c[0] }, { k: 'u', s: n.first + ': ' + c[1] }); dlg({ n, text: c[1], next: () => ticketTalk(n, t) }); } }); });
    if (tpl.target === 'desk') {
      if (nearDesk(n)) ch.push({ t: 'Let me take a look at your PC', fn: () => openTS(t) });
      else ch.push({ t: 'Meet me at your desk', fn: () => sendHome(n) });
    } else ch.push({ t: 'I will go check ' + WD.stations[tpl.target].name, fn: () => { S.track = t.uid; } });
    ch.push({ t: 'Back in a bit' });
    dlg({ n, text: first ? tpl.desc : pick(['Any luck yet?', 'Still broken, I am afraid.', 'What else do you need to know?']), choices: ch });
  }
  function smallTalk(n) {
    const firstToday = !S.talkDay[n.id];
    if (firstToday) { S.talkDay[n.id] = 1; S.stats.chats++; }
    if (firstToday && Math.random() < 0.45) {
      const left = D.QUIZ.map((q, i) => i).filter((i) => !S.quizUsed.includes(i));
      if (!left.length) S.quizUsed = [];
      const qi = left.length ? pick(left) : 0, q = D.QUIZ[qi]; S.quizUsed.push(qi); S.stats.quiz++;
      return dlg({ n, text: q[0], choices: q[1].map((o, i) => ({ t: o, fn: () => {
        const ok = i === q[2]; if (ok) { S.stats.quizOk++; addXP(15); sfx.ok(); } else sfx.bad();
        dlg({ n, text: (ok ? 'Knew you would know. ' : 'Hmm, I do not think so. I looked it up: ') + q[4] });
      } })) });
    }
    if (firstToday) addXP(5);
    dlg({ n, text: pick(n.e.lines.concat(Math.random() < 0.4 ? D.GENERIC : [])) });
  }
  function danaTalk(n) {
    const t = tracked(), ch = [];
    if (t) ch.push({ t: 'Any advice on ticket #' + t.uid + '?', fn: () => {
      const tpl = TPL[t.id], i = tpl.checks.findIndex((c, k) => c.k && !t.checks.includes(k));
      const txt = !t.talked ? 'Have you talked to ' + npcById[t.who].first + ' yet? Start there. Users tell you more than they think they are telling you.'
        : i >= 0 ? 'If it were me, I would start with: "' + tpl.checks[i].l + '". Collect the evidence, then pick the fix that matches it.'
          : 'You have all the evidence. Read it back and pick the smallest fix that explains everything you saw.';
      dlg({ n, text: txt });
    } });
    ch.push({ t: 'How am I doing?', fn: () => {
      const nx = D.LEVELS[S.lvl + 1];
      dlg({ n, text: nx ? `You are ${nx.xp - S.xp} XP from ${nx.t}. Average satisfaction is ${csatAvg().toFixed(1)} out of 5. ${csatAvg() >= 4.3 ? 'People like you. Keep it up.' : 'Slow down and diagnose before you fix. Wrong fixes cost trust.'}` : 'You are running the department. I taught you everything I know. Mostly.' });
    } });
    ch.push({ t: 'Just saying hi', fn: () => dlg({ n, text: pick(n.e.lines) }) });
    dlg({ n, text: pick(['What do you need, Harsh?', 'Hey. How is the queue?', 'Talk to me.']), choices: ch });
  }

  /* ---------- interactions ---------- */
  function stationTickets(key) { return S.tickets.filter((t) => t.st !== 'done' && TPL[t.id].target === key); }
  function useStation(key, idle) {
    const list = stationTickets(key), mine = list.find((t) => t.uid === S.track && t.st === 'mine') || list.find((t) => t.st === 'mine'), nw = list.find((t) => t.st === 'new');
    if (mine) return openTS(mine);
    if (nw) return say(`There is an open ticket for this: "${TPL[nw.id].title}". You take it.`, () => { assign(nw); S.track = nw.uid; openTS(nw); });
    say(idle);
  }
  const ACT = {
    itpc: () => openDesk('queue'),
    parts: () => openParts(),
    coffee: () => {
      if (S.coffee >= 4) return say('Your hands are already vibrating. Maybe water this time.');
      S.coffee++; S.stats.coffees++; S.energy = clamp(S.energy + 35, 0, 100); S.buff = 50; addMin(3); sfx.coffee(); pop('+35 ENERGY', '#ffb23e');
      for (let i = 0; i < 10; i++) parts.push({ x: P.x + rnd(-4, 4), y: P.y - 20, vx: rnd(-6, 6), vy: rnd(-22, -10), t: 0, life: rnd(0.6, 1.2), c: '#ffffff' });
      toast(pick(['Fresh coffee. You can feel your packets moving faster.', 'Coffee acquired. Latency reduced.', 'Dark roast. Free. Perfect.']) + ' <span class="good">+35 energy</span>');
    },
    snack: () => {
      if (S.snacks >= 5) return say('You have had five. Leave some for Finance.');
      S.snacks++; S.stats.snacks++; S.energy = clamp(S.energy + 15, 0, 100); addMin(2); sfx.munch(); pop('+15 ENERGY', '#ffb23e');
      toast(pick(['Trail mix.', 'A granola bar that is mostly chocolate.', 'Chips. The good ones.', 'A suspiciously fancy cookie.']) + ' <span class="good">+15 energy</span>');
    },
    fruit: () => { S.energy = clamp(S.energy + 8, 0, 100); sfx.munch(); pop('+8 ENERGY', '#ffb23e'); toast('An apple. Your one healthy choice today. <span class="good">+8 energy</span>'); addMin(1); },
    fridge: () => say(pick(['A yogurt labelled "OLGA. DO NOT TOUCH." You do not touch.', 'Someone left half a burrito in here in what looks like 2023.', 'Oat milk, regular milk, and a mystery container nobody will claim.'])),
    cooler: () => { S.energy = clamp(S.energy + 4, 0, 100); toast('You hydrate like a responsible adult. <span class="good">+4 energy</span>'); sfx.blip(); },
    pizza: () => {
      const lunch = S.clock >= 720 && S.clock <= 840;
      if (lunch && S.pizzaDay !== S.day) { S.pizzaDay = S.day; S.energy = clamp(S.energy + 40, 0, 100); sfx.munch(); pop('+40 ENERGY', '#ffb23e'); addMin(8); toast('Free lunch pizza. Still warm. <span class="good">+40 energy</span>'); }
      else say(lunch ? 'You already had your slices. Be strong.' : 'Just a table for now. The free lunch pizza lands at 12:00.');
    },
    tips: () => openModal(`<div class="wb"><h3>Whiteboard</h3><pre>${esc(pick(D.TIPS))}</pre><button data-a="close">Got it</button></div>`),
    cork: () => openModal(`<div class="wb cork"><h3>Notice board</h3><pre>${esc(`EMPLOYEE OF THE MONTH\n  ${csatAvg() >= 4.5 && S.stats.closed >= 5 ? 'Harsh (IT)' : 'Rosa (Front Desk)'}\n\nREMINDER\n  IT will never ask for your password.\n\nFREE\n  Snacks: break room, Floor 1\n  Pizza: daily at 12:00\n\nLOST\n  One USB-C charger. Reward: gratitude.`)}</pre><button data-a="close">Close</button></div>`),
    bench: () => say('Your workbench. A half-built PC is waiting for a quiet afternoon that never comes.'),
    elevator: () => changeFloor('elev'),
    srvdoor: () => say(S.lvl >= 2 ? 'The keypad blinks green.' : 'Server room. Keycard access only. Dana says you get one when you make Systems Admin (L3).'),
    server: () => useStation('server', 'The racks hum. Every light is green. Rule one of the server room: do not touch what is not broken.'),
    printer1: () => useStation('printer1', 'The Sales printer. It works. For now. It can smell fear.'),
    printer2: () => useStation('printer2', 'The Floor 2 printer. Quiet. Too quiet.'),
    meeting: () => useStation('meeting', 'The Fraser Room TV. Showing the default "No Signal" bounce, as nature intended.'),
    boardtv: () => say('The boardroom TV. Somebody left a slide up that just says "SYNERGY?"'),
    pc: (o) => {
      const n = npcById[o.ref.owner], t = openTicketFor(n.id);
      if (n.st === 'sit') return talk(n);
      if (t && t.st === 'mine' && TPL[t.id].target === 'desk') return openTS(t);
      say(n.first + ' is away from their desk. Poking around in someone else\'s PC without asking is not a good look.');
    },
  };

  function findNear() {
    const fx = [0, -1, 1, 0][P.dir], fy = [1, 0, 0, -1][P.dir], px = P.x + fx * 11, py = P.y - 5 + fy * 11;
    let best = null, bd = 26;
    for (const n of NPC) if (n.f === S.f) { const d = Math.hypot(n.x - px, n.y - 6 - py); if (d < bd) { bd = d; best = { npc: n, label: 'Talk to ' + n.first }; } }
    for (const o of inter[S.f]) {
      if (o.ref.hidden) continue;
      const d = Math.hypot(o.x - px, o.y - 4 - py) + 3; if (d < bd) { bd = d; best = { o, label: actLabel(o) }; }
    }
    return best;
  }
  function actLabel(o) {
    const v = { itpc: 'Open DeskFlow', parts: 'Open IT storage', coffee: 'Get coffee', snack: 'Grab a snack', fruit: 'Take fruit', fridge: 'Look in fridge', cooler: 'Drink water', pizza: 'Check the table', tips: 'Read ' + (o.label || 'board'), cork: 'Read notice board', bench: 'Look at workbench', elevator: 'Take the elevator', srvdoor: 'Server room door', pc: 'Use ' + o.label };
    return v[o.act] || ('Check ' + o.label);
  }
  function interact() {
    const b = ui.near; if (!b) return;
    sfx.blip();
    if (b.npc) talk(b.npc); else ACT[b.o.act](b.o);
  }

  function changeFloor(kind) {
    if (ui.fade) return; sfx.door();
    ui.fade = { t: 0, done: false, fn: () => {
      S.f = 1 - S.f; const F = floor(), a = kind === 'elev' ? F.elevArrive : F.stairsArrive;
      P.x = (a[0] + 0.5) * TS; P.y = (a[1] + 1) * TS - 4; P.dir = 0; ui.room = ''; ui.lockMove = true;
    } };
  }

  /* ---------- modals ---------- */
  function openModal(html, forced) { ui.desk = null; ui.modal = true; ui.forced = !!forced; $('win').innerHTML = html; $('modal').classList.add('on'); }
  function closeModal() { ui.modal = null; ui.forced = false; ui.desk = null; $('modal').classList.remove('on'); $('win').innerHTML = ''; ui.ts = null; nextPromo(); hud(); }
  const H = {};
  $('win').addEventListener('click', (e) => { const b = e.target.closest('[data-a]'); if (!b || b.disabled) return; const fn = H[b.dataset.a]; if (fn) fn(b.dataset); });
  H.close = () => closeModal();

  /* DeskFlow: the ticketing app */
  let deskSel = null;
  function openDesk(tab) {
    const open = S.tickets.filter((t) => t.st !== 'done').sort((a, b) => (a.st === 'mine' ? 0 : 1) - (b.st === 'mine' ? 0 : 1) || a.due - b.due);
    if (!open.find((t) => t.uid === deskSel)) deskSel = open.length ? open[0].uid : null;
    const tabs = [['queue', 'Queue (' + open.length + ')'], ['kb', 'Knowledge base'], ['stats', 'My stats']].map(([k, l]) => `<button class="tab ${k === tab ? 'on' : ''}" data-a="tab" data-t="${k}">${l}</button>`).join('');
    let body = '';
    if (tab === 'queue') {
      const rows = open.map((t) => {
        const tpl = TPL[t.id], left = Math.round(t.due - S.wm);
        return `<button class="row ${t.uid === deskSel ? 'sel' : ''}" data-a="sel" data-u="${t.uid}"><span class="chip t${tpl.tier}">L${tpl.tier}</span><span class="rt"><b>#${t.uid}</b> ${esc(tpl.title)}<small>${npcById[t.who].e.name} &middot; ${tpl.cat}</small></span><span class="st ${t.st}">${t.st === 'mine' ? 'YOURS' : 'NEW'}</span><span class="due ${left < 25 ? 'hot' : ''}">${left < 0 ? 'LATE' : left + 'm'}</span></button>`;
      }).join('') || '<p class="empty">Queue is empty. Enjoy it while it lasts. New tickets come in through the day.</p>';
      let det = '<p class="empty">Select a ticket.</p>';
      const t = open.find((x) => x.uid === deskSel);
      if (t) {
        const tpl = TPL[t.id], n = npcById[t.who], st = tpl.target === 'desk' ? null : WD.stations[tpl.target];
        det = `<h3>#${t.uid} ${esc(tpl.title)}</h3>
          <p class="meta"><span class="chip t${tpl.tier}">Tier ${tpl.tier}</span> ${tpl.cat} &middot; due ${fmt(clamp(S.clock + (t.due - S.wm), 0, 1439))}${t.due - S.wm > 1020 - S.clock ? ' (tomorrow)' : ''}</p>
          <blockquote>"${esc(tpl.desc)}"<cite>${n.e.name}, ${n.e.role}</cite></blockquote>
          <dl><dt>Requester</dt><dd>${n.first} sits in ${seatRoom(t.who)}</dd><dt>Device</dt><dd>${st ? st.name + ', Floor ' + (st.f + 1) : n.first + "'s PC at their desk"}</dd>
          <dt>Progress</dt><dd>${t.asked.length}/${tpl.clues.length} questions asked, ${t.checks.length}/${tpl.checks.length} checks run${t.need ? ', needs ' + D.ITEMS[t.need].n : ''}</dd></dl>
          <div class="acts">${t.st === 'new' ? `<button class="pri" data-a="take" data-u="${t.uid}">Assign to me</button>` : (S.track === t.uid ? '<span class="tracking">Tracking this ticket</span>' : `<button class="pri" data-a="track" data-u="${t.uid}">Track this ticket</button>`)}</div>
          <p class="how">How to work it: talk to the requester, run diagnostics on the device, then choose a fix. Wrong fixes cost time and satisfaction.</p>`;
      }
      body = `<div class="q"><div class="list">${rows}</div><div class="det">${det}</div></div>`;
    } else if (tab === 'kb') {
      const cards = D.TICKETS.filter((t) => S.kb[t.id]).map((t) => `<article><span class="chip t${t.tier}">L${t.tier}</span><h4>${esc(t.learn[0])}</h4><p>${esc(t.learn[1])}</p></article>`).join('');
      body = `<div class="kb"><article class="pin"><h4>The six step method</h4><p>1. Identify the problem (ask questions). 2. Form a theory. 3. Test the theory. 4. Plan and apply the fix. 5. Verify it works. 6. Document it.</p></article>${cards || '<p class="empty">Close tickets to add what you learned here. ' + D.TICKETS.length + ' articles to collect.</p>'}<p class="dim">${Object.keys(S.kb).length} of ${D.TICKETS.length} articles unlocked</p></div>`;
    } else {
      const nx = D.LEVELS[S.lvl + 1], s = S.stats;
      body = `<div class="stats"><div><b>${lvlName()}</b><small>current role</small></div><div><b>${S.xp}</b><small>XP${nx ? ' (next: ' + nx.xp + ')' : ''}</small></div><div><b>${s.closed}</b><small>tickets closed</small></div>
        <div><b>${s.closed ? Math.round(s.firstTry / s.closed * 100) : 0}%</b><small>fixed first try</small></div><div><b>${csatAvg().toFixed(1)}</b><small>satisfaction / 5</small></div><div><b>${s.late}</b><small>SLA misses</small></div>
        <div><b>${s.coffees}</b><small>coffees</small></div><div><b>${s.quizOk}/${s.quiz}</b><small>coworker questions</small></div><div><b>${S.day}</b><small>day on the job</small></div></div>`;
    }
    openModal(`<div class="app"><header><span class="logo">DeskFlow</span><nav>${tabs}</nav><button class="x" data-a="close">ESC</button></header>${body}</div>`);
    ui.desk = tab;
  }
  H.tab = (d) => openDesk(d.t);
  H.sel = (d) => { deskSel = +d.u; sfx.blip(); openDesk('queue'); };
  H.take = (d) => { const t = S.tickets.find((x) => x.uid === +d.u); assign(t); S.track = t.uid; openDesk('queue'); hud(); };
  H.track = (d) => { S.track = +d.u; sfx.sel(); openDesk('queue'); hud(); };

  /* Troubleshooting panel */
  function openTS(t) {
    S.track = t.uid; const tpl = TPL[t.id], n = npcById[t.who];
    if (!t.log.length) t.log.push({ k: 'sys', s: 'Ticket #' + t.uid + ': ' + tpl.title });
    const cost = (m) => Math.round((m || 4) * (S.energy < 20 ? 1.5 : 1));
    const log = t.log.map((l) => `<div class="l ${l.k}">${esc(l.s)}</div>`).join('');
    let side;
    if (t.result) {
      const r = t.result;
      side = `<div class="done"><h4>Resolved</h4><div class="learn"><b>${esc(tpl.learn[0])}</b><p>${esc(tpl.learn[1])}</p></div>
        <table>${r.notes.map((x) => `<tr><td>${x[0]}</td><td>${x[1]}</td></tr>`).join('')}<tr class="tot"><td>XP earned</td><td>+${r.xp}</td></tr><tr><td>${n.first}'s rating</td><td>${'★'.repeat(Math.round(r.cs))}${'☆'.repeat(5 - Math.round(r.cs))}</td></tr></table>
        <button class="pri" data-a="tsclose">Write it up and close ticket</button></div>`;
    } else {
      side = `<h4>Diagnose <small>gather evidence</small></h4>${tpl.checks.map((c, i) => `<button class="ck" data-a="check" data-i="${i}" ${t.checks.includes(i) ? 'disabled' : ''}><span>${esc(c.l)}</span><i>${t.checks.includes(i) ? 'done' : cost(c.t) + ' min'}</i></button>`).join('')}
        <h4>Fix <small>choose carefully</small></h4>${tpl.fixes.map((f, i) => `<button class="fx ${t.tried && t.tried.includes(i) ? 'tried' : ''}" data-a="fix" data-i="${i}" ${t.tried && t.tried.includes(i) ? 'disabled' : ''}><span>${esc(f.l)}</span>${f.need ? `<i>needs ${D.ITEMS[f.need].i}</i>` : ''}</button>`).join('')}
        <p class="dim">${t.asked.length}/${tpl.clues.length} questions asked${tpl.clues.length > t.asked.length ? '. Talking to ' + n.first + ' may reveal more.' : '.'}${S.energy < 20 ? ' You are tired: checks take longer. Coffee?' : ''}</p>`;
    }
    openModal(`<div class="ts"><header><span class="chip t${tpl.tier}">L${tpl.tier}</span><b>#${t.uid} ${esc(tpl.title)}</b><span class="dim">${tpl.target === 'desk' ? n.first + "'s PC" : WD.stations[tpl.target].name}</span>${t.result ? '' : '<button class="x" data-a="close">ESC</button>'}</header>
      <div class="ts-b"><div class="term" id="term">${log}<div class="cur">_</div></div><div class="side">${side}</div></div></div>`, !!t.result);
    ui.ts = t; const tm = $('term'); tm.scrollTop = tm.scrollHeight;
  }
  H.check = (d) => {
    const t = ui.ts, tpl = TPL[t.id], i = +d.i, c = tpl.checks[i]; if (t.checks.includes(i)) return;
    t.checks.push(i); addMin(Math.round((c.t || 4) * (S.energy < 20 ? 1.5 : 1))); t.log.push({ k: 'cmd', s: '> ' + c.l }, { k: c.k ? 'key' : 'out', s: c.o }); sfx.key(); sfx.blip(); openTS(t);
  };
  H.fix = (d) => {
    const t = ui.ts, tpl = TPL[t.id], i = +d.i, f = tpl.fixes[i];
    if (f.need && !S.inv.includes(f.need)) {
      t.need = f.need; t.log.push({ k: 'sys', s: 'You need: ' + D.ITEMS[f.need].n + '. Grab one from the IT storage shelf (IT Office, Floor 1) and come back.' }); sfx.blip(); openTS(t); return;
    }
    if (f.need) { S.inv.splice(S.inv.indexOf(f.need), 1); t.need = null; }
    addMin(8); t.log.push({ k: 'cmd', s: '> FIX: ' + f.l });
    if (f.ok) {
      t.log.push({ k: 'good', s: f.o }, { k: 'good', s: 'Verified with ' + npcById[t.who].first + ': working.' }); t.result = rewards(t, f); sfx.ok();
    } else {
      t.wrong++; (t.tried = t.tried || []).push(i); t.log.push({ k: 'bad', s: f.o }); sfx.bad(); ui.shake = 0.35; S.energy = clamp(S.energy - 4, 0, 100);
    }
    openTS(t);
  };
  H.tsclose = () => { const t = ui.ts; closeModal(); closeTicket(t); };

  /* IT storage */
  function openParts() {
    const items = Object.keys(D.ITEMS).map((k) => { const it = D.ITEMS[k], has = S.inv.includes(k); return `<button class="item ${has ? 'has' : ''}" data-a="${has ? 'drop' : 'grab'}" data-k="${k}"><span class="ic">${it.i}</span><span>${it.n}</span><i>${has ? 'put back' : 'take'}</i></button>`; }).join('');
    const want = S.tickets.filter((t) => t.st === 'mine' && t.need).map((t) => D.ITEMS[t.need].n);
    openModal(`<div class="app parts"><header><span class="logo">IT storage</span><span class="dim">carrying ${S.inv.length}/4</span><button class="x" data-a="close">ESC</button></header>
      ${want.length ? `<p class="want">On your list: <b>${want.join(', ')}</b></p>` : ''}<div class="grid">${items}</div></div>`);
  }
  H.grab = (d) => { if (S.inv.length >= 4) { toast('Your backpack is full. Put something back first.'); return; } S.inv.push(d.k); sfx.sel(); openParts(); hud(); };
  H.drop = (d) => { S.inv.splice(S.inv.indexOf(d.k), 1); sfx.blip(); openParts(); hud(); };

  /* promotions, day end, help */
  function nextPromo() {
    if (ui.modal || ui.dlg || !ui.promoQ.length) return;
    const l = ui.promoQ.shift(), L = D.LEVELS[l]; sfx.promo();
    for (let i = 0; i < 90; i++) confetti.push({ x: rnd(0, VW), y: rnd(-60, 0), vx: rnd(-20, 20), vy: rnd(30, 90), c: pick(['#ffb23e', '#4c86ff', '#6fe3a1', '#ff6b6b', '#ffffff']), t: 0 });
    const txt = {
      1: ['Dana pulls you aside with a grin.', 'You are now <b>Desktop Support (L2)</b>. Expect hardware swaps, network faults and security cleanups. Tougher tickets, more XP. Stock up at IT storage.'],
      2: ['Dana hands you a keycard.', 'You are now <b>Systems Admin (L3)</b>. The <b>server room on Floor 2 is unlocked</b>. Outages that hit the whole office now land on you. Stay calm, find where the path breaks.'],
      3: ['Helen, the CEO, calls you upstairs.', 'You are the new <b>IT Manager</b>. From black monitors to broadcast storms, you learned it by doing it. The queue never ends, so keep playing as long as you like.'],
    }[l];
    if (l === 2) unlockServer();
    if (l === 3) S.won = true;
    save();
    openModal(`<div class="promo"><small>${txt[0]}</small><h2>Promoted!</h2><h3>${L.t} <span>${L.s}</span></h3><p>${txt[1]}</p>${l === 3 ? `<p class="dim">${S.stats.closed} tickets closed in ${S.day} days. Satisfaction ${csatAvg().toFixed(1)}/5. ${Object.keys(S.kb).length} knowledge base articles.</p>` : ''}<button class="pri" data-a="close">${l === 3 ? 'Keep working the queue' : 'Back to work'}</button></div>`, true);
  }
  function unlockServer() {
    const F = WD.floors[1], d = F.furn.find((f) => f.type === 'door');
    if (d && !d.hidden) { d.hidden = true; F.solid[d.y * MW + d.x] = 0; F.npcSolid[d.y * MW + d.x] = 0; const k = F.walls.find((w) => w.k === 'keypad'); if (k) k.open = true; FR[1] = A.renderFloor(F); }
  }
  function endDay() {
    const t = S.today, open = S.tickets.filter((x) => x.st !== 'done').length;
    const line = t.closed >= 6 ? 'A monster day. The office runs because of you.' : t.closed >= 3 ? 'Solid day. People noticed.' : t.closed >= 1 ? 'A quiet one. Tomorrow the queue will not be so kind.' : 'Tough day. Tomorrow: coffee first, then tickets.';
    openModal(`<div class="promo day"><small>5:00 PM</small><h2>Day ${S.day} done</h2><div class="stats"><div><b>${t.closed}</b><small>tickets closed</small></div><div><b>+${t.xp}</b><small>XP earned</small></div><div><b>${t.late}</b><small>SLA misses</small></div><div><b>${csatAvg().toFixed(1)}</b><small>satisfaction</small></div></div>
      <p>${line}${open ? ' ' + open + ' ticket' + (open > 1 ? 's' : '') + ' will be waiting in the morning.' : ''}</p><button class="pri" data-a="newday">Start day ${S.day + 1}</button></div>`, true);
  }
  H.newday = () => {
    S.day++; S.clock = 540; S.energy = 85; S.coffee = 0; S.snacks = 0; S.talkDay = {}; S.today = { closed: 0, xp: 0, late: 0 }; S.lunchToast = 0; S.buff = 0;
    S.f = 0; P.x = 2.5 * TS; P.y = 3 * TS + 10; P.dir = 0; NPC.forEach((n) => { sitDown(n); n.t = rnd(10, 60); });
    S.nextSpawn = S.wm + 5; save(); closeModal(); toast(`<b>Day ${S.day}</b> &middot; 9:00 AM. Coffee is fresh.`);
  };
  function openHelp() {
    openModal(`<div class="app help"><header><span class="logo">How to play</span><button class="x" data-a="close">ESC</button></header><div class="hp">
      <div><h4>Move</h4><p><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or arrow keys. On a phone, use the stick.</p><h4>Interact</h4><p><kbd>E</kbd> or <kbd>Space</kbd> to talk, use devices, grab coffee.</p><h4>Tickets</h4><p><kbd>T</kbd> opens DeskFlow from anywhere. <kbd>M</kbd> mutes sound.</p></div>
      <div><h4>Working a ticket</h4><p>1. Assign it to yourself in DeskFlow.<br>2. Talk to the person who raised it and ask questions.<br>3. Go to the device and run diagnostics.<br>4. Pick the fix that matches the evidence.<br>5. Some fixes need a part from IT storage.</p><h4>Getting promoted</h4><p>XP comes from closed tickets. Diagnose first, fix on the first try, and beat the SLA for bonuses. L3 unlocks the server room.</p></div></div></div>`);
  }

  /* ---------- HUD ---------- */
  function objective() {
    const t = tracked();
    if (!t) { const n = S.tickets.find((x) => x.st === 'new'); return n ? { text: 'New ticket waiting. Press <kbd>T</kbd> to open DeskFlow', pos: null } : { text: 'Queue is clear. Grab a coffee or chat with the team', pos: null }; }
    const tpl = TPL[t.id], n = npcById[t.who], s = n.seat;
    if (t.need && !S.inv.includes(t.need)) return { text: `#${t.uid}: get ${D.ITEMS[t.need].n} from IT storage (Floor 1)`, pos: WD.stations.parts };
    if (tpl.target === 'desk' || !t.talked) return { text: `#${t.uid}: ${t.talked ? 'fix it for' : 'talk to'} ${n.first} &middot; ${seatRoom(t.who)}`, pos: { f: s.f, x: s.vx, y: s.vy } };
    const st = WD.stations[tpl.target]; return { text: `#${t.uid}: go to ${st.name} &middot; Floor ${st.f + 1}`, pos: st };
  }
  function hud() {
    const L = D.LEVELS[S.lvl], nx = D.LEVELS[S.lvl + 1];
    $('h-title').textContent = L.t + ' · ' + L.s;
    $('h-xp').style.width = (nx ? clamp((S.xp - L.xp) / (nx.xp - L.xp) * 100, 0, 100) : 100) + '%';
    $('h-xpt').textContent = nx ? S.xp + ' / ' + nx.xp + ' XP' : S.xp + ' XP';
    $('h-en').style.width = S.energy + '%'; $('h-en').className = S.energy < 20 ? 'low' : S.buff > 0 ? 'buff' : '';
    const cs = csatAvg(); $('h-cs').textContent = '★'.repeat(Math.round(cs)) + '☆'.repeat(5 - Math.round(cs));
    $('h-clock').textContent = fmt(Math.min(S.clock, 1020)); $('h-day').textContent = 'Day ' + S.day + ' · Floor ' + (S.f + 1);
    const open = S.tickets.filter((t) => t.st !== 'done').length; $('h-tk').textContent = open; $('h-tk').style.display = open ? '' : 'none';
    $('obj').innerHTML = objective().text;
    $('inv').innerHTML = S.inv.map((k) => `<span title="${D.ITEMS[k].n}">${D.ITEMS[k].i}</span>`).join('');
    $('b-mute').textContent = S.mute ? 'Sound off' : 'Sound on';
  }

  /* ---------- save / load ---------- */
  function save() {
    try { const o = {}; ['xp', 'lvl', 'day', 'clock', 'wm', 'energy', 'csat', 'solved', 'kb', 'uid', 'stats', 'quizUsed', 'mute', 'won', 'coffee', 'snacks', 'today'].forEach((k) => { o[k] = S[k]; }); localStorage.setItem(SAVE_KEY, JSON.stringify(o)); } catch (e) { /* storage may be unavailable */ }
  }
  function load() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { return null; } }

  /* ---------- input ---------- */
  addEventListener('keydown', (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (!S.started) return;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Tab'].includes(k)) e.preventDefault();
    if (e.repeat && !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(k)) return;
    keys[k] = true;
    if (ui.dlg) { if (k === 'e' || k === ' ' || k === 'Enter') dlgAdvance(); else if (/^[1-9]$/.test(k)) dlgChoose(+k - 1); return; }
    if (ui.modal) { if (k === 'Escape' && !ui.forced) closeModal(); else if ((k === 't' || k === 'Tab') && ui.desk && !ui.ts && !ui.forced) { closeModal(); } return; }
    if (k === 'e' || k === ' ' || k === 'Enter') interact();
    else if (k === 't' || k === 'Tab') openDesk('queue');
    else if (k === 'k') openDesk('kb');
    else if (k === 'h' || k === '?') openHelp();
    else if (k === 'm') toggleMute();
  });
  addEventListener('keyup', (e) => { const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; keys[k] = false; });
  addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
  function toggleMute() { S.mute = !S.mute; if (master) master.gain.value = S.mute ? 0 : 0.5; hud(); save(); }
  $('b-tk').onclick = () => { if (!ui.modal && !ui.dlg) openDesk('queue'); };
  $('b-help').onclick = () => { if (!ui.modal && !ui.dlg) openHelp(); };
  $('b-mute').onclick = () => { audio(); toggleMute(); };
  $('act').addEventListener('pointerdown', (e) => { e.preventDefault(); if (ui.dlg) dlgAdvance(); else if (!ui.modal) interact(); });
  (() => {
    const j = $('joy'), k = $('knob'); let id = null, cx = 0, cy = 0;
    const mv = (e) => { const dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy), m = 36, f = d > m ? m / d : 1; k.style.transform = `translate(${dx * f}px,${dy * f}px)`; joy.x = d > 8 ? dx / Math.max(d, m) : 0; joy.y = d > 8 ? dy / Math.max(d, m) : 0; };
    j.addEventListener('pointerdown', (e) => { id = e.pointerId; j.setPointerCapture(id); const r = j.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2; mv(e); });
    j.addEventListener('pointermove', (e) => { if (e.pointerId === id) mv(e); });
    const up = () => { id = null; joy.x = joy.y = 0; k.style.transform = ''; };
    j.addEventListener('pointerup', up); j.addEventListener('pointercancel', up);
  })();

  /* ---------- update ---------- */
  function blocked(x, y) {
    const F = floor(), x0 = Math.floor((x - 4) / TS), x1 = Math.floor((x + 4) / TS), y0 = Math.floor((y - 6) / TS), y1 = Math.floor((y - 1) / TS);
    for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) { if (xx < 0 || yy < 0 || xx >= MW || yy >= MH || F.solid[yy * MW + xx]) return true; }
    return false;
  }
  function update(dt) {
    music(dt);
    for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i]; p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.t > p.life) parts.splice(i, 1); }
    for (let i = pops.length - 1; i >= 0; i--) { pops[i].t += dt; pops[i].y -= 14 * dt; if (pops[i].t > 1.4) pops.splice(i, 1); }
    for (let i = confetti.length - 1; i >= 0; i--) { const c = confetti[i]; c.t += dt; c.x += c.vx * dt + Math.sin(c.t * 6 + i) * 0.4; c.y += c.vy * dt; if (c.y > VH + 10) confetti.splice(i, 1); }
    if (ui.shake > 0) ui.shake -= dt;
    if (ui.dlg && !ui.dlg.done) { const d = ui.dlg; d.acc += dt * 55; const n = Math.min(d.o.text.length, d.acc | 0); if (n !== d.n) { d.n = n; $('dlg-text').textContent = d.o.text.slice(0, n); if (n % 3 === 0) sfx.blip(); } if (n >= d.o.text.length) dlgFinish(); }
    if (ui.fade) { const f = ui.fade; f.t += dt; if (!f.done && f.t >= 0.22) { f.done = true; f.fn(); } if (f.t >= 0.46) ui.fade = null; return; }
    if (!S.started) return;
    const paused = ui.dlg || ui.modal;
    if (!paused) nextPromo();
    if (paused) { ui.near = null; $('prompt').classList.remove('on'); return; }

    /* player */
    let mx = (keys.ArrowRight || keys.d ? 1 : 0) - (keys.ArrowLeft || keys.a ? 1 : 0) + joy.x, my = (keys.ArrowDown || keys.s ? 1 : 0) - (keys.ArrowUp || keys.w ? 1 : 0) + joy.y;
    let ml = Math.hypot(mx, my); if (ui.lockMove) { if (ml < 0.15) ui.lockMove = false; mx = my = ml = 0; } P.moving = ml > 0.15;
    if (P.moving) {
      if (ml > 1) { mx /= ml; my /= ml; }
      const sp = 66 * (S.buff > 0 ? 1.28 : 1) * (S.energy < 15 ? 0.78 : 1) * dt;
      P.dir = Math.abs(mx) > Math.abs(my) ? (mx < 0 ? 1 : 2) : (my < 0 ? 3 : 0);
      if (!blocked(P.x + mx * sp, P.y)) P.x += mx * sp;
      if (!blocked(P.x, P.y + my * sp)) P.y += my * sp;
      P.at += dt; P.fr = ((P.at * 9) | 0) % 4;
      if (S.buff > 0 && Math.random() < 0.3) parts.push({ x: P.x + rnd(-3, 3), y: P.y - 2, vx: 0, vy: -8, t: 0, life: 0.4, c: '#ffb23e' });
    } else { P.fr = 0; P.at = 0; }
    const tx = Math.floor(P.x / TS), ty = Math.floor((P.y - 3) / TS);
    if (floor().t[ty * MW + tx] === 'stairs') { changeFloor('stairs'); return; }
    const rm = WD.roomAt(S.f, tx, ty); if (rm && rm !== ui.room) { ui.room = rm; const r = $('room'); r.textContent = rm; r.classList.remove('on'); void r.offsetWidth; r.classList.add('on'); }

    /* time */
    addMin(dt * 1.43); if (S.buff > 0) S.buff -= dt;
    const open = S.tickets.filter((t) => t.st !== 'done');
    if (S.wm >= S.nextSpawn) {
      if (open.length < (S.lvl === 0 ? 3 : 4) && S.clock < 985) { spawnTicket(); S.nextSpawn = S.wm + rnd(30, 52) - S.lvl * 2; } else S.nextSpawn = S.wm + 8;
    }
    for (const t of open) if (!t.lateWarn && S.wm > t.due - 20) { t.lateWarn = true; toast(`<b>#${t.uid}</b> is close to its SLA. ${npcById[t.who].first} is getting impatient.`, 'warn'); }
    if (S.clock >= 720 && !S.lunchToast) { S.lunchToast = 1; toast('<b>12:00</b> Free pizza just landed in the break room (Floor 1).'); }
    if (S.energy < 20 && !ui.tired) { ui.tired = true; toast('You are running on empty. Diagnostics take longer when you are tired. Coffee?', 'warn'); } if (S.energy > 40) ui.tired = false;
    for (const n of NPC) updateNPC(n, dt);
    if (S.clock >= 1020) { endDay(); return; }

    ui.near = findNear();
    const pr = $('prompt'); if (ui.near) { pr.innerHTML = '<kbd>E</kbd> ' + esc(ui.near.label); pr.classList.add('on'); } else pr.classList.remove('on');
    ui.hudT -= dt; if (ui.hudT <= 0) { ui.hudT = 0.3; hud(); }
  }

  /* ---------- render ---------- */
  let vig = null;
  function resize() {
    const w = innerWidth, h = innerHeight; SC = Math.max(2, Math.floor(Math.min(h / 190, w / 300)));
    VW = Math.ceil(w / SC); VH = Math.ceil(h / SC); cv.width = VW; cv.height = VH; cv.style.width = VW * SC + 'px'; cv.style.height = VH * SC + 'px'; g.imageSmoothingEnabled = false;
    vig = A.mk(VW, VH); const vg = vig.getContext('2d'), gr = vg.createRadialGradient(VW / 2, VH / 2, VH * 0.35, VW / 2, VH / 2, Math.max(VW, VH) * 0.75);
    gr.addColorStop(0, 'rgba(8,10,26,0)'); gr.addColorStop(1, 'rgba(8,10,26,.5)'); vg.fillStyle = gr; vg.fillRect(0, 0, VW, VH);
  }
  addEventListener('resize', resize);

  function bubble(x, y, sym, col, bg) {
    A.R(g, x - 5, y - 10, 11, 9, '#15161f'); A.R(g, x - 4, y - 9, 9, 7, bg || '#ffffff'); A.R(g, x - 1, y - 1, 3, 1, '#15161f'); A.R(g, x, y, 1, 1, '#15161f'); A.R(g, x - 1, y - 2, 3, 1, bg || '#ffffff');
    if (sym === 'heart') { A.R(g, x - 3, y - 8, 2, 2, col); A.R(g, x + 1, y - 8, 2, 2, col); A.R(g, x - 3, y - 7, 6, 2, col); A.R(g, x - 2, y - 5, 4, 1, col); A.R(g, x - 1, y - 4, 2, 1, col); }
    else if (sym === 'cup') { A.R(g, x - 3, y - 7, 5, 4, col); A.R(g, x + 2, y - 6, 1, 2, col); A.R(g, x - 2, y - 9, 1, 1, '#999'); A.R(g, x, y - 9, 1, 1, '#999'); }
    else if (sym === 'chat') { A.R(g, x - 3, y - 6, 1, 1, col); A.R(g, x - 1, y - 6, 1, 1, col); A.R(g, x + 1, y - 6, 1, 1, col); }
    else if (sym === 'note') { A.R(g, x - 2, y - 8, 4, 5, col); A.R(g, x - 1, y - 7, 2, 1, '#fff'); A.R(g, x - 1, y - 5, 2, 1, '#fff'); }
    else A.ptext(g, sym, x - 2, y - 8, col);
  }
  function drawScreen(f, t) {
    const x = f.dx + 10 - cam.x, y = f.dy + 1 - cam.y, n = f.owner ? npcById[f.owner] : null, tk = n ? openTicketFor(n.id) : null;
    const tpl = tk ? TPL[tk.id] : null, outage = S.tickets.some((q) => q.st !== 'done' && TPL[q.id].outage);
    if (f.act === 'itpc') { A.R(g, x, y, 12, 7, '#0c2a1c'); A.R(g, x + 1, y + 1, 5, 1, '#6fe3a1'); A.R(g, x + 1, y + 3, 8, 1, '#6fe3a1'); if (((t * 2) | 0) % 2) A.R(g, x + 1, y + 5, 2, 1, '#6fe3a1'); return; }
    if (tpl && tpl.target === 'desk' && tpl.screen === 'off') { A.R(g, x, y, 12, 7, '#06070b'); if (((t * 1.5) | 0) % 2) A.R(g, x + 10, y + 8, 1, 1, '#ffb23e'); return; }
    if (tpl && tpl.target === 'desk' && tpl.screen === 'bsod') { A.R(g, x, y, 12, 7, '#1857c4'); A.R(g, x + 2, y + 1, 1, 1, '#fff'); A.R(g, x + 2, y + 3, 1, 1, '#fff'); A.R(g, x + 4, y + 1, 1, 3, '#fff'); A.R(g, x + 2, y + 5, 7, 1, '#9cc0ff'); return; }
    if (tpl && tpl.target === 'desk' && tpl.screen === 'err') { A.R(g, x, y, 12, 7, ((t * 3) | 0) % 2 ? '#c0392b' : '#7a1f17'); A.R(g, x + 5, y + 1, 2, 3, '#fff'); A.R(g, x + 5, y + 5, 2, 1, '#fff'); return; }
    if (outage) { A.R(g, x, y, 12, 7, '#a8701a'); A.R(g, x + 5, y + 1, 2, 3, '#fff3d0'); A.R(g, x + 5, y + 5, 2, 1, '#fff3d0'); return; }
    if (n && n.st !== 'sit') { A.R(g, x, y, 12, 7, '#0e1228'); const k = (t * 6 + f.x * 3) % 24; A.R(g, x + (k < 12 ? k : 23 - k) | 0, y + 1 + (((t * 3 + f.x) % 10) < 5 ? (t * 3 + f.x) % 5 : 4 - ((t * 3 + f.x) % 5)) | 0, 1, 1, '#4c86ff'); return; }
    A.R(g, x, y, 12, 7, '#2b6de0'); A.R(g, x + 1, y + 1, 10, 1, '#dce8ff'); A.R(g, x + 1, y + 3, 6 + ((f.x + (t | 0)) % 4), 1, '#8fb4ff'); A.R(g, x + 1, y + 5, 4 + ((f.x * 3 + ((t * 0.7) | 0)) % 6), 1, '#8fb4ff');
  }
  function render(t) {
    const F = floor(), fr = FR[S.f];
    cam.x = MW * TS <= VW ? (MW * TS - VW) / 2 : clamp(P.x - VW / 2, 0, MW * TS - VW); const topPad = Math.ceil((innerWidth < 760 ? 200 : 128) / SC); cam.y = clamp(P.y - 14 - VH / 2, -topPad, Math.max(-topPad, MH * TS - VH + 8));
    cam.x = Math.round(cam.x); cam.y = Math.round(cam.y);
    let sx = 0, sy = 0; if (ui.shake > 0) { sx = Math.round(rnd(-2, 2)); sy = Math.round(rnd(-1, 1)); }
    g.setTransform(1, 0, 0, 1, sx, sy);
    A.R(g, -4, -4, VW + 8, VH + 8, '#0d0e16');
    g.drawImage(fr.base, -cam.x, -cam.y);
    const list = [];
    for (const f of F.furn) { if (f.hidden) continue; if (f.dx - cam.x > VW + 4 || f.dx + f.spr.width - cam.x < -4 || f.dy - cam.y > VH + 4 || f.dy + f.spr.height - cam.y < -4) continue; list.push({ y: f.sy, f }); }
    for (const n of NPC) if (n.f === S.f) list.push({ y: n.y + (n.st === 'sit' && n.seat.dir === 3 ? 2 : 0) - (n.st === 'sit' ? 2 : 0), n });
    if (S.started) list.push({ y: P.y, p: 1 });
    list.sort((a, b) => a.y - b.y);
    for (const it of list) {
      if (it.f) {
        const f = it.f; g.drawImage(f.spr, f.dx - 1 - cam.x, f.dy - 1 - cam.y);
        if (f.type === 'desk') drawScreen(f, t);
        else if (f.leds) { const bad = stationTickets('server').length > 0; for (let i = 0; i < 8; i++) { const on = Math.sin(t * (3 + (i * 1.7 + f.x) % 5) + i * 2 + f.x) > 0; A.R(g, f.dx + 3 - cam.x, f.dy + 4 + i * 4 - cam.y, 1, 1, on ? '#6fe3a1' : '#1d4a36'); A.R(g, f.dx + 5 - cam.x, f.dy + 4 + i * 4 - cam.y, 1, 1, bad && i % 3 === f.x % 3 ? (((t * 4) | 0) % 2 ? '#ff5d5d' : '#5a1d1d') : (Math.sin(t * 7 + i + f.x) > 0.6 ? '#ffb23e' : '#3a2f16')); } }
        else if (f.type === 'printer') { const bad = stationTickets(f.act).length > 0; A.R(g, f.dx + 24 - cam.x, f.dy + 11 - cam.y, 2, 2, bad ? (((t * 3) | 0) % 2 ? '#ffb23e' : '#5a4010') : '#6fe3a1'); }
        else if (f.steam && Math.random() < 0.04) parts.push({ x: f.dx + 8, y: f.dy + 8, vx: rnd(-2, 2), vy: rnd(-9, -5), t: 0, life: rnd(0.8, 1.4), c: '#e8ecf5' });
        else if (f.pizza && S.clock >= 720 && S.clock <= 840 && S.pizzaDay !== S.day) g.drawImage(A.sprite('pizza'), f.dx + 9 - cam.x, f.dy + 2 - cam.y);
      } else {
        const c = it.n || P, sheet = it.n ? it.n.sheet : harshSheet, x = Math.round(c.x - cam.x), y = Math.round(c.y - cam.y);
        if (!(it.n && it.n.st === 'sit')) { g.fillStyle = 'rgba(8,10,28,.3)'; g.fillRect(x - 5, y - 2, 10, 3); g.fillRect(x - 4, y - 3, 8, 5); }
        g.drawImage(sheet.f[c.dir][c.fr], x - 9, y - 25);
      }
    }
    g.drawImage(fr.over, -cam.x, -cam.y);
    for (const p of parts) { g.globalAlpha = clamp(1 - p.t / p.life, 0, 1) * 0.8; A.R(g, p.x - cam.x, p.y - cam.y, p.c === '#e8ecf5' ? 2 : 1, p.c === '#e8ecf5' ? 2 : 1, p.c); } g.globalAlpha = 1;
    /* speech bubbles */
    for (const n of NPC) if (n.f === S.f) {
      const tk = openTicketFor(n.id), x = Math.round(n.x - cam.x), y = Math.round(n.y - cam.y - 27 + Math.sin(t * 4 + n.x) * 1.5);
      if (tk) { const late = S.wm > tk.due - 20; bubble(x, y, tk.st === 'new' ? '!' : '?', late ? '#ffffff' : tk.st === 'new' ? '#c0392b' : '#2b6de0', late ? '#e2504a' : tk.st === 'new' ? '#ffe9a8' : '#dbe8ff'); }
      else if (n.emo) bubble(x, y, n.emo, n.emo === 'heart' ? '#ff5d8a' : n.emo === 'cup' ? '#8a5a34' : '#4c86ff');
    }
    /* objective arrow */
    const ob = objective();
    if (ob.pos && S.started && !ui.modal) {
      let tx = (ob.pos.x + 0.5) * TS, ty = ob.pos.y * TS; if (ob.pos.f !== S.f) { tx = 44 * TS; ty = 16 * TS; }
      const ax = tx - cam.x, ay = ty - cam.y - 20, on = ax > 8 && ax < VW - 8 && ay > 28 && ay < VH - 8, b = Math.round(Math.sin(t * 6) * 2);
      g.fillStyle = '#ffb23e'; g.strokeStyle = '#15161f'; g.lineWidth = 1; g.beginPath();
      if (on) { g.moveTo(ax - 5, ay - 6 + b); g.lineTo(ax + 5, ay - 6 + b); g.lineTo(ax, ay + b); }
      else { const cx = VW / 2, cy = VH / 2, an = Math.atan2(ay - cy, ax - cx), ex = clamp(ax, 14, VW - 14), ey = clamp(ay, 34, VH - 14); g.moveTo(ex + Math.cos(an) * 6, ey + Math.sin(an) * 6); g.lineTo(ex + Math.cos(an + 2.4) * 6, ey + Math.sin(an + 2.4) * 6); g.lineTo(ex + Math.cos(an - 2.4) * 6, ey + Math.sin(an - 2.4) * 6); }
      g.closePath(); g.fill(); g.stroke();
    }
    for (const p of pops) { const x = Math.round(p.x - cam.x - p.s.length * 2), y = Math.round(p.y - cam.y); g.globalAlpha = clamp(1.4 - p.t, 0, 1); A.ptext(g, p.s, x + 1, y + 1, '#15161f'); A.ptext(g, p.s, x, y, p.c); } g.globalAlpha = 1;
    /* light and mood */
    if (S.clock > 930) A.R(g, 0, 0, VW, VH, `rgba(255,150,60,${clamp((S.clock - 930) / 90, 0, 1) * 0.13})`);
    if (S.f === 1 && F.t[Math.floor((P.y - 3) / TS) * MW + Math.floor(P.x / TS)] === 'server') A.R(g, 0, 0, VW, VH, 'rgba(60,120,255,.08)');
    if (S.energy < 20) A.R(g, 0, 0, VW, VH, 'rgba(10,10,30,.18)');
    g.drawImage(vig, 0, 0);
    for (const c of confetti) A.R(g, c.x, c.y, 2, 3, c.c);
    if (ui.fade) { const k = ui.fade.t < 0.22 ? ui.fade.t / 0.22 : 1 - (ui.fade.t - 0.22) / 0.24; A.R(g, -4, -4, VW + 8, VH + 8, `rgba(8,10,22,${clamp(k, 0, 1)})`); }
    g.setTransform(1, 0, 0, 1, 0, 0);
  }

  /* ---------- boot ---------- */
  let last = 0, titleT = 0;
  function frame(ms) {
    const t = ms / 1000, dt = Math.min(0.05, t - last || 0.016); last = t;
    if (!S.started) { titleT += dt; P.x = (20 + Math.sin(titleT * 0.12) * 14) * TS; P.y = (7 + Math.cos(titleT * 0.09) * 3) * TS; for (const n of NPC) updateNPC(n, dt); }
    update(dt); render(t); requestAnimationFrame(frame);
  }
  function begin(cont) {
    audio(); const sv = cont ? load() : null; S = fresh(); if (sv) Object.assign(S, sv);
    S.started = true; S.tickets = []; S.track = null; S.inv = []; S.f = 0; S.nextSpawn = S.wm + 6;
    P.x = 2.5 * TS; P.y = 3 * TS + 10; P.dir = 0; NPC.forEach((n) => { sitDown(n); n.t = rnd(10, 60); });
    if (S.lvl >= 2) unlockServer();
    if (master) master.gain.value = S.mute ? 0 : 0.5;
    $('title').classList.add('off'); document.body.classList.add('playing'); hud();
    const dana = npcById.dana;
    if (!sv) {
      dlg({ n: dana, text: 'Morning, Harsh! Welcome to Cedarline. I am Dana, I run IT here. Until today "IT" was just me, so I am very happy to see you.', next: () =>
        dlg({ n: dana, text: 'Tickets come in through DeskFlow. Press T to open it from anywhere, or use the PC at your desk. Assign a ticket to yourself, then go talk to the person. Always talk first.', next: () =>
          dlg({ n: dana, text: 'Then diagnose before you fix. Every check costs a few minutes, but a wrong fix costs more time and their trust. Spare parts are on the shelf behind you.', next: () =>
            dlg({ n: dana, text: 'Coffee and snacks in the break room are free. Close tickets, keep people happy, and there is a promotion in it. Oh, look. Your first one just came in.', next: () => { spawnTicket('nodisplay', 'maya'); S.nextSpawn = S.wm + 45; hud(); } }) }) }) });
    } else {
      toast(`<b>Welcome back.</b> Day ${S.day}, ${fmt(S.clock)}. ${lvlName()}.`);
    }
  }
  $('b-new').onclick = () => begin(false);
  $('b-cont').onclick = () => begin(true);
  if (load()) { $('b-cont').style.display = ''; const s = load(); $('b-cont').textContent = `Continue (Day ${s.day}, ${D.LEVELS[s.lvl].t})`; }
  const hf = $('h-face').getContext('2d'); hf.drawImage(harshSheet.f[0][0], 0, 0);
  const tf = $('t-face').getContext('2d'); tf.drawImage(harshSheet.f[0][0], 0, 0);
  if (matchMedia('(pointer: coarse)').matches) document.body.classList.add('touch');
  resize(); hud();
  window.CAH = { S: () => S, P, NPC, tp: (f, x, y) => { S.f = f; P.x = (x + 0.5) * TS; P.y = (y + 1) * TS - 4; }, spawn: spawnTicket, addXP, openTS, openDesk, ui, TPL, talk, npcById, closeModal, assign, H };
  requestAnimationFrame(frame);
})();
