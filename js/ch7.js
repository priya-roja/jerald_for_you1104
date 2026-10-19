// Chapter 7 (door 7): The Grand Finale
// Flow: intro > jar wishes > wish to me > grand curtain > last step (write + WhatsApp + save reaction)
window.RUN = window.RUN || {};

// ===== EDIT HERE =====
const F7 = {
  jarTitle: "Your wish jar is open ✨",
  jarSub: "These are the wishes you made for us 🤍",
  mineTitle: "And your wish to me 💫",
  mineSub: "I will try my very best to make it come true 🤍",
  noneText: "The jar is quiet, but I still hear every wish 🤍",
  lines: [
    "Another year of you, and I'm still so glad it's you.",
    "Whatever comes next, I want you in it. ❤️"
  ],
  sign: "Forever yours, Priya",
  askTitle: "Tell me what you feel 🤍",
  askSub: "Write anything you want to tell me. Then send everything to me on WhatsApp.",
  askHint: "I want to tell you..."
};
// =====================

RUN[6] = function (stage, finish, close) {
  // ---------- styles ----------
  if (!document.getElementById("w7css")) {
    const st = document.createElement("style");
    st.id = "w7css";
    st.textContent = `
.w7wish{margin:10px 0;padding:14px 16px;border-radius:16px;background:rgba(255,255,255,.07);border:1px solid rgba(255,224,138,.3);color:#f6e9c9;text-align:left;line-height:1.6;box-shadow:0 0 22px rgba(255,200,120,.12);animation:w7up .9s ease both}
@keyframes w7up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.w7row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:16px 0}
.w7fin{position:absolute;inset:0;z-index:20;overflow:hidden;display:flex;align-items:center;justify-content:center;text-align:center;background:radial-gradient(ellipse at 50% 40%,rgba(130,55,160,.6),rgba(10,4,25,.97) 72%);animation:w7up 1.2s ease both}
.w7glow{position:absolute;left:50%;top:44%;width:80vmin;height:80vmin;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(255,200,230,.28),transparent 65%);animation:w7pulse 3.5s ease-in-out infinite}
@keyframes w7pulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.8}50%{transform:translate(-50%,-50%) scale(1.15);opacity:1}}
.w7c{position:relative;z-index:3;padding:20px;color:#fff;max-width:520px;max-height:100%;overflow:auto}
.w7h{font-size:clamp(34px,10vw,62px);line-height:1.1;margin:10px 0 0;background:linear-gradient(90deg,#fff3c4,#ffb3c6,#c9a0ff,#fff3c4);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:w7sh 6s linear infinite;filter:drop-shadow(0 0 14px rgba(255,180,220,.5))}
@keyframes w7sh{to{background-position:200% 0}}
.w7n{font-size:clamp(28px,8vw,46px);margin:6px 0 18px;color:#ffe08a;text-shadow:0 0 22px rgba(255,210,120,.7)}
.w7p{margin:8px 0;font-size:16px;line-height:1.7;color:#f3e6ff}
.w7sg{margin-top:16px;color:#ffd1df}
.w7ln{position:absolute;bottom:-70px;left:var(--x);width:26px;height:34px;border-radius:10px 10px 14px 14px;background:linear-gradient(#ffe3a0,#ff9a5a);box-shadow:0 0 24px 8px rgba(255,190,110,.5);opacity:0;z-index:1;animation:w7r var(--t) linear var(--d) infinite}
@keyframes w7r{0%{opacity:0;transform:translate(0,0) scale(var(--s))}10%{opacity:.95}90%{opacity:.9}100%{opacity:0;transform:translate(34px,-118vh) scale(var(--s))}}
.w7ht{position:absolute;top:-30px;z-index:2;pointer-events:none;animation:w7f linear forwards}
@keyframes w7f{to{transform:translate(var(--dx),115vh) rotate(var(--r));opacity:.2}}
.w7end{margin-top:18px;min-height:60px}
@media (prefers-reduced-motion:reduce){.w7h,.w7glow,.w7ln{animation:none}}
`;
    document.head.appendChild(st);
  }

  // ---------- base ----------
  let starsHTML = "";
  for (let i = 0; i < 70; i++) {
    const s = (1 + Math.random() * 2).toFixed(1);
    starsHTML += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 70).toFixed(1) + '%;width:' + s + 'px;height:' + s + 'px;animation-delay:' + (Math.random() * 3).toFixed(1) + 's"></i>';
  }
  stage.innerHTML = '<div class="c2bg on"><div class="c2stars">' + starsHTML + '</div><div class="c2moon"></div>' +
    '<svg class="c2hills" viewBox="0 0 1000 200" preserveAspectRatio="none"><path d="M0 130 C120 80 260 150 430 110 C600 70 780 150 1000 95 L1000 200 L0 200 Z" fill="#2b1156" opacity=".85"/><path d="M0 170 C180 130 350 190 540 155 C740 118 880 180 1000 150 L1000 200 L0 200 Z" fill="#150a2e"/></svg></div>' +
    '<div class="c2box" id="c7box"></div><button class="xbtn" id="x">✕</button>';
  const box = stage.querySelector("#c7box");
  let pg = null, rain, timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const cleanup = () => { clearInterval(rain); timers.forEach(clearTimeout); };
  stage.querySelector("#x").onclick = () => { cleanup(); close(); };

  const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const WA = String(CONFIG.phone).replace(/\D/g, "");
  let jarWishes = [];
  try { jarWishes = JSON.parse(lsGet("bd_wishes")) || []; } catch (e) {}
  const mineWish = (lsGet("bd_wishme") || "").trim();

  function page(html) {
    if (pg) pg.remove();
    pg = document.createElement("div"); pg.className = "c4pg";
    pg.innerHTML = '<div class="c4in">' + html + "</div>";
    stage.appendChild(pg); box.style.display = "none";
    return pg;
  }

  // ---------- 1. intro ----------
  function intro() {
    box.className = "c2box";
    box.innerHTML = '<div><p class="c2date c2in" style="--d:.2s">CHAPTER 7</p>' +
      '<h2 class="q serif c2in" style="--d:.6s;margin:16px 0 6px">The Grand Finale</h2>' +
      '<p class="msg c2in" style="--d:1.1s">Last door. Almost there 🤍</p>' +
      '<button class="c2btn c2in" style="--d:1.8s;margin-top:22px" id="go">Open it</button></div>';
    box.querySelector("#go").onclick = jar;
  }

  // ---------- 2. jar wishes ----------
  function jar() {
    const p = page('<p class="c2date">WISH JAR</p><h2 class="q serif">' + F7.jarTitle + '</h2><p class="msg">' + F7.jarSub + '</p><div id="wl"></div>' +
      '<button class="c2btn" id="nx" style="margin-top:14px">Continue →</button>');
    const wl = p.querySelector("#wl");
    if (!jarWishes.length) wl.innerHTML = '<p class="msg">' + F7.noneText + '</p>';
    jarWishes.forEach((w, i) => {
      const d = document.createElement("div");
      d.className = "w7wish"; d.style.animationDelay = (0.5 + i * 0.9) + "s";
      d.textContent = "✨ " + w;
      wl.appendChild(d);
    });
    if (typeof confetti === "function") confetti();
    p.querySelector("#nx").onclick = mine;
  }

  // ---------- 3. his wish to me ----------
  function mine() {
    const p = page('<p class="c2date">YOUR WISH TO ME</p><h2 class="q serif">' + F7.mineTitle + '</h2><p class="msg">' + F7.mineSub + '</p><div id="wl"></div>' +
      '<button class="c2btn" id="nx" style="margin-top:14px">Final surprise ✨</button>');
    const wl = p.querySelector("#wl");
    const d = document.createElement("div");
    d.className = "w7wish";
    d.textContent = mineWish ? "💫 " + mineWish : F7.noneText;
    wl.appendChild(d);
    p.querySelector("#nx").onclick = curtain;
  }

  // ---------- 4. grand curtain ----------
  function curtain() {
    if (pg) { pg.remove(); pg = null; }
    box.style.display = "none";
    let lan = "";
    for (let k = 0; k < 16; k++) {
      lan += '<i class="w7ln" style="--x:' + (Math.random() * 94 + 2).toFixed(0) + '%;--s:' + (0.6 + Math.random() * 0.9).toFixed(2) +
        ';--d:-' + (Math.random() * 14).toFixed(1) + 's;--t:' + (11 + Math.random() * 9).toFixed(1) + 's"></i>';
    }
    const f = document.createElement("div");
    f.className = "w7fin";
    f.innerHTML = lan + '<div class="w7glow"></div><div class="w7c">' +
      '<p class="c2date c2in" style="--d:.4s">20 · OCTOBER</p>' +
      '<h1 class="w7h c2in" style="--d:1s">Happy Birthday</h1>' +
      '<div class="w7n c2in" style="--d:1.8s">' + CONFIG.name + '</div>' +
      F7.lines.map((t, i) => '<p class="w7p c2in" style="--d:' + (2.8 + i * 1.3).toFixed(1) + 's">' + t + "</p>").join("") +
      '<p class="w7sg c2in" style="--d:' + (3.2 + F7.lines.length * 1.3).toFixed(1) + 's">' + F7.sign + "</p>" +
      '<div class="w7end" id="en"></div></div>';
    stage.appendChild(f);

    const H = ["❤️", "💖", "💗", "🤍", "✨", "🦋"];
    rain = setInterval(() => {
      const h = document.createElement("b");
      h.className = "w7ht"; h.textContent = H[Math.floor(Math.random() * H.length)];
      h.style.cssText = "left:" + (Math.random() * 100) + "%;font-size:" + (14 + Math.random() * 18) + "px;animation-duration:" + (6 + Math.random() * 5) + "s;--dx:" + ((Math.random() - 0.5) * 80) + "px;--r:" + ((Math.random() - 0.5) * 120) + "deg";
      f.appendChild(h);
      setTimeout(() => h.remove(), 12000);
    }, 420);

    if (typeof confetti === "function") { confetti(); later(confetti, 2500); later(confetti, 6000); }

    later(() => {
      const en = f.querySelector("#en");
      en.innerHTML = '<button class="c2btn c2in" id="cn">Continue 💌</button>';
      en.querySelector("#cn").onclick = () => { clearInterval(rain); f.remove(); sendPage(); };
    }, 3000 + F7.lines.length * 1300 + 4500);
  }

  // ---------- 5. last step: write + WhatsApp + save reaction ----------
  function sendPage() {
    const p = page('<p class="c2date">LAST STEP</p><h2 class="q serif">' + F7.askTitle + '</h2><p class="msg">' + F7.askSub + '</p>' +
      '<textarea class="field c5ta" id="t" rows="4" maxlength="500" placeholder="' + F7.askHint + '"></textarea>' +
      '<div class="w7row"><a class="c2btn" id="wa" target="_blank" rel="noopener">Send on WhatsApp 💬</a></div>' +
      '<button class="c2btn" id="fn">Finish 🤍</button><p class="msg" id="m"></p>');
    const t = p.querySelector("#t"), wa = p.querySelector("#wa"), fn = p.querySelector("#fn"), m = p.querySelector("#m");

    const build = () => {
      let s = "🎂 Happy birthday to me! Here is everything from my surprise:\n";
      if (jarWishes.length) s += "\n✨ Our wishes:\n" + jarWishes.map((w, i) => (i + 1) + ". " + w).join("\n") + "\n";
      if (mineWish) s += "\n💫 My wish for you:\n" + mineWish + "\n";
      const v = t.value.trim();
      if (v) s += "\n💌 What I feel:\n" + v + "\n";
      return s;
    };
    const upd = () => { wa.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(build()); };
    t.oninput = upd; upd();

    // reaction is saved ONCE: when he taps WhatsApp OR Finish, whichever comes first
    let saving = null;
    const save = () => saving || (saving = (async () => {
      if (!(window.REC && REC.active())) return "none";
      m.textContent = "Saving your reaction…";
      const blob = await REC.stop();
      return await REC.send(blob);
    })());
    wa.addEventListener("click", () => { save(); });

    fn.onclick = async () => {
      fn.disabled = true;
      const r = await save();
      m.textContent = r === "uploaded" ? "Your reaction is saved 🤍" : r === "downloaded" ? "Saved on your phone 🤍 Please send that video to me on WhatsApp." : "All done 🤍";
      fn.style.display = "none";
      const b = document.createElement("button");
      b.className = "c2btn"; b.textContent = "Back to the doors 🚪";
      b.onclick = () => { cleanup(); finish(); };
      p.querySelector(".c4in").appendChild(b);
    };
  }

  intro();
};