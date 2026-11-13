/* Ctrl+Alt+Harsh: the two-floor Cedarline office. */
window.WORLD = (() => {
  const W = 46, H = 26;
  const FOOT = { desk: [2, 1], deskF: [3, 1], printer: [2, 1], snack: [2, 1], tableS: [2, 1], couch: [2, 1], shelf: [2, 1], bench: [2, 1], bookshelf: [2, 1] };
  const SOFT = { stool: 1, chairD: 1, chairFD: 1, pizza: 1 };

  function makeFloor(i) {
    const F = { i, W, H, t: new Array(W * H).fill('#'), furn: [], decals: [], walls: [], rooms: [], spots: [] };
    F.carve = (x0, y0, x1, y1, type, name) => {
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) F.t[y * W + x] = type;
      if (name) F.rooms.push({ x0, y0, x1, y1, name });
    };
    F.door = (x, y) => { F.t[y * W + x] = 'door'; };
    F.add = (type, x, y, o = {}) => {
      const real = type === 'chairD' ? 'chair' : type === 'chairFD' ? 'chairF' : type;
      let fw = (FOOT[type] || [1, 1])[0], fh = (FOOT[type] || [1, 1])[1];
      if (type === 'tableL') { fw = o.v & 15; fh = o.v >> 4; }
      const f = Object.assign({ type: real, x, y, fw, fh, v: 0, solid: !SOFT[type], f: i }, o);
      F.furn.push(f); return f;
    };
    F.wall = (k, x, y, o = {}) => { const d = Object.assign({ k, x, y, w: 1 }, o); F.walls.push(d); return d; };
    F.decal = (k, x, y, w, h, o = {}) => F.decals.push(Object.assign({ k, x, y, w, h }, o));
    return F;
  }

  const F0 = makeFloor(0), F1 = makeFloor(1);

  /* ================= FLOOR 1 (index 0) ================= */
  F0.carve(1, 1, 10, 9, 'carpet2', 'IT Office');
  F0.carve(12, 1, 32, 9, 'carpet', 'Sales Floor');
  F0.carve(34, 1, 44, 9, 'tile', 'Break Room');
  F0.carve(1, 11, 44, 13, 'hall', 'Floor 1 Hallway');
  F0.carve(1, 15, 12, 24, 'lobby', 'Lobby');
  F0.carve(14, 15, 24, 24, 'wood', 'Fraser Room');
  F0.carve(26, 15, 35, 24, 'carpet', 'Customer Support');
  F0.carve(37, 15, 44, 24, 'hall', 'Stairs & Elevator');
  F0.carve(4, 14, 8, 14, 'lobby'); F0.carve(39, 14, 42, 14, 'hall');
  [[6, 10], [17, 10], [18, 10], [27, 10], [28, 10], [38, 10], [39, 10], [15, 14], [30, 14]].forEach(([x, y]) => F0.door(x, y));
  F0.carve(43, 15, 44, 17, 'stairs'); F0.decal('stairs', 43, 15, 2, 3, { up: true });

  /* IT office */
  F0.add('desk', 1, 1, { v: 3, act: 'itpc', label: 'your desk' }); F0.add('chair', 1, 2);
  F0.add('shelf', 4, 1, { act: 'parts', label: 'IT storage' });
  F0.add('plant', 10, 1, { v: 1 });
  F0.add('bench', 1, 7, { act: 'bench', label: 'workbench' });
  F0.add('box', 10, 9); F0.add('box', 9, 9); F0.add('cabinet', 10, 6);
  F0.decal('rug', 4, 4, 4, 3, { c: '#35615f' });
  F0.wall('window', 1, 0, { w: 2 }); F0.wall('poster', 3, 0, { c: '#6fe3a1' }); F0.wall('window', 7, 0, { w: 2 }); F0.wall('clock', 9, 0);
  F0.decal('light', 1, 1, 2, 2); F0.decal('light', 7, 1, 2, 2);

  /* sales floor */
  for (let x = 13; x <= 30; x++) F0.add('part', x, 5, { v: x % 6 === 3 ? 1 : 0 });
  [16, 21, 26].forEach((x) => { F0.add('part', x, 1); F0.add('part', x, 2); F0.add('part', x, 6); F0.add('part', x, 7); });
  F0.add('printer', 31, 1, { act: 'printer1', label: 'Sales printer' });
  F0.add('plant', 12, 1, { v: 1 }); F0.add('plant', 12, 9); F0.add('bin', 32, 9); F0.add('easel', 32, 4, { act: 'tips', label: 'sales board' });
  [14, 19, 24, 29].forEach((x) => { F0.wall('window', x, 0, { w: 2 }); F0.decal('light', x, 1, 2, 2); });

  /* break room */
  F0.add('counter', 34, 1, { v: 2 }); F0.add('counter', 35, 1, { v: 0 }); F0.add('counter', 36, 1, { v: 1, act: 'coffee', label: 'coffee machine', steam: 1 });
  F0.add('counter', 37, 1, { v: 5 }); F0.add('counter', 38, 1, { v: 3 }); F0.add('counter', 39, 1, { v: 4, act: 'fruit', label: 'fruit bowl' });
  F0.add('fridge', 40, 1, { act: 'fridge', label: 'fridge' }); F0.add('snack', 42, 1, { act: 'snack', label: 'snack shelf' }); F0.add('plant', 44, 1);
  F0.add('tableS', 36, 5, { act: 'pizza', label: 'lunch table', pizza: 1 }); F0.add('stool', 36, 4); F0.add('stool', 37, 6); F0.add('stool', 35, 5); F0.add('stool', 38, 5);
  F0.add('tableS', 41, 6, { v: 2 }); F0.add('stool', 40, 6); F0.add('stool', 43, 6); F0.add('stool', 41, 7);
  F0.add('cooler', 34, 8, { act: 'cooler', label: 'water cooler' }); F0.add('plant', 44, 9, { v: 1 }); F0.add('bin', 34, 4);
  F0.wall('poster', 41, 0, { c: '#ffb23e' }); F0.wall('vent', 44, 0);

  /* hallway */
  F0.wall('board', 2, 10, { w: 2, act: 'tips', label: 'IT whiteboard' }); F0.wall('sign', 4, 10, { w: 2, s: 'IT' });
  F0.wall('sign', 15, 10, { w: 2, s: 'SALES' }); F0.wall('cork', 21, 10, { w: 2, act: 'cork', label: 'notice board' }); F0.wall('sign', 25, 10, { w: 2, s: 'SALES' });
  F0.wall('ext', 31, 10); F0.wall('sign', 36, 10, { w: 2, s: 'BREAK' }); F0.wall('clock', 42, 10); F0.wall('ap', 10, 10);
  F0.add('plant', 1, 11); F0.add('cooler', 22, 11, { act: 'cooler', label: 'water cooler' }); F0.add('bin', 23, 11); F0.add('plant', 44, 11, { v: 1 }); F0.add('plant', 33, 11);

  /* lobby */
  F0.add('couch', 10, 16, { v: 0 }); F0.add('ctable', 10, 18); F0.add('plant', 1, 15); F0.add('plant', 12, 15, { v: 1 }); F0.add('plant', 1, 24, { v: 1 }); F0.add('plant', 12, 24);
  F0.add('couch', 9, 22, { v: 2 });
  F0.decal('rug', 3, 20, 5, 3, { c: '#2f8f8a' }); F0.decal('mat', 5, 23, 3, 2);
  F0.wall('logo', 9, 14, { w: 4 }); F0.wall('frame', 2, 14); F0.wall('glassdoor', 5, 25, { w: 3 });

  /* Fraser meeting room */
  F0.add('tableL', 17, 18, { v: 6 | (2 << 4) });
  [18, 20, 22].forEach((x) => { F0.add('chairFD', x, 17); F0.add('chairD', x, 20); });
  F0.add('plant', 24, 15); F0.add('plant', 14, 24, { v: 1 }); F0.add('cabinet', 24, 24);
  F0.wall('tv', 18, 14, { w: 3, act: 'meeting', label: 'meeting room TV' }); F0.wall('board', 22, 14, { w: 2, act: 'tips', label: 'whiteboard' }); F0.wall('sign', 16, 14, { w: 2, s: 'FRASER' });
  F0.decal('rug', 16, 17, 8, 5, { c: '#7a4a2c' });

  /* customer support */
  [27, 28, 29].forEach((x) => F0.add('part', x, 19));
  F0.add('cabinet', 33, 15); F0.add('cabinet', 34, 15); F0.add('plant', 35, 15, { v: 1 }); F0.add('bean', 34, 23, { v: 2 }); F0.add('bean', 32, 23, { v: 0 }); F0.add('plant', 26, 24);
  F0.wall('poster', 29, 14, { c: '#b565d8' }); F0.wall('clock', 33, 14); F0.wall('sign', 34, 14, { w: 2, s: 'HELP' });
  F0.decal('rug', 31, 19, 4, 3, { c: '#46557a' });

  /* stairs hall */
  F0.wall('elevator', 37, 14, { w: 2, act: 'elevator', label: 'elevator' }); F0.wall('sign', 43, 14, { w: 2, s: 'UP', c: '#1f4d3c' });
  F0.decal('mat', 37, 15, 2, 1); F0.add('plant', 37, 24); F0.add('plant', 44, 24, { v: 1 }); F0.add('couch', 40, 23, { v: 3 });

  F0.spots = [[36, 2], [35, 2], [38, 2], [42, 2], [35, 7], [38, 6], [31, 2], [22, 12], [9, 19], [40, 20], [39, 4], [14, 12]];
  F0.stairsArrive = [43, 18]; F0.elevArrive = [38, 15];

  /* ================= FLOOR 2 (index 1) ================= */
  F1.carve(1, 1, 8, 9, 'server', 'Server Room');
  F1.carve(10, 1, 20, 9, 'carpet', 'Finance');
  F1.carve(22, 1, 32, 9, 'carpet3', 'Marketing');
  F1.carve(34, 1, 44, 9, 'carpet2', 'Human Resources');
  F1.carve(1, 11, 44, 13, 'hall', 'Floor 2 Hallway');
  F1.carve(1, 15, 12, 24, 'exec', 'CEO Office');
  F1.carve(14, 15, 23, 24, 'wood', 'CFO Office');
  F1.carve(25, 15, 35, 24, 'wood', 'Coast Boardroom');
  F1.carve(37, 15, 44, 24, 'hall', 'Stairs & Elevator');
  F1.carve(39, 14, 42, 14, 'hall');
  [[5, 10], [15, 10], [27, 10], [39, 10], [7, 14], [19, 14], [27, 14]].forEach(([x, y]) => F1.door(x, y));
  F1.carve(43, 15, 44, 17, 'stairs'); F1.decal('stairs', 43, 15, 2, 3, { up: false });

  /* server room */
  F1.add('rack', 2, 1, { v: 1, act: 'server', label: 'server rack', leds: 1 }); F1.add('rack', 3, 1, { v: 0, act: 'server', label: 'network rack', leds: 1 }); F1.add('rack', 4, 1, { v: 2, act: 'server', label: 'storage + UPS rack', leds: 1 });
  F1.add('acu', 8, 1); F1.add('cart', 6, 5, { act: 'server', label: 'server console' }); F1.add('box', 1, 9); F1.add('box', 8, 9);
  F1.decal('cables', 2, 2, 3, 1); F1.wall('vent', 6, 0); F1.wall('vent', 1, 0);
  F1.add('door', 5, 10, { act: 'srvdoor', label: 'server room door', lock: 1 });
  F1.wall('keypad', 4, 10); F1.wall('sign', 6, 10, { w: 2, s: 'SERVER', c: '#7a2a2a' });

  /* finance */
  F1.add('cabinet', 19, 1); F1.add('cabinet', 20, 1); F1.add('plant', 10, 9); F1.add('box', 20, 9); F1.add('plant', 10, 1, { v: 1 }); F1.add('bookshelf', 18, 6);
  F1.wall('window', 13, 0, { w: 2 }); F1.wall('window', 17, 0, { w: 2 }); F1.decal('light', 13, 1, 2, 2); F1.decal('light', 17, 1, 2, 2);
  F1.decal('rug', 12, 5, 5, 3, { c: '#46557a' });

  /* marketing */
  F1.add('easel', 32, 3, { act: 'tips', label: 'mood board' }); F1.add('bean', 31, 7, { v: 0 }); F1.add('bean', 30, 8, { v: 1 }); F1.add('tableS', 25, 6, { v: 2 }); F1.add('stool', 24, 6); F1.add('stool', 27, 6);
  F1.add('plant', 22, 9, { v: 1 }); F1.add('plant', 22, 1);
  F1.wall('board', 25, 0, { w: 3 }); F1.wall('poster', 31, 0, { c: '#e56b9f' }); F1.wall('poster', 32, 0, { c: '#2fb5a8' }); F1.wall('window', 30, 0);

  /* HR */
  F1.add('couch', 42, 6, { v: 3 }); F1.add('ctable', 42, 8); F1.add('plant', 44, 1); F1.add('cabinet', 38, 1); F1.add('plant', 34, 9, { v: 1 });
  F1.wall('window', 37, 0); F1.wall('window', 43, 0); F1.wall('frame', 34, 0, { c: '#ffd9a8' }); F1.decal('rug', 41, 5, 4, 4, { c: '#6b4a86' });

  /* hallway */
  F1.add('printer', 23, 11, { act: 'printer2', label: 'Floor 2 printer' }); F1.add('cooler', 32, 11, { act: 'cooler', label: 'water cooler' }); F1.add('plant', 44, 11); F1.add('plant', 1, 11, { v: 1 }); F1.add('bin', 25, 11);
  F1.wall('ext', 9, 10); F1.wall('sign', 12, 10, { w: 2, s: 'FINANCE' }); F1.wall('ap', 20, 10); F1.wall('sign', 29, 10, { w: 2, s: 'MKTG' }); F1.wall('sign', 37, 10, { s: 'HR' }); F1.wall('cork', 41, 10, { w: 2, act: 'cork', label: 'notice board' });

  /* CEO */
  F1.add('bookshelf', 1, 15); F1.add('bookshelf', 10, 15); F1.add('plant', 12, 15); F1.add('couch', 9, 22, { v: 1 }); F1.add('ctable', 11, 22); F1.add('plant', 1, 24, { v: 1 }); F1.add('cabinet', 12, 20);
  F1.decal('rug', 3, 20, 7, 3, { c: '#7a3b3b' }); F1.wall('frame', 4, 14); F1.wall('frame', 9, 14, { c: '#ffd9a8' }); F1.wall('sign', 5, 14, { w: 2, s: 'CEO', c: '#1f4d3c' });

  /* CFO */
  F1.add('bookshelf', 17, 15); F1.add('cabinet', 22, 15); F1.add('cabinet', 23, 15); F1.add('plant', 14, 24); F1.add('couch', 20, 21, { v: 2 }); F1.add('plant', 14, 15, { v: 1 });
  F1.wall('frame', 20, 14); F1.wall('clock', 21, 14); F1.decal('rug', 15, 18, 5, 3, { c: '#2f4d6b' });

  /* boardroom */
  F1.add('tableL', 27, 19, { v: 7 | (2 << 4) });
  [28, 30, 32].forEach((x) => { F1.add('chairFD', x, 18); F1.add('chairD', x, 21); });
  F1.add('plant', 35, 15); F1.add('plant', 25, 24, { v: 1 }); F1.add('plant', 35, 24);
  F1.wall('tv', 30, 14, { w: 3, act: 'boardtv', label: 'boardroom TV' }); F1.wall('jack', 34, 14); F1.wall('jack', 33, 14); F1.wall('sign', 28, 14, { w: 2, s: 'COAST' });
  F1.decal('rug', 26, 18, 9, 5, { c: '#2f4d6b' });

  /* stairs hall */
  F1.wall('elevator', 37, 14, { w: 2, act: 'elevator', label: 'elevator' }); F1.wall('sign', 43, 14, { w: 2, s: 'DOWN', c: '#1f4d3c' });
  F1.decal('mat', 37, 15, 2, 1); F1.add('counter', 37, 20, { v: 1, act: 'coffee', label: 'coffee machine', steam: 1 }); F1.add('counter', 37, 21, { v: 4, act: 'fruit', label: 'fruit bowl' });
  F1.add('plant', 37, 24); F1.add('plant', 44, 24, { v: 1 }); F1.add('couch', 40, 23, { v: 0 });

  F1.spots = [[38, 20], [38, 21], [32, 12], [23, 12], [40, 19], [26, 7], [36, 12], [12, 12]];
  F1.stairsArrive = [43, 18]; F1.elevArrive = [38, 15];

  /* desks come from the employee list so there is one source of truth */
  const floors = [F0, F1];
  const seats = {};
  DATA.EMP.forEach((e, i) => {
    const F = floors[e.f], [x, y] = e.desk;
    if (e.kind === 'front') {
      F.add('deskF', x, y, { v: e.id === 'helen' ? 1 : 0, owner: e.id, act: 'pc', label: e.name.split(' ')[0] + "'s PC" });
      F.add('chairF', x + 1, y - 1, { seat: e.id });
      seats[e.id] = { f: e.f, x: x + 1, y: y - 1, dir: 0, vx: x + 1, vy: y + 1 };
    } else {
      F.add('desk', x, y, { v: i, owner: e.id, act: 'pc', label: e.name.split(' ')[0] + "'s PC" });
      F.add('chair', x, y + 1, { seat: e.id });
      seats[e.id] = { f: e.f, x, y: y + 1, dir: 3, vx: x + 1, vy: y + 1 };
    }
  });

  /* collision grids */
  floors.forEach((F) => {
    F.solid = new Uint8Array(W * H); F.npcSolid = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) if (F.t[i] === '#') { F.solid[i] = 1; F.npcSolid[i] = 1; }
    for (const f of F.furn) if (f.solid) for (let dy = 0; dy < f.fh; dy++) for (let dx = 0; dx < f.fw; dx++) {
      const k = (f.y + dy) * W + f.x + dx; F.solid[k] = 1; if (f.seat === undefined) F.npcSolid[k] = 1;
    }
    for (let i = 0; i < W * H; i++) if (F.t[i] === 'stairs') F.npcSolid[i] = 1;
  });

  const stations = {
    printer1: { f: 0, x: 31, y: 2, name: 'the Sales printer' },
    printer2: { f: 1, x: 23, y: 12, name: 'the Floor 2 printer' },
    meeting: { f: 0, x: 19, y: 15, name: 'the Fraser Room TV' },
    server: { f: 1, x: 3, y: 2, name: 'the server room' },
    parts: { f: 0, x: 4, y: 2, name: 'the IT storage shelf' },
    itpc: { f: 0, x: 2, y: 2, name: 'your desk' },
  };
  const roomAt = (f, x, y) => { for (const r of floors[f].rooms) if (x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1) return r.name; return ''; };

  return { W, H, floors, seats, stations, roomAt };
})();
