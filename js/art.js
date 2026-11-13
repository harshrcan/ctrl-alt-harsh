/* Ctrl+Alt+Harsh: all pixel art is drawn in code. No image files. */
window.ART = (() => {
  const TS = 16;
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x | 0, y | 0, w, h); };
  const clamp = (v) => Math.max(0, Math.min(255, v | 0));
  function shade(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    const r = clamp((n >> 16) + a), gg = clamp(((n >> 8) & 255) + a), b = clamp((n & 255) + a);
    return '#' + ((1 << 24) | (r << 16) | (gg << 8) | b).toString(16).slice(1);
  }
  const hash = (x, y) => { let h = (x * 374761393 + y * 668265263) ^ 0x5bd1e995; h = (h ^ (h >> 13)) * 1274126177; return ((h ^ (h >> 16)) >>> 0) / 4294967296; };

  /* dark 1px outline around a sprite so it pops off the floor */
  function outlined(w, h, fn, col) {
    const c = mk(w + 2, h + 2), g = c.getContext('2d');
    g.translate(1, 1); fn(g); g.setTransform(1, 0, 0, 1, 0, 0);
    const im = g.getImageData(0, 0, w + 2, h + 2), d = im.data, W = w + 2, H = h + 2;
    const solid = (x, y) => x >= 0 && y >= 0 && x < W && y < H && d[(y * W + x) * 4 + 3] > 200;
    const out = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (d[(y * W + x) * 4 + 3] > 20) continue;
      if (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1)) out.push(x, y);
    }
    g.fillStyle = col || '#15161f';
    for (let i = 0; i < out.length; i += 2) g.fillRect(out[i], out[i + 1], 1, 1);
    c.lw = w; c.lh = h;
    return c;
  }

  /* ---------- 3x5 pixel font ---------- */
  const GL = {
    A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111', F: '111100110100100',
    G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111',
    M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100', Q: '010101101111011', R: '110101110101101',
    S: '011100010001110', T: '111010010010010', U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101',
    Y: '101101010010010', Z: '111001010100111', 0: '111101101101111', 1: '010110010010111', 2: '110001010100111', 3: '110001010001110',
    4: '101101111001001', 5: '111100110001110', 6: '011100110101010', 7: '111001010010010', 8: '010101010101010', 9: '010101011001110',
    '!': '010010010000010', '?': '110001010000010', '.': '000000000000010', '-': '000000111000000', ':': '000010000010000', '+': '000010111010000', '/': '001001010100100',
  };
  function ptext(g, s, x, y, c) {
    g.fillStyle = c; s = String(s).toUpperCase();
    for (let i = 0; i < s.length; i++) {
      const b = GL[s[i]];
      if (b) for (let k = 0; k < 15; k++) if (b[k] === '1') g.fillRect(x + i * 4 + (k % 3), y + ((k / 3) | 0), 1, 1);
    }
    return s.length * 4 - 1;
  }

  /* ---------- characters ---------- */
  function drawChar(g, L, dir, f) {
    const sk = L.skin, skd = shade(sk, -30), hr = L.hair, hrl = shade(hr, 34), sh = L.shirt, shd = shade(sh, -30);
    const pt = L.pants, ptd = shade(pt, -22), so = L.shoes || '#1b1c24', dk = '#1b1b24', w = L.wrap || '#888';
    const bob = (f === 1 || f === 3) ? 1 : 0;
    const side = dir === 1 || dir === 2, front = dir === 0, back = dir === 3;
    g.save(); g.translate(0, 2);
    /* legs */
    if (side) {
      const s = f === 1 ? 2 : f === 3 ? -2 : 0;
      R(g, 7 - s, 15, 3, 5, ptd); R(g, 6 - s, 20, 4, 2, shade(so, -20));
      R(g, 6 + s, 15, 3, 5, pt); R(g, 5 + s, 20, 4, 2, so);
    } else {
      const l = f === 1 ? 1 : 0, r = f === 3 ? 1 : 0;
      R(g, 5, 15, 3, 5 - l, pt); R(g, 8, 15, 3, 5 - r, pt);
      R(g, 5, 20 - l, 3, 2, so); R(g, 8, 20 - r, 3, 2, so);
      R(g, 7, 15, 2, 1, ptd);
    }
    const y = bob;
    /* body */
    if (side) {
      R(g, 5, y + 9, 6, 7, sh); R(g, 5, y + 14, 6, 2, shd);
      if (L.pack) { R(g, 10, y + 9, 3, 6, '#9a98ad'); R(g, 12, y + 10, 1, 4, '#7d7b90'); }
      const a = f === 1 ? 1 : f === 3 ? -1 : 0;
      R(g, 7 + a, y + 10, 2, 4, shd); R(g, 7 + a, y + 14, 2, 1, sk);
    } else {
      R(g, 4, y + 9, 8, 7, sh); R(g, 4, y + 14, 8, 2, shd);
      const al = f === 1 ? 1 : 0, ar = f === 3 ? 1 : 0;
      R(g, 3, y + 9 + al, 1, 4, sh); R(g, 12, y + 9 + ar, 1, 4, sh);
      R(g, 3, y + 13 + al, 1, 2, sk); R(g, 12, y + 13 + ar, 1, 2, sk);
      if (front) {
        R(g, 6, y + 9, 4, 1, skd);
        if (L.tie) R(g, 7, y + 9, 2, 5, L.tie);
        if (L.lan) { R(g, 6, y + 9, 1, 3, '#e8e8f0'); R(g, 9, y + 9, 1, 3, '#e8e8f0'); R(g, 7, y + 12, 2, 2, '#ffffff'); }
        if (L.pack) { R(g, 5, y + 9, 1, 6, '#b4b2c3'); R(g, 10, y + 9, 1, 6, '#b4b2c3'); }
      }
      if (back && L.pack) { R(g, 5, y + 9, 6, 6, '#9a98ad'); R(g, 5, y + 9, 6, 1, '#b4b2c3'); R(g, 6, y + 12, 4, 2, '#7d7b90'); }
    }
    /* head */
    const st = L.style;
    if (front) {
      R(g, 4, y + 2, 8, 7, sk); R(g, 3, y + 5, 1, 2, sk); R(g, 12, y + 5, 1, 2, sk);
      R(g, 6, y + 5, 1, 2, dk); R(g, 9, y + 5, 1, 2, dk); R(g, 7, y + 7, 2, 1, shade(sk, -50));
      if (L.stubble) { R(g, 5, y + 8, 6, 1, skd); R(g, 4, y + 7, 1, 1, skd); R(g, 11, y + 7, 1, 1, skd); }
      if (L.beard) { R(g, 4, y + 7, 8, 2, hr); R(g, 5, y + 9, 6, 1, hr); R(g, 7, y + 7, 2, 1, shade(sk, -50)); }
      if (L.glasses) { R(g, 4, y + 4, 8, 1, dk); R(g, 5, y + 5, 1, 2, '#cfe2ff'); R(g, 10, y + 5, 1, 2, '#cfe2ff'); R(g, 7, y + 5, 2, 1, dk); R(g, 4, y + 5, 1, 1, dk); R(g, 11, y + 5, 1, 1, dk); }
      if (st === 'short' || st === 'long' || st === 'bun' || st === 'pony') { R(g, 4, y + 1, 8, 2, hr); R(g, 5, y, 6, 1, hr); R(g, 3, y + 2, 1, 3, hr); R(g, 12, y + 2, 1, 3, hr); R(g, 6, y + 1, 2, 1, hrl); }
      if (st === 'long') { R(g, 3, y + 2, 1, 9, hr); R(g, 12, y + 2, 1, 9, hr); R(g, 3, y + 9, 2, 3, hr); R(g, 11, y + 9, 2, 3, hr); }
      if (st === 'bun') R(g, 6, y - 2, 4, 2, hr);
      if (st === 'big') { R(g, 3, y - 1, 10, 4, hr); R(g, 4, y - 2, 8, 1, hr); R(g, 3, y + 3, 1, 2, hr); R(g, 12, y + 3, 1, 2, hr); R(g, 5, y - 1, 2, 1, hrl); R(g, 9, y, 2, 1, hrl); R(g, 4, y + 3, 2, 1, hr); }
      if (st === 'bald') { R(g, 3, y + 4, 1, 2, hr); R(g, 12, y + 4, 1, 2, hr); R(g, 6, y + 2, 3, 1, shade(sk, 22)); }
      if (st === 'turban') { R(g, 3, y - 1, 10, 4, w); R(g, 4, y - 2, 8, 1, w); R(g, 4, y + 1, 4, 1, shade(w, 30)); R(g, 8, y - 1, 1, 3, shade(w, -30)); }
      if (st === 'hijab') { R(g, 3, y, 10, 3, w); R(g, 4, y - 1, 8, 1, w); R(g, 3, y + 3, 1, 6, w); R(g, 12, y + 3, 1, 6, w); R(g, 3, y + 9, 10, 2, w); R(g, 5, y, 3, 1, shade(w, 25)); }
    } else if (back) {
      if (st === 'bald') { R(g, 4, y + 2, 8, 7, sk); R(g, 4, y + 6, 8, 2, hr); }
      else if (st === 'hijab') { R(g, 3, y, 10, 11, w); R(g, 4, y - 1, 8, 1, w); R(g, 5, y + 2, 1, 6, shade(w, -20)); }
      else if (st === 'turban') { R(g, 4, y + 5, 8, 4, sk); R(g, 3, y - 1, 10, 7, w); R(g, 4, y - 2, 8, 1, w); R(g, 7, y, 1, 5, shade(w, -30)); }
      else {
        R(g, 4, y + 6, 8, 3, sk); R(g, 3, y + 5, 1, 2, sk); R(g, 12, y + 5, 1, 2, sk);
        if (st === 'big') { R(g, 3, y - 1, 10, 8, hr); R(g, 4, y - 2, 8, 1, hr); R(g, 5, y, 2, 1, hrl); R(g, 9, y + 2, 2, 1, hrl); }
        else { R(g, 4, y + 1, 8, 6, hr); R(g, 5, y, 6, 1, hr); R(g, 3, y + 2, 1, 4, hr); R(g, 12, y + 2, 1, 4, hr); }
        if (st === 'long') R(g, 3, y + 2, 10, 10, hr);
        if (st === 'bun') R(g, 6, y - 2, 4, 3, hr);
        if (st === 'pony') R(g, 7, y + 5, 2, 7, hr);
      }
    } else {
      /* facing left; right is mirrored */
      R(g, 4, y + 2, 7, 7, sk); R(g, 3, y + 6, 1, 1, sk);
      R(g, 5, y + 5, 1, 2, dk);
      if (L.stubble) R(g, 4, y + 8, 5, 1, skd);
      if (L.beard) R(g, 4, y + 7, 5, 3, hr);
      if (L.glasses) { R(g, 4, y + 4, 5, 1, dk); R(g, 4, y + 5, 1, 2, '#cfe2ff'); }
      if (st === 'short' || st === 'long' || st === 'bun' || st === 'pony') { R(g, 4, y + 1, 8, 2, hr); R(g, 5, y, 6, 1, hr); R(g, 9, y + 2, 3, 5, hr); }
      if (st === 'long') R(g, 9, y + 2, 4, 10, hr);
      if (st === 'bun') R(g, 11, y, 3, 3, hr);
      if (st === 'pony') R(g, 12, y + 3, 2, 6, hr);
      if (st === 'big') { R(g, 3, y - 1, 10, 4, hr); R(g, 4, y - 2, 8, 1, hr); R(g, 10, y + 3, 3, 3, hr); R(g, 5, y - 1, 2, 1, hrl); }
      if (st === 'bald') R(g, 9, y + 5, 2, 2, hr);
      if (st === 'turban') { R(g, 3, y - 1, 10, 4, w); R(g, 4, y - 2, 8, 1, w); R(g, 9, y + 3, 3, 2, w); R(g, 6, y - 1, 1, 3, shade(w, -30)); }
      if (st === 'hijab') { R(g, 4, y - 1, 9, 4, w); R(g, 8, y + 3, 5, 8, w); R(g, 4, y + 9, 6, 2, w); }
    }
    g.restore();
  }

  function charSheet(L) {
    const sheet = { f: [[], [], [], []] };
    for (let d = 0; d < 4; d++) for (let f = 0; f < 4; f++) {
      const src = d === 2 ? 1 : d;
      let c = outlined(16, 24, (g) => drawChar(g, L, src, f));
      if (d === 2) { const m = mk(c.width, c.height), mg = m.getContext('2d'); mg.translate(c.width, 0); mg.scale(-1, 1); mg.drawImage(c, 0, 0); m.lw = 16; m.lh = 24; c = m; }
      sheet.f[d].push(c);
    }
    return sheet;
  }

  /* ---------- furniture sprites ---------- */
  const cache = {};
  const S = {};
  const box = (g, x, y, w, topH, frontH, top, front) => {
    R(g, x, y, w, topH, top); R(g, x, y, w, 1, shade(top, 26));
    R(g, x, y + topH, w, frontH, front); R(g, x, y + topH, w, 1, shade(front, -24)); R(g, x, y + topH + frontH - 1, w, 1, shade(front, -34));
  };

  S.desk = (v) => outlined(32, 30, (g) => {
    const top = ['#dcc7a4', '#e6e0d2', '#cfb692', '#e6e0d2'][v % 4], fr = shade(top, -52);
    R(g, 9, 0, 14, 10, '#232530'); R(g, 10, 1, 12, 7, '#0b0d14'); R(g, 14, 10, 4, 2, '#30323f'); R(g, 12, 12, 8, 1, '#30323f');
    box(g, 0, 12, 32, 10, 8, top, fr);
    R(g, 1, 24, 9, 5, shade(fr, 14)); R(g, 22, 24, 9, 5, shade(fr, 14)); R(g, 4, 26, 3, 1, '#20212a'); R(g, 25, 26, 3, 1, '#20212a');
    R(g, 11, 24, 10, 6, shade(fr, -40));
    R(g, 10, 15, 11, 3, '#ececf2'); R(g, 10, 17, 11, 1, '#b4b6c4'); R(g, 23, 16, 2, 3, '#ececf2');
    if (v % 2 === 0) { R(g, 3, 14, 3, 4, '#d0563e'); R(g, 6, 15, 1, 2, '#d0563e'); R(g, 3, 14, 3, 1, '#3a2014'); }
    else { R(g, 26, 14, 4, 5, '#ffffff'); R(g, 27, 15, 2, 1, '#9aa8c0'); R(g, 27, 17, 2, 1, '#9aa8c0'); }
    if (v % 3 === 1) { R(g, 2, 14, 4, 4, '#f6e564'); R(g, 3, 15, 2, 1, '#b9a93a'); }
    if (v % 5 === 2) { R(g, 27, 10, 4, 3, '#3f9a55'); R(g, 28, 9, 2, 1, '#57b86d'); R(g, 28, 13, 2, 2, '#b06a3c'); }
    if (v % 5 === 4) { R(g, 2, 13, 5, 5, '#5b6ee1'); R(g, 3, 14, 3, 3, '#aab4ff'); }
  });
  S.deskF = (v) => outlined(48, 27, (g) => {
    const exec = v === 1, top = exec ? '#7a4a2c' : '#eef0f3', fr = exec ? '#56331d' : '#2f8f8a';
    R(g, 19, 0, 10, 7, '#2a2c38'); R(g, 20, 1, 8, 5, '#3c3f52'); R(g, 23, 7, 2, 2, '#2a2c38');
    box(g, 0, 8, 48, 8, 11, top, fr);
    R(g, 2, 18, 44, 7, shade(fr, 12)); R(g, 16, 18, 1, 7, shade(fr, -20)); R(g, 31, 18, 1, 7, shade(fr, -20));
    if (!exec) { ptext(g, 'CEDARLINE', 7, 19, '#eaf7f5'); R(g, 3, 10, 5, 4, '#ffffff'); R(g, 38, 10, 6, 4, '#f6e564'); }
    else { R(g, 4, 10, 6, 4, '#e9e2cf'); R(g, 36, 9, 3, 5, '#c9a45a'); R(g, 40, 11, 5, 3, '#20222c'); }
  });
  S.chair = () => outlined(12, 15, (g) => {
    R(g, 1, 0, 10, 9, '#3d4460'); R(g, 2, 1, 8, 2, '#566089'); R(g, 0, 8, 12, 3, '#2c3148'); R(g, 5, 11, 2, 3, '#22242e'); R(g, 2, 14, 8, 1, '#22242e');
  });
  S.chairF = () => outlined(12, 17, (g) => {
    R(g, 1, 0, 10, 12, '#3d4460'); R(g, 2, 1, 8, 2, '#566089'); R(g, 0, 10, 12, 3, '#2c3148'); R(g, 5, 13, 2, 3, '#22242e'); R(g, 2, 16, 8, 1, '#22242e');
  });
  S.part = (v) => outlined(16, 22, (g) => {
    box(g, 0, 0, 16, 5, 17, '#9fc0cc', '#6f93a3');
    for (let i = 0; i < 12; i++) R(g, 1 + ((i * 5) % 14), 7 + ((i * 7) % 13), 1, 1, '#83a6b5');
    R(g, 0, 20, 16, 2, '#4d6b7a');
    if (v === 1) { R(g, 4, 8, 8, 6, '#f6e564'); R(g, 5, 10, 5, 1, '#b9a93a'); }
  });
  S.plant = (v) => outlined(16, 28, (g) => {
    R(g, 5, 20, 6, 7, '#b5683c'); R(g, 4, 19, 8, 2, '#cf7d4b'); R(g, 5, 26, 6, 1, '#7f4424');
    const a = '#2f8a4c', b = '#49ad63', c = '#1f6a38';
    if (v % 2 === 0) { R(g, 3, 6, 10, 12, a); R(g, 5, 3, 6, 4, a); R(g, 1, 9, 3, 6, a); R(g, 12, 8, 3, 6, a); R(g, 5, 6, 3, 4, b); R(g, 9, 10, 3, 3, b); R(g, 4, 13, 2, 3, c); R(g, 10, 5, 2, 2, c); R(g, 7, 17, 2, 3, c); }
    else { R(g, 7, 6, 2, 14, c); R(g, 2, 2, 6, 5, a); R(g, 8, 0, 6, 6, a); R(g, 1, 9, 6, 4, a); R(g, 9, 8, 6, 5, a); R(g, 3, 3, 3, 2, b); R(g, 10, 2, 3, 2, b); R(g, 10, 10, 3, 2, b); R(g, 3, 14, 4, 3, a); }
  });
  S.printer = () => outlined(30, 28, (g) => {
    R(g, 2, 3, 26, 5, '#cfd4dc'); R(g, 2, 3, 26, 1, '#f4f6f9');
    R(g, 1, 8, 28, 13, '#e6e9ee'); R(g, 1, 8, 28, 1, '#ffffff'); R(g, 1, 20, 28, 1, '#a9afbb');
    R(g, 18, 10, 9, 5, '#262936'); R(g, 19, 11, 4, 2, '#5fd0e0');
    R(g, 4, 12, 12, 3, '#262936'); R(g, 5, 11, 10, 2, '#ffffff');
    R(g, 3, 21, 24, 7, '#bcc2cd'); R(g, 4, 22, 22, 2, '#9aa1ae'); R(g, 4, 25, 22, 2, '#9aa1ae'); R(g, 13, 23, 4, 1, '#e6e9ee');
  });
  const counterBase = (g) => { box(g, 0, 12, 16, 6, 12, '#ece7da', '#70809a'); R(g, 1, 20, 6, 9, '#8292ac'); R(g, 9, 20, 6, 9, '#8292ac'); R(g, 6, 23, 1, 3, '#dfe4ee'); R(g, 9, 23, 1, 3, '#dfe4ee'); };
  S.counter = (v) => outlined(16, 30, (g) => {
    counterBase(g);
    if (v === 1) { R(g, 3, 0, 10, 13, '#2a2c38'); R(g, 4, 1, 8, 3, '#a4adc0'); R(g, 5, 2, 2, 1, '#ff5d5d'); R(g, 7, 6, 2, 3, '#6a7085'); R(g, 6, 10, 4, 3, '#ffffff'); R(g, 10, 11, 1, 1, '#ffffff'); }
    if (v === 2) { R(g, 3, 13, 10, 4, '#b3bccb'); R(g, 4, 14, 8, 2, '#8d97a8'); R(g, 7, 7, 2, 6, '#d3d9e4'); R(g, 7, 7, 5, 2, '#d3d9e4'); }
    if (v === 3) { R(g, 1, 3, 14, 10, '#dadde5'); R(g, 2, 4, 9, 8, '#262936'); R(g, 3, 5, 7, 6, '#3a4c66'); R(g, 12, 5, 2, 1, '#6fe3a1'); R(g, 12, 7, 2, 4, '#9aa1ae'); }
    if (v === 4) { R(g, 3, 9, 10, 4, '#c98b4a'); R(g, 4, 7, 3, 3, '#e04b3a'); R(g, 7, 6, 3, 4, '#f2c230'); R(g, 10, 8, 2, 2, '#6cbf4b'); }
    if (v === 5) { R(g, 2, 8, 5, 5, '#ffffff'); R(g, 9, 9, 4, 4, '#ffffff'); R(g, 3, 6, 1, 2, '#c9cfdb'); R(g, 5, 6, 1, 2, '#c9cfdb'); }
  });
  S.fridge = () => outlined(16, 34, (g) => {
    R(g, 1, 0, 14, 34, '#e3e7ee'); R(g, 1, 0, 14, 1, '#ffffff'); R(g, 1, 12, 14, 1, '#a9b0bd'); R(g, 12, 3, 1, 7, '#8f97a6'); R(g, 12, 15, 1, 12, '#8f97a6'); R(g, 13, 0, 2, 34, '#cfd4dd'); R(g, 3, 4, 4, 4, '#f6e564'); R(g, 4, 17, 3, 3, '#ff8a80'); R(g, 1, 32, 14, 2, '#8f97a6');
  });
  S.snack = () => outlined(32, 34, (g) => {
    R(g, 0, 0, 32, 34, '#8a5a34'); R(g, 2, 2, 28, 30, '#5d3b20');
    const cols = ['#e04b3a', '#f2c230', '#4c86ff', '#6cbf4b', '#ff8a3d', '#b565d8', '#f2f2f2', '#2fb5a8'];
    for (let r = 0; r < 3; r++) { R(g, 2, 11 + r * 10, 28, 2, '#b07a48'); for (let i = 0; i < 6; i++) { const c = cols[(i + r * 3) % cols.length]; R(g, 3 + i * 4.6, 4 + r * 10, 4, 7, c); R(g, 3 + i * 4.6, 6 + r * 10, 4, 1, shade(c, 50)); } }
    R(g, 7, 0, 18, 7, '#ffb23e'); ptext(g, 'FREE', 9, 1, '#3a2010');
  });
  S.cooler = () => outlined(12, 26, (g) => {
    R(g, 3, 0, 6, 9, '#8fd0ff'); R(g, 4, 1, 1, 6, '#d6f0ff'); R(g, 3, 8, 6, 1, '#5aa6dd');
    R(g, 2, 9, 8, 16, '#eef1f6'); R(g, 2, 9, 8, 1, '#ffffff'); R(g, 3, 13, 2, 2, '#4c86ff'); R(g, 7, 13, 2, 2, '#ff5d5d'); R(g, 3, 17, 6, 3, '#c9cfdb'); R(g, 2, 24, 8, 1, '#9aa1ae');
  });
  S.tableS = (v) => outlined(32, 20, (g) => {
    const top = '#e9dcc4';
    R(g, 4, 2, 24, 1, top); R(g, 2, 3, 28, 8, top); R(g, 4, 11, 24, 1, top); R(g, 3, 3, 26, 1, shade(top, 22)); R(g, 2, 11, 28, 2, shade(top, -50)); R(g, 4, 12, 24, 1, shade(top, -50));
    R(g, 14, 13, 4, 5, '#5f6477'); R(g, 10, 18, 12, 2, '#5f6477');
    if (v === 1) { R(g, 9, 3, 14, 7, '#d8b98a'); R(g, 10, 4, 12, 5, '#f0d9a8'); R(g, 12, 5, 3, 3, '#d04a35'); R(g, 17, 5, 3, 3, '#d04a35'); }
    if (v === 2) { R(g, 6, 5, 3, 3, '#ffffff'); R(g, 20, 4, 5, 4, '#4c86ff'); }
  });
  S.stool = () => outlined(8, 10, (g) => { R(g, 0, 0, 8, 4, '#ffb23e'); R(g, 0, 0, 8, 1, '#ffd08a'); R(g, 1, 4, 1, 6, '#5f6477'); R(g, 6, 4, 1, 6, '#5f6477'); });
  S.tableL = (v) => { const w = (v & 15) * 16, h = (v >> 4) * 16; return outlined(w, h + 6, (g) => {
    const top = '#9c6b40';
    R(g, 0, 0, w, h - 2, top); R(g, 0, 0, w, 1, shade(top, 34)); R(g, 2, 2, w - 4, 1, shade(top, 14)); R(g, 0, h - 2, w, 8, shade(top, -46)); R(g, 0, h - 2, w, 1, shade(top, -66));
    for (let i = 0; i < w; i += 23) R(g, i + 5, 4, 9, 1, shade(top, -12));
    R(g, w / 2 - 5, h / 2 - 5, 10, 6, '#22242e'); R(g, w / 2 - 3, h / 2 - 4, 6, 2, '#6fe3a1');
    R(g, 8, h / 2 - 4, 7, 5, '#ffffff'); R(g, w - 18, 5, 8, 6, '#dfe4ee'); R(g, w - 17, 6, 6, 3, '#4c86ff');
  }); };
  S.couch = (v) => outlined(32, 22, (g) => {
    const c = ['#4c7fb8', '#b85c4c', '#5c9a6a', '#8a6fb8'][v % 4], d = shade(c, -34);
    R(g, 0, 0, 32, 11, d); R(g, 1, 1, 30, 2, shade(c, -10)); R(g, 3, 8, 26, 8, c); R(g, 3, 8, 26, 1, shade(c, 34)); R(g, 15, 9, 1, 7, d);
    R(g, 0, 6, 4, 13, d); R(g, 28, 6, 4, 13, d); R(g, 0, 6, 4, 1, c); R(g, 28, 6, 4, 1, c); R(g, 3, 16, 26, 4, shade(c, -52)); R(g, 2, 20, 2, 2, '#22242e'); R(g, 28, 20, 2, 2, '#22242e');
  });
  S.ctable = () => outlined(16, 12, (g) => { box(g, 0, 0, 16, 6, 3, '#a8784a', '#70482a'); R(g, 1, 9, 2, 3, '#4a2e1a'); R(g, 13, 9, 2, 3, '#4a2e1a'); R(g, 4, 1, 5, 4, '#f0f0f0'); R(g, 11, 2, 3, 3, '#d0563e'); });
  S.shelf = () => outlined(32, 34, (g) => {
    R(g, 0, 0, 32, 34, '#4a5066'); R(g, 2, 2, 28, 30, '#262936');
    for (let r = 0; r < 3; r++) R(g, 0, 11 + r * 10, 32, 2, '#6a7190');
    R(g, 3, 4, 8, 7, '#c9a46a'); R(g, 4, 6, 6, 2, '#ffffff'); R(g, 13, 5, 7, 6, '#3a6fd8'); R(g, 14, 6, 5, 4, '#1e3e88'); R(g, 15, 7, 3, 2, '#3a6fd8'); R(g, 22, 3, 7, 8, '#22242e'); R(g, 23, 5, 5, 2, '#5fd0e0');
    R(g, 3, 15, 12, 6, '#e6e9ee'); R(g, 4, 16, 10, 1, '#9aa1ae'); R(g, 17, 14, 6, 7, '#c9a46a'); R(g, 24, 16, 5, 5, '#6fe3a1'); R(g, 25, 17, 3, 1, '#1e6a44');
    R(g, 3, 25, 6, 6, '#ffb23e'); R(g, 11, 24, 9, 7, '#c9a46a'); R(g, 12, 26, 7, 2, '#ff5d5d'); R(g, 22, 26, 7, 5, '#8a8fa6'); R(g, 23, 27, 5, 1, '#cfd4dd');
  });
  S.bench = () => outlined(32, 28, (g) => {
    box(g, 0, 10, 32, 10, 3, '#c8ccd6', '#8a90a0'); R(g, 2, 11, 28, 8, '#3f78c9'); R(g, 2, 11, 28, 1, '#6aa0ea');
    R(g, 5, 4, 14, 12, '#2a2c38'); R(g, 6, 5, 12, 10, '#2f7d4a'); R(g, 7, 6, 4, 4, '#c9cfdb'); R(g, 12, 7, 5, 2, '#1e1f28'); R(g, 12, 10, 5, 1, '#f2c230'); R(g, 8, 12, 3, 2, '#1e1f28');
    R(g, 22, 13, 7, 1, '#ff5d5d'); R(g, 28, 13, 2, 1, '#c9cfdb'); R(g, 22, 16, 3, 2, '#22242e');
    R(g, 1, 23, 2, 5, '#5f6477'); R(g, 29, 23, 2, 5, '#5f6477'); R(g, 3, 23, 26, 1, '#5f6477');
  });
  S.bookshelf = () => outlined(32, 34, (g) => {
    R(g, 0, 0, 32, 34, '#6b4226'); R(g, 2, 2, 28, 30, '#3d2414');
    const cols = ['#d0563e', '#3a6fd8', '#f2c230', '#5c9a6a', '#8a6fb8', '#e6e9ee', '#2fb5a8'];
    for (let r = 0; r < 3; r++) { R(g, 2, 11 + r * 10, 28, 2, '#8a5a34'); let x = 3; let i = r * 2; while (x < 28) { const w = 2 + ((i * 7) % 3), h = 6 + ((i * 5) % 3); R(g, x, 11 + r * 10 - h, w, h, cols[i % cols.length]); x += w + ((i % 4 === 3) ? 2 : 0); i++; } }
  });
  S.cabinet = () => outlined(16, 26, (g) => {
    R(g, 1, 0, 14, 26, '#aab1bf'); R(g, 1, 0, 14, 2, '#d3d8e2');
    for (let i = 0; i < 3; i++) { R(g, 2, 3 + i * 8, 12, 6, '#8d95a5'); R(g, 6, 5 + i * 8, 4, 1, '#e6e9ee'); R(g, 2, 3 + i * 8, 12, 1, '#b7bdc9'); }
  });
  S.rack = (v) => outlined(16, 38, (g) => {
    R(g, 0, 0, 16, 38, '#191b24'); R(g, 0, 0, 16, 2, '#3a3e50'); R(g, 1, 36, 14, 2, '#0e0f15');
    for (let i = 0; i < 8; i++) {
      const y = 3 + i * 4;
      R(g, 2, y, 12, 3, v === 1 && i < 4 ? '#3a3f55' : '#2a2d3b');
      if (v === 1 && i < 4) for (let k = 0; k < 5; k++) R(g, 4 + k * 2, y + 1, 1, 1, '#11121a');
      else if (v === 2 && i > 4) { R(g, 3, y, 10, 3, '#40455a'); R(g, 10, y + 1, 2, 1, '#5fd0e0'); }
      else { R(g, 7, y + 1, 6, 1, '#1b1d27'); }
    }
  });
  S.cart = () => outlined(16, 24, (g) => {
    R(g, 2, 0, 12, 9, '#232530'); R(g, 3, 1, 10, 6, '#103a2a'); R(g, 4, 2, 5, 1, '#6fe3a1'); R(g, 4, 4, 7, 1, '#6fe3a1'); R(g, 7, 9, 2, 2, '#30323f');
    box(g, 0, 11, 16, 4, 2, '#c8ccd6', '#8a90a0'); R(g, 3, 12, 9, 2, '#ececf2'); R(g, 1, 17, 1, 6, '#5f6477'); R(g, 14, 17, 1, 6, '#5f6477'); R(g, 1, 20, 14, 1, '#5f6477'); R(g, 0, 23, 3, 1, '#22242e'); R(g, 13, 23, 3, 1, '#22242e');
  });
  S.acu = () => outlined(16, 32, (g) => {
    R(g, 0, 0, 16, 32, '#dfe3ea'); R(g, 0, 0, 16, 1, '#ffffff'); for (let i = 0; i < 6; i++) R(g, 2, 4 + i * 3, 12, 1, '#9aa1ae'); R(g, 2, 24, 12, 5, '#aab1bf'); R(g, 11, 25, 2, 1, '#6fe3a1'); R(g, 3, 25, 5, 1, '#5fd0e0'); R(g, 14, 0, 2, 32, '#c4c9d3');
  });
  S.door = () => outlined(16, 22, (g) => {
    R(g, 0, 0, 16, 22, '#56617d'); R(g, 0, 0, 16, 2, '#33384a'); R(g, 1, 3, 14, 19, '#6b7896'); R(g, 4, 5, 8, 7, '#a9d8ff'); R(g, 5, 6, 2, 5, '#dff1ff'); R(g, 12, 14, 2, 2, '#e9d28a'); R(g, 1, 20, 14, 2, '#4a5470');
  });
  S.bin = () => outlined(8, 10, (g) => { R(g, 0, 0, 8, 2, '#8a90a0'); R(g, 1, 2, 6, 8, '#6a7085'); R(g, 2, 3, 1, 6, '#8a90a0'); R(g, 5, 3, 1, 6, '#565b6e'); });
  S.bean = (v) => outlined(16, 13, (g) => { const c = ['#ff8a3d', '#b565d8', '#2fb5a8'][v % 3]; R(g, 2, 2, 12, 10, c); R(g, 0, 5, 16, 6, c); R(g, 4, 0, 8, 3, c); R(g, 4, 2, 6, 2, shade(c, 40)); R(g, 1, 10, 14, 2, shade(c, -40)); });
  S.pizza = () => outlined(14, 8, (g) => { R(g, 0, 0, 14, 8, '#d8b98a'); R(g, 1, 1, 12, 6, '#f0d9a8'); R(g, 3, 2, 3, 3, '#d04a35'); R(g, 8, 3, 3, 3, '#d04a35'); R(g, 6, 2, 1, 1, '#6cbf4b'); });
  S.box = () => outlined(14, 12, (g) => { box(g, 0, 0, 14, 4, 8, '#d8b98a', '#b08a58'); R(g, 6, 0, 2, 12, '#e8d7b0'); });
  S.easel = () => outlined(16, 28, (g) => { R(g, 1, 0, 14, 16, '#f7f7fa'); R(g, 1, 0, 14, 1, '#c9cfdb'); R(g, 3, 3, 8, 1, '#ff5d5d'); R(g, 3, 6, 10, 1, '#4c86ff'); R(g, 3, 9, 6, 1, '#6cbf4b'); R(g, 3, 12, 9, 1, '#4c86ff'); R(g, 2, 16, 1, 12, '#8a5a34'); R(g, 13, 16, 1, 12, '#8a5a34'); R(g, 7, 16, 2, 9, '#8a5a34'); });

  function sprite(type, v) {
    const k = type + ':' + (v || 0);
    if (!cache[k]) cache[k] = S[type](v || 0);
    return cache[k];
  }

  /* ---------- floors and walls ---------- */
  const FL = {
    carpet: ['#5d6d90', '#55648a', '#6878a0'], carpet2: ['#4f8683', '#477a78', '#5a9390'], carpet3: ['#8363a0', '#775994', '#8f70ac'],
    exec: ['#3f7058', '#38654f', '#4a7d64'], hall: ['#c3c7d2', '#b6bbc8', '#d0d4dd'], tile: ['#ebe5d4', '#d9d2bd'], lobby: ['#ddd6c4', '#cfc7b3'],
    wood: ['#bb8d5c', '#a97c4d', '#c79a69'], server: ['#3d475a', '#353e50', '#48546a'],
  };
  function floorTile(g, type, x, y, px, py) {
    const c = FL[type] || FL.hall, h = hash(x, y);
    if (type.startsWith('carpet') || type === 'exec') {
      R(g, px, py, 16, 16, c[0]);
      for (let i = 0; i < 9; i++) { const a = hash(x * 7 + i, y * 13 + i * 3), b = hash(x * 3 + i * 5, y * 11 + i); R(g, px + ((a * 16) | 0), py + ((b * 16) | 0), 1, 1, i % 2 ? c[1] : c[2]); }
      if (type === 'exec' && (x + y) % 2 === 0) { R(g, px + 7, py + 7, 2, 2, c[2]); }
    } else if (type === 'tile') {
      R(g, px, py, 16, 16, (x + y) % 2 ? c[0] : c[1]); R(g, px, py, 16, 1, 'rgba(255,255,255,.25)'); R(g, px, py + 15, 16, 1, 'rgba(0,0,0,.08)');
    } else if (type === 'lobby') {
      R(g, px, py, 16, 16, c[0]); if (x % 2 === 0) R(g, px, py, 1, 16, c[1]); if (y % 2 === 0) R(g, px, py, 16, 1, c[1]);
      if (h > 0.6) R(g, px + 5, py + 9, 3, 1, c[1]);
    } else if (type === 'wood') {
      R(g, px, py, 16, 16, c[0]);
      for (let r = 0; r < 4; r++) { R(g, px, py + r * 4 + 3, 16, 1, c[1]); const o = ((hash(x, y * 4 + r) * 16) | 0); R(g, px + o, py + r * 4, 1, 3, c[1]); if (hash(x + r, y) > 0.7) R(g, px + ((o + 5) % 14), py + r * 4 + 1, 3, 1, c[2]); }
    } else if (type === 'server') {
      R(g, px, py, 16, 16, c[0]); R(g, px, py, 16, 1, c[2]); R(g, px, py, 1, 16, c[2]); R(g, px + 15, py, 1, 16, c[1]); R(g, px, py + 15, 16, 1, c[1]);
      if (h > 0.78) for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) R(g, px + 4 + i * 3, py + 4 + j * 3, 2, 1, c[1]);
    } else {
      R(g, px, py, 16, 16, c[0]); R(g, px, py, 16, 1, c[2]); R(g, px, py, 1, 16, c[2]); if (h > 0.7) R(g, px + 6, py + 8, 4, 1, c[1]);
    }
  }

  const CAP = '#2e3142', CAPHI = '#4a4f68';
  function renderFloor(F) {
    const W = F.W, H = F.H, base = mk(W * TS, H * TS), over = mk(W * TS, H * TS);
    const g = base.getContext('2d'), o = over.getContext('2d');
    const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? '#' : F.t[y * W + x];
    R(g, 0, 0, W * TS, H * TS, '#12131c');
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const t = at(x, y), px = x * TS, py = y * TS;
      if (t === '#') {
        const below = at(x, y + 1);
        if (below !== '#' && y + 1 < H) {
          const srv = below === 'server';
          const face = srv ? '#8d98ab' : '#ebe6da', lo = srv ? '#7a8598' : '#d9d2c2', bb = srv ? '#4d566a' : '#8b8676';
          R(g, px, py, 16, 16, face); R(g, px, py + 9, 16, 4, lo); R(g, px, py + 13, 16, 3, bb); R(g, px, py + 13, 16, 1, shade(bb, 30)); R(g, px, py, 16, 2, CAP);
          R(o, px, py - 6, 16, 7, CAP); R(o, px, py - 6, 16, 1, CAPHI);
        } else {
          R(g, px, py, 16, 16, CAP);
          if (at(x - 1, y) !== '#') R(g, px, py, 1, 16, CAPHI);
          if (at(x + 1, y) !== '#') R(g, px + 15, py, 1, 16, '#1e2030');
          if (at(x, y - 1) !== '#') { R(o, px, py - 6, 16, 7, CAP); R(o, px, py - 6, 16, 1, CAPHI); }
        }
      } else {
        const type = t === 'door' ? 'hall' : t === 'stairs' ? 'hall' : t;
        floorTile(g, type, x, y, px, py);
        if (at(x, y - 1) === '#') { R(g, px, py, 16, 4, 'rgba(10,12,30,.22)'); R(g, px, py + 4, 16, 3, 'rgba(10,12,30,.09)'); }
        if (at(x - 1, y) === '#') R(g, px, py, 3, 16, 'rgba(10,12,30,.12)');
        if (t === 'door') {
          R(g, px, py, 16, 16, 'rgba(10,12,30,.12)'); R(g, px, py + 7, 16, 2, '#9aa1ae'); R(g, px, py, 2, 16, '#5a4a3a'); R(g, px + 14, py, 2, 16, '#5a4a3a');
          R(o, px, py - 6, 16, 7, CAP); R(o, px, py - 6, 16, 1, CAPHI); R(o, px, py + 1, 16, 2, '#5a4a3a');
        }
      }
    }
    /* floor decals */
    for (const d of F.decals) {
      const px = d.x * TS, py = d.y * TS, w = d.w * TS, h = d.h * TS;
      if (d.k === 'rug') {
        const c = d.c || '#b0503e';
        R(g, px + 2, py + 2, w - 4, h - 4, c); R(g, px + 4, py + 4, w - 8, h - 8, shade(c, 26)); R(g, px + 6, py + 6, w - 12, h - 12, c);
        for (let i = px + 3; i < px + w - 3; i += 3) { R(g, i, py + 1, 1, 1, shade(c, 50)); R(g, i, py + h - 2, 1, 1, shade(c, 50)); }
      } else if (d.k === 'mat') { R(g, px + 1, py + 4, w - 2, h - 6, '#4a4f5e'); R(g, px + 3, py + 6, w - 6, h - 10, '#5d6375'); }
      else if (d.k === 'stairs') {
        const up = d.up;
        for (let i = 0; i < h; i += 4) { const k = i / h; const c = up ? shade('#aeb4c6', -(1 - k) * 70) : shade('#8c92a6', -k * 70 + 10); R(g, px, py + i, w, 4, c); R(g, px, py + i, w, 1, shade(c, 34)); }
        R(g, px, py, 2, h, '#3a3e50'); R(g, px + w - 2, py, 2, h, '#3a3e50');
        const ax = px + w / 2 - 3, ay = py + h - 12;
        if (up) { R(g, ax + 2, ay, 2, 8, '#ffb23e'); R(g, ax, ay + 2, 6, 1, '#ffb23e'); R(g, ax + 1, ay + 1, 4, 1, '#ffb23e'); }
        else { R(g, ax + 2, ay, 2, 8, '#ffb23e'); R(g, ax, ay + 5, 6, 1, '#ffb23e'); R(g, ax + 1, ay + 6, 4, 1, '#ffb23e'); }
      } else if (d.k === 'light') { R(g, px, py, w, h, 'rgba(255,250,220,.07)'); R(g, px + 2, py, w - 4, h - 6, 'rgba(255,250,220,.06)'); }
      else if (d.k === 'cables') { R(g, px + 2, py + 7, w - 4, 2, '#22242e'); R(g, px + 4, py + 7, 3, 1, '#4c86ff'); R(g, px + w - 9, py + 8, 4, 1, '#ffb23e'); }
    }
    /* things mounted on wall faces */
    for (const d of F.walls) {
      const px = d.x * TS, py = d.y * TS, w = (d.w || 1) * TS;
      if (d.k === 'window') {
        R(g, px + 1, py + 2, w - 2, 10, '#f5f7fa');
        for (let i = 0; i < 8; i++) R(g, px + 2, py + 3 + i, w - 4, 1, shade('#7cc4f5', i * 9));
        R(g, px + 5, py + 5, 6, 2, '#ffffff'); if (w > 20) R(g, px + w - 13, py + 7, 7, 2, '#ffffff');
        for (let i = px + 1 + 15; i < px + w - 4; i += 16) R(g, i, py + 2, 1, 10, '#f5f7fa');
        R(g, px, py + 12, w, 1, '#b7b0a0');
      } else if (d.k === 'tv') {
        R(g, px + 2, py + 1, w - 4, 12, '#14151c'); R(g, px + 3, py + 2, w - 6, 10, '#1b3766');
        for (let i = 0; i < 5; i++) R(g, px + 6 + i * 6, py + 10 - (i * 3) % 7 - 1, 4, (i * 3) % 7 + 1, ['#4c86ff', '#6fe3a1', '#ffb23e'][i % 3]);
        R(g, px + w / 2 - 3, py + 13, 6, 1, '#14151c');
      } else if (d.k === 'board') {
        R(g, px + 1, py + 1, w - 2, 12, '#b8bdc8'); R(g, px + 2, py + 2, w - 4, 10, '#fafbfd');
        R(g, px + 4, py + 4, 9, 1, '#ff5d5d'); R(g, px + 4, py + 6, 14, 1, '#4c86ff'); R(g, px + 4, py + 8, 7, 1, '#2a9d5a'); if (w > 20) { R(g, px + 20, py + 4, 8, 5, '#f6e564'); R(g, px + w - 10, py + 6, 5, 4, '#ff8a80'); }
        R(g, px + 3, py + 12, w - 6, 1, '#8d95a5');
      } else if (d.k === 'cork') {
        R(g, px + 1, py + 1, w - 2, 12, '#7a5230'); R(g, px + 2, py + 2, w - 4, 10, '#c79a69');
        R(g, px + 4, py + 3, 5, 6, '#ffffff'); R(g, px + 11, py + 4, 5, 5, '#f6e564'); if (w > 20) { R(g, px + 18, py + 3, 6, 7, '#aad4ff'); R(g, px + 26, py + 5, 4, 5, '#ff8a80'); }
      } else if (d.k === 'clock') { R(g, px + 4, py + 2, 8, 8, '#22242e'); R(g, px + 5, py + 3, 6, 6, '#ffffff'); R(g, px + 8, py + 4, 1, 3, '#22242e'); R(g, px + 8, py + 6, 2, 1, '#ff5d5d'); }
      else if (d.k === 'poster') { const c = d.c || '#4c86ff'; R(g, px + 3, py + 1, 10, 12, '#ffffff'); R(g, px + 4, py + 2, 8, 6, c); R(g, px + 5, py + 9, 6, 1, '#555'); R(g, px + 5, py + 11, 4, 1, '#999'); }
      else if (d.k === 'logo') {
        R(g, px + 2, py + 2, w - 4, 10, '#1f4d3c');
        R(g, px + 6, py + 3, 3, 2, '#6fe3a1'); R(g, px + 5, py + 5, 5, 2, '#6fe3a1'); R(g, px + 4, py + 7, 7, 2, '#6fe3a1'); R(g, px + 7, py + 9, 1, 2, '#c79a69');
        ptext(g, 'CEDARLINE', px + 14, py + 5, '#eaf7f0');
      } else if (d.k === 'elevator') {
        R(g, px + 1, py, w - 2, 16, '#6a7085'); R(g, px + 3, py + 2, w - 6, 14, '#c3c8d4'); R(g, px + w / 2 - 1, py + 2, 1, 14, '#6a7085'); R(g, px + 4, py + 3, 3, 12, '#e3e7ee'); R(g, px + w / 2 + 1, py + 3, 3, 12, '#e3e7ee');
        R(g, px + w / 2 - 4, py - 1, 8, 3, '#14151c'); R(g, px + w / 2 - 1, py, 2, 1, '#ffb23e');
      } else if (d.k === 'sign') {
        const tw = d.s.length * 4 + 3; const sx = px + ((w - tw) >> 1);
        R(g, sx, py + 3, tw, 9, d.c || '#2e3142'); R(g, sx, py + 3, tw, 1, '#5a6080'); ptext(g, d.s, sx + 2, py + 5, '#f2f4fa');
      } else if (d.k === 'keypad') { R(g, px + 5, py + 4, 6, 8, '#22242e'); R(g, px + 6, py + 5, 4, 2, d.open ? '#6fe3a1' : '#ff5d5d'); for (let i = 0; i < 4; i++) R(g, px + 6 + (i % 2) * 2, py + 8 + ((i / 2) | 0) * 2, 1, 1, '#9aa1ae'); }
      else if (d.k === 'vent') { R(g, px + 2, py + 3, 12, 6, '#b7bdc9'); for (let i = 0; i < 3; i++) R(g, px + 3, py + 4 + i * 2, 10, 1, '#6a7085'); }
      else if (d.k === 'ext') { R(g, px + 6, py + 3, 4, 9, '#d8342c'); R(g, px + 7, py + 2, 2, 1, '#22242e'); R(g, px + 6, py + 6, 4, 2, '#ffffff'); }
      else if (d.k === 'ap') { R(g, px + 4, py + 4, 8, 5, '#f5f7fa'); R(g, px + 5, py + 3, 6, 1, '#f5f7fa'); R(g, px + 5, py + 9, 6, 1, '#c9cfdb'); R(g, px + 7, py + 6, 2, 1, '#6fe3a1'); }
      else if (d.k === 'jack') { R(g, px + 5, py + 8, 6, 4, '#f5f7fa'); R(g, px + 6, py + 9, 1, 2, '#22242e'); R(g, px + 9, py + 9, 1, 2, '#22242e'); }
      else if (d.k === 'exit') { R(g, px + 3, py + 3, 10, 8, '#bfe6ff'); R(g, px + 3, py + 3, 10, 1, '#5a4a3a'); R(g, px + 7, py + 4, 1, 7, '#5a4a3a'); }
      else if (d.k === 'glassdoor') { R(g, px, py, w, 16, '#3a3e50'); R(g, px + 2, py + 3, w - 4, 10, '#9ad4ff'); R(g, px + w / 2 - 1, py + 3, 2, 10, '#3a3e50'); R(g, px + 4, py + 5, 4, 2, '#dff1ff'); }
      else if (d.k === 'frame') { R(g, px + 3, py + 2, 10, 9, '#7a5230'); R(g, px + 4, py + 3, 8, 7, d.c || '#8fd0ff'); R(g, px + 4, py + 7, 8, 3, '#3f7058'); R(g, px + 9, py + 4, 2, 2, '#fff3b0'); }
    }
    return { base, over };
  }

  return { TS, mk, R, shade, ptext, charSheet, sprite, renderFloor, drawChar, outlined };
})();
