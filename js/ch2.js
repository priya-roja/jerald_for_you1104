// Chapter 2: Birthday Moment (night scene > countdown > fireworks > cake > blow > birthday > wish card)
window.RUN = window.RUN || {};
RUN[1] = function (stage, finish, close) {
  let starsHTML = "";
  for (let i = 0; i < 70; i++) {
    const s = (1 + Math.random() * 2).toFixed(1);
    starsHTML += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 70).toFixed(1) + '%;width:' + s + 'px;height:' + s + 'px;animation-delay:' + (Math.random() * 3).toFixed(1) + 's"></i>';
  }
  stage.innerHTML = '<div class="c2bg" id="c2bg"><div class="c2stars">' + starsHTML + '</div><div class="c2moon"></div>' +
    '<svg class="c2hills" viewBox="0 0 1000 200" preserveAspectRatio="none"><path d="M0 130 C120 80 260 150 430 110 C600 70 780 150 1000 95 L1000 200 L0 200 Z" fill="#2b1156" opacity=".85"/><path d="M0 170 C180 130 350 190 540 155 C740 118 880 180 1000 150 L1000 200 L0 200 Z" fill="#150a2e"/></svg></div>' +
    '<canvas class="c2fw" id="c2fw"></canvas><div class="c2box" id="c2box"></div><button class="xbtn" id="x">✕</button>';
  const box = stage.querySelector("#c2box"), bg = stage.querySelector("#c2bg"), cv = stage.querySelector("#c2fw"), cx = cv.getContext("2d");
  let mc, raf, timers = [], alive = true, quiet = false, tapped = false, W = 0, H = 0, R = 0;
  let parts = [], rockets = [], flashes = [], wasPlaying = playing;
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const COLS = ["#ffb3c6", "#c9a0ff", "#f3d3a4", "#e8b4a0", "#ffffff", "#ff8fb1"];
  const pick = () => COLS[Math.floor(Math.random() * COLS.length)];
  const MON = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  const bp = String(CONFIG.birthday).split("-");
  const dateTxt = parseInt(bp[2], 10) + " · " + MON[parseInt(bp[1], 10) - 1] + " · " + (parseInt(bp[0], 10) + CONFIG.age);

  const size = () => {
    const d = Math.min(window.devicePixelRatio || 1, 2);
    W = stage.clientWidth || window.innerWidth; H = stage.clientHeight || window.innerHeight; R = Math.min(W, H);
    cv.width = W * d; cv.height = H * d; cx.setTransform(d, 0, 0, d, 0, 0);
  };
  size(); window.addEventListener("resize", size);

  const cleanup = () => {
    alive = false; timers.forEach(clearTimeout); cancelAnimationFrame(raf);
    window.removeEventListener("resize", size);
    if (mc) { try { mc.close(); } catch (e) {} mc = null; }
    if (wasPlaying && !playing) music(true);
  };
  stage.querySelector("#x").onclick = () => { cleanup(); close(); };

  // ---- sounds
  function ac() {
    if (!mc) { try { mc = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
    if (mc && mc.state === "suspended") mc.resume();
    return mc;
  }
  function tick(f) {
    const c = ac(); if (!c) return;
    try {
      const o = c.createOscillator(), g = c.createGain(), t = c.currentTime;
      o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.15, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.4);
    } catch (e) {}
  }
  function boom() {
    const c = ac(); if (!c) return;
    try {
      const len = Math.floor(c.sampleRate * 0.6), b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      s.buffer = b; f.type = "lowpass"; f.frequency.value = 700; g.gain.value = quiet ? 0.06 : 0.22;
      s.connect(f).connect(g).connect(c.destination); s.start();
    } catch (e) {}
  }

  // ---- fireworks engine
  function launch(x, type) {
    const r = Math.random();
    rockets.push({
      x: x === undefined ? W * (0.15 + Math.random() * 0.7) : x, y: H, ty: H * (0.12 + Math.random() * 0.28), c: pick(),
      t: type || (r < 0.45 ? "peony" : r < 0.65 ? "ring" : r < 0.85 ? "willow" : "heart")
    });
  }
  function explode(x, y, c, type) {
    boom(); flashes.push({ x, y, l: 1 });
    const K = R * 0.015, c2 = pick();
    const add = (vx, vy, o) => {
      if (parts.length > 1100) return;
      parts.push(Object.assign({ x, y, vx, vy, life: 1, d: 0.011 + Math.random() * 0.01, c: c, w: 1.5 + Math.random() * 1.6, g: R * 0.00005, fr: 0.96, f: Math.random() < 0.4 }, o));
    };
    const hx = t => 16 * Math.pow(Math.sin(t), 3);
    const hy = t => -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    if (type === "heart") {
      for (let i = 0; i < 56; i++) { const t = (i / 56) * Math.PI * 2, k = K / 17; add(hx(t) * k, hy(t) * k, { c: i % 4 ? "#ff8fb1" : "#ffffff", g: R * 0.00002, d: 0.009 }); }
      for (let i = 0; i < 34; i++) { const t = (i / 34) * Math.PI * 2, k = (K / 17) * 0.6; add(hx(t) * k, hy(t) * k, { c: "#ffd1df", g: R * 0.00002, d: 0.009 }); }
    } else if (type === "ring") {
      for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; add(Math.cos(a) * K, Math.sin(a) * K, { c: c }); }
      for (let i = 0; i < 32; i++) { const a = (i / 32) * Math.PI * 2; add(Math.cos(a) * K * 0.6, Math.sin(a) * K * 0.6, { c: c2 }); }
    } else if (type === "willow") {
      for (let i = 0; i < 90; i++) { const a = Math.random() * Math.PI * 2, s = K * (0.25 + Math.random() * 0.6); add(Math.cos(a) * s, Math.sin(a) * s, { c: "#f3d3a4", d: 0.006 + Math.random() * 0.004, g: R * 0.00009, fr: 0.975, f: false }); }
    } else {
      for (let i = 0; i < 130; i++) { const a = Math.random() * Math.PI * 2, s = K * (0.35 + 0.65 * Math.sqrt(Math.random())); add(Math.cos(a) * s, Math.sin(a) * s, { c: i % 3 ? c : c2 }); }
    }
  }
  function frame() {
    if (!alive) return;
    cx.clearRect(0, 0, W, H); cx.globalCompositeOperation = "lighter"; cx.lineCap = "round";
    flashes = flashes.filter(f => {
      const g = cx.createRadialGradient(f.x, f.y, 0, f.x, f.y, R * 0.45);
      g.addColorStop(0, "rgba(255,225,240," + (f.l * 0.28).toFixed(3) + ")"); g.addColorStop(1, "rgba(255,225,240,0)");
      cx.globalAlpha = 1; cx.fillStyle = g; cx.fillRect(f.x - R * 0.45, f.y - R * 0.45, R * 0.9, R * 0.9);
      f.l -= 0.08; return f.l > 0;
    });
    rockets = rockets.filter(r => {
      r.y -= Math.max(H * 0.007, (r.y - r.ty) * 0.06);
      cx.globalAlpha = 0.95; cx.strokeStyle = "#ffe9c9"; cx.lineWidth = 2.4;
      cx.beginPath(); cx.moveTo(r.x, r.y); cx.lineTo(r.x, r.y + 20); cx.stroke();
      parts.push({ x: r.x, y: r.y + 8, vx: (Math.random() - 0.5) * 0.8, vy: Math.random() * 1.4, life: 0.8, d: 0.07, c: "#ffd9a0", w: 1.3, g: 0.02, fr: 0.95, f: false });
      if (r.y - r.ty < H * 0.01) { explode(r.x, r.y, r.c, r.t); return false; }
      return true;
    });
    parts = parts.filter(p => {
      p.x += p.vx; p.y += p.vy; p.vx *= p.fr; p.vy = p.vy * p.fr + p.g; p.life -= p.d;
      if (p.life <= 0) return false;
      const a = p.f ? p.life * (0.55 + Math.random() * 0.45) : p.life;
      cx.strokeStyle = p.c; cx.beginPath(); cx.moveTo(p.x - p.vx * 2.5, p.y - p.vy * 2.5); cx.lineTo(p.x, p.y);
      cx.globalAlpha = a * 0.22; cx.lineWidth = p.w * 3.2; cx.stroke();
      cx.globalAlpha = a; cx.lineWidth = p.w; cx.stroke();
      return true;
    });
    cx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  }
  frame();

  function ambient() { if (!alive) return; launch(); later(ambient, 1300 + Math.random() * 1200); }

  // ---- realistic cake (SVG)
  function cakeSVG() {
    let beadsB = "", beadsT = "", rosettes = "", drips = "", sprinkles = "";
    for (let x = 62; x <= 278; x += 15) {
      const u = (x - 170) / 120, y = 310 + 16 * Math.sqrt(Math.max(0, 1 - u * u));
      beadsB += '<circle cx="' + x + '" cy="' + (y - 3).toFixed(1) + '" r="7.5" fill="url(#cgBead)"/>';
    }
    for (let x = 92; x <= 248; x += 13) {
      const u = (x - 170) / 85, y = 219 + 12 * Math.sqrt(Math.max(0, 1 - u * u));
      beadsT += '<circle cx="' + x + '" cy="' + (y - 2).toFixed(1) + '" r="6" fill="url(#cgBead)"/>';
    }
    for (let x = 96; x <= 244; x += 16) {
      const u = (x - 170) / 85, y = 155 + 12 * Math.sqrt(Math.max(0, 1 - u * u));
      rosettes += '<g transform="translate(' + x + " " + (y - 3).toFixed(1) + ')"><circle r="8.5" fill="url(#cgBead)"/><path d="M-4 1 C-4 -5 4 -5 4 0 C4 4 -1 5 -2 2" fill="none" stroke="#f0a0b8" stroke-width="1.3" stroke-linecap="round"/></g>';
    }
    [[72, 243.2, 18], [100, 247, 30], [128, 249, 14], [160, 250, 22], [190, 249.8, 24], [218, 248.7, 16], [245, 246.5, 28], [270, 242.8, 14]].forEach(d => {
      drips += '<rect x="' + (d[0] - 6) + '" y="' + (d[1] - 8) + '" width="12" height="' + (d[2] + 8) + '" rx="6" fill="url(#cgChoc)"/>' +
        '<path d="M' + (d[0] - 2) + " " + d[1] + " V" + (d[1] + d[2] - 8) + '" stroke="#fff" stroke-opacity=".28" stroke-width="2" stroke-linecap="round" fill="none"/>';
    });
    [[104, 186, 25, "#ffb3c6"], [121, 201, -40, "#c9a0ff"], [139, 182, 60, "#f3d3a4"], [152, 205, 10, "#ffffff"], [171, 187, -20, "#ffb3c6"], [188, 203, 45, "#c9a0ff"],
      [204, 184, -55, "#f3d3a4"], [221, 199, 20, "#ffffff"], [236, 186, 70, "#ffb3c6"], [112, 209, -10, "#f3d3a4"], [228, 210, 35, "#c9a0ff"], [130, 193, -65, "#ffffff"]].forEach(s => {
      sprinkles += '<rect x="-5" y="-1.2" width="10" height="2.4" rx="1.2" fill="' + s[3] + '" transform="translate(' + s[0] + " " + s[1] + ") rotate(" + s[2] + ')"/>';
    });
    const berry = (x, y, s) => '<g transform="translate(' + x + " " + y + ") scale(" + s + ')"><path d="M0 -9 C-11 -9 -13 6 0 16 C13 6 11 -9 0 -9 Z" fill="url(#cgBerry)"/>' +
      '<g fill="#ffe7a8" opacity=".85"><ellipse cx="-4" cy="-1" rx=".9" ry="1.5"/><ellipse cx="3" cy="-2" rx=".9" ry="1.5"/><ellipse cx="-1" cy="4" rx=".9" ry="1.5"/><ellipse cx="5" cy="5" rx=".9" ry="1.5"/><ellipse cx="-5" cy="7" rx=".9" ry="1.5"/></g>' +
      '<path d="M-7 -9 L-3 -6 L0 -11 L3 -6 L7 -9 L4 -4 L-4 -4 Z" fill="#4f9a5e"/></g>';
    return '<svg viewBox="0 0 340 380" xmlns="http://www.w3.org/2000/svg"><defs>' +
      '<linearGradient id="cgPink" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#e98aa8"/><stop offset=".18" stop-color="#ffc9d9"/><stop offset=".5" stop-color="#fff1f5"/><stop offset=".82" stop-color="#ffc2d4"/><stop offset="1" stop-color="#e07c9d"/></linearGradient>' +
      '<linearGradient id="cgCream" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#dcae93"/><stop offset=".18" stop-color="#f8dfcd"/><stop offset=".5" stop-color="#fffaf4"/><stop offset=".82" stop-color="#f6dac7"/><stop offset="1" stop-color="#d49f86"/></linearGradient>' +
      '<radialGradient id="cgTopP" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#fffafc"/><stop offset="1" stop-color="#ffd6e3"/></radialGradient>' +
      '<radialGradient id="cgTopC" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#fffdf9"/><stop offset="1" stop-color="#f7dccb"/></radialGradient>' +
      '<radialGradient id="cgBead" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#ffe3ec"/><stop offset="1" stop-color="#f2a9c0"/></radialGradient>' +
      '<linearGradient id="cgChoc" gradientUnits="userSpaceOnUse" x1="0" y1="220" x2="0" y2="285"><stop offset="0" stop-color="#6b3225"/><stop offset=".45" stop-color="#8a4a35"/><stop offset="1" stop-color="#4a2018"/></linearGradient>' +
      '<linearGradient id="cgGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2bf"/><stop offset=".5" stop-color="#f0c060"/><stop offset="1" stop-color="#b98424"/></linearGradient>' +
      '<linearGradient id="cgPlateS" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#c98f76"/><stop offset=".5" stop-color="#f7d3bf"/><stop offset="1" stop-color="#b9785f"/></linearGradient>' +
      '<radialGradient id="cgPlateT" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#fff4ee"/><stop offset="1" stop-color="#f0c9b4"/></radialGradient>' +
      '<radialGradient id="cgBerry" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ff8a9a"/><stop offset=".55" stop-color="#d4143a"/><stop offset="1" stop-color="#860a24"/></radialGradient>' +
      '<pattern id="cgStripe" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><rect width="14" height="14" fill="#fff6f8"/><rect width="14" height="6" fill="#ff9fbd"/></pattern>' +
      '<linearGradient id="cgShade" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".25"/><stop offset=".4" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>' +
      '<radialGradient id="cgFlame" cx=".5" cy=".75" r=".6"><stop offset="0" stop-color="#fffbe0"/><stop offset=".4" stop-color="#ffd36b"/><stop offset="1" stop-color="#ff8a2c"/></radialGradient>' +
      '<radialGradient id="cgGlow"><stop offset="0" stop-color="#ffd58a" stop-opacity=".7"/><stop offset="1" stop-color="#ffd58a" stop-opacity="0"/></radialGradient>' +
      '<filter id="cgBlur"><feGaussianBlur stdDeviation="6"/></filter></defs>' +
      // stand
      '<ellipse cx="170" cy="364" rx="58" ry="9" fill="url(#cgPlateS)"/><rect x="160" y="326" width="20" height="36" fill="url(#cgPlateS)"/><ellipse cx="170" cy="360" rx="58" ry="9" fill="url(#cgPlateT)"/>' +
      '<path d="M20 314 L20 322 A150 20 0 0 0 320 322 L320 314 Z" fill="url(#cgPlateS)"/><ellipse cx="170" cy="314" rx="150" ry="20" fill="url(#cgPlateT)"/>' +
      '<ellipse cx="170" cy="314" rx="126" ry="17" fill="#000" opacity=".25" filter="url(#cgBlur)"/>' +
      // bottom tier
      '<path d="M50 220 L50 310 A120 16 0 0 0 290 310 L290 220 Z" fill="url(#cgPink)"/><ellipse cx="170" cy="220" rx="120" ry="16" fill="url(#cgTopP)" stroke="#fff" stroke-opacity=".5" stroke-width="1.2"/>' +
      '<path d="M50 220 A120 16 0 0 0 290 220 L290 234 A120 16 0 0 1 50 234 Z" fill="url(#cgChoc)"/>' + drips +
      '<path d="M60 229 A112 14 0 0 0 150 247" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2" stroke-linecap="round"/>' + beadsB +
      '<text x="170" y="298" text-anchor="middle" font-size="27" font-style="italic" font-weight="700" fill="url(#cgGold)" stroke="#9a6a1b" stroke-width=".5">' + CONFIG.name + '</text>' +
      '<path d="M122 306 Q170 316 218 306" fill="none" stroke="#e7b75a" stroke-width="1.6" stroke-linecap="round"/>' +
      // top tier
      '<path d="M85 155 L85 219 A85 12 0 0 0 255 219 L255 155 Z" fill="url(#cgCream)"/>' + beadsT + sprinkles +
      '<ellipse cx="170" cy="155" rx="85" ry="12" fill="url(#cgTopC)" stroke="#fff" stroke-opacity=".6" stroke-width="1.2"/>' + rosettes +
      berry(148, 144, 0.75) + berry(192, 144, 0.75) + berry(126, 150, 1) + berry(214, 150, 1) +
      // candle
      '<rect x="162" y="106" width="16" height="50" rx="2" fill="url(#cgStripe)"/><rect x="162" y="106" width="16" height="50" rx="2" fill="url(#cgShade)"/>' +
      '<ellipse cx="170" cy="106" rx="8" ry="2.6" fill="#fff0f4"/><path d="M170 106 V99" stroke="#3b2a2a" stroke-width="1.6" stroke-linecap="round"/>' +
      '<g class="c2fg"><circle class="c2glow" cx="170" cy="84" r="46" fill="url(#cgGlow)"/><g class="c2flm"><path d="M170 66 C182 80 181 98 170 98 C159 98 158 80 170 66 Z" fill="url(#cgFlame)"/><ellipse cx="170" cy="92" rx="3" ry="6" fill="#fffbe6" opacity=".9"/></g></g>' +
      '<path class="c2smoke" d="M170 98 C160 84 181 76 168 60 S176 44 170 36" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>' +
      "</svg>";
  }

  // ---- Scene 1: ready
  function s1() {
    box.innerHTML = '<div><p class="q serif">Ready, ' + CONFIG.name + '?</p><p class="msg">Keep your eyes on the sky.</p><button class="c2btn c2in" style="--d:.8s" id="go">Start the countdown</button></div>';
    box.querySelector("#go").onclick = s2;
  }

  // ---- Scene 2: night + 3,2,1 + fireworks
  function s2() {
    if (playing) music(false);
    ac(); bg.classList.add("on");
    let n = 3;
    (function step() {
      if (!alive) return;
      if (n > 0) {
        box.innerHTML = '<div class="c2num">' + n + "</div>";
        tick(n === 1 ? 880 : 660); n--; later(step, 1000);
      } else {
        box.innerHTML = '<p class="c2look">Look up ✨</p>';
        for (let i = 0; i < 12; i++) later(() => launch(), 300 + i * 420);
        later(() => { launch(W * 0.3); launch(W * 0.7); }, 2600);
        later(() => launch(W * 0.5, "heart"), 5600);
        later(() => { launch(W * 0.2); launch(W * 0.8); }, 6000);
        later(s3, 8000);
      }
    })();
  }

  // ---- Scene 3: the cake
  function s3() {
    quiet = true; ambient();
    box.innerHTML = '<div class="c2wrap"><p class="c2hint">It\'s your day, ' + CONFIG.name + ' 💖🦋</p><div class="c2cake" id="ck" role="button" tabindex="0">' + cakeSVG() + '</div><p class="c2tap">Tap the cake 🎂</p></div>';
    box.querySelector("#ck").onclick = tapCake;
  }
  function tapCake() {
    if (tapped) return; tapped = true; quiet = false;
    const ck = box.querySelector("#ck"), tp = box.querySelector(".c2tap");
    ck.classList.add("c2out"); if (tp) tp.style.visibility = "hidden";
    for (let k = 0; k < 6; k++) later(() => launch(), 200 + k * 170);
    later(() => { ck.classList.add("c2pop"); confetti(); }, 1100);
    later(confetti, 1900);
    later(party, 2000);
  }

  // ---- Scene 4: birthday message
  function party() {
    quiet = true;
    const word = (t, d) => '<div class="c2hl">' + t.split("").map((ch, i) => '<span style="--d:' + (d + i * 0.07).toFixed(2) + 's">' + ch + "</span>").join("") + "</div>";
    box.innerHTML = '<div class="c2bd"><div class="c2date c2in" style="--d:.2s">' + dateTxt + '</div>' +
      '<div class="c2h">' + word("Happy", 0.4) + word("Birthday", 0.85) + '</div>' +
      '<div class="c2nm c2in" style="--d:1.7s">' + CONFIG.name + '</div>' +
      '<div class="c2badge c2in" style="--d:2.3s"><b>' + CONFIG.age + '</b></div>' +
      '<button class="c2btn c2in" style="--d:3.4s" id="nx">Continue <span>→</span></button></div>';
    box.querySelector("#nx").onclick = s5;
    play();
  }

  // Happy Birthday tune (music-box style)
  function play() {
    const c = ac(); if (!c) return;
    try {
      const N = [[392,.75],[392,.25],[440,1],[392,1],[523,1],[494,2],[392,.75],[392,.25],[440,1],[392,1],[587,1],[523,2],
        [392,.75],[392,.25],[784,1],[659,1],[523,1],[494,1],[440,2],[698,.75],[698,.25],[659,1],[523,1],[587,1],[523,2]];
      let t = c.currentTime + 0.3; const beat = 0.5;
      N.forEach(n => {
        const o = c.createOscillator(), g = c.createGain();
        o.type = "sine"; o.frequency.value = n[0];
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + n[1] * beat * 1.8);
        o.connect(g).connect(c.destination); o.start(t); o.stop(t + n[1] * beat * 1.9);
        t += n[1] * beat;
      });
    } catch (e) {}
  }

  // ---- Scene 5: wish card (last scene)
  function s5() {
    box.innerHTML = '<div class="c2wish"><div class="c2seal">💌</div>' +
      '<p class="c2wl c2in" style="--d:.4s">Whatever you wished for just now…</p>' +
      '<p class="c2wl c2in" style="--d:1.5s">I hope it comes true.</p>' +
      '<div class="c2dv c2in" style="--d:2.6s">✦</div>' +
      '<p class="c2wl c2in" style="--d:3.2s">And if I can be a part of it,</p>' +
      '<p class="c2wl big c2in" style="--d:4.3s"><span class="g">even better.</span> ❤️</p></div>' +
      '<button class="c2btn c2in" id="fin" style="--d:5.8s;margin-top:28px">Open the next door 🚪</button>';
    box.querySelector("#fin").onclick = () => { cleanup(); finish(); };
  }

  s1();
};