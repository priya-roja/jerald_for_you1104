// Chapter 6: "Wish Sky"  (RUN[5] = 6th chapter)
// Blocks unlock one by one: a block opens only after the previous block's videos have FINISHED.
window.RUN = window.RUN || {};

// ===================== EDIT HERE =====================
const TEST_MODE = false;      // true = "Skip (test)" button shows. LAUNCH-KU MUNNADI false AAKKU!
const SHOW_LETTER = true;    // letter box after the sky (true = show)
const SHOW_SONGS = false;    // playlist after the letter (true = show)
const V = "assets/video/";

// Intro screen text (label "" aana label maraiyum)
const CHAPTER = {
  label: "CHAPTER 6",
  title: "A Sky Full of Wishes",
  sub: "Look up. Someone left a light for you.",
  btn: "Look up ✨"
};

// 1) Cross - whose wish?
const CROSS = { by: "❤️‍🩹", file: V + "wish.mp4" };

// 2) Friends - 4 floating orbs. Tap in ANY order. All 4 videos must finish to continue.
const FRIENDS = [
  { id: "G", name: "G", file: V + "friend-g.mp4" },
  { id: "J", name: "J", file: V + "friend-j.mp4" },
  { id: "H", name: "H", file: V + "friend-h.mp4" },
  { id: "S", name: "S", file: V + "friend-s.mp4" }
];

// 3) Family - one video
const FAMILY = { by: "Family", file: V + "family.mp4" };

// 4) Heart - add more people here if needed
const HEART = [
  { name: "Mams", file: V + "mams.mp4" },
  { name: "Meow", file: V + "meow.mp4" }
];

// 5) Sisters - one video each, first star then second star
const SISTERS = [
  { name: "Mathu", file: V + "mathu.mp4" },
  { name: "Stella", file: V + "stella.mp4" }
];

// 6) Chitha - last, the "kutty papa wish" title video
const CHITHA = { by: "Chitha", file: V + "chitha.mp4" };

const LETTER_TITLE = "Happy Birthday, Chlooooo! 🎂❤️🫂";
const LETTER = [
  "I know I get angry with you a lot, but that doesn't mean I don't love you, okay? 🥹❤️ I get angry with you, but at the end of the day, I'll come back to you and still do things for you. That doesn't mean I don't love you. I love you more than you think. Sometimes, there are things I don't like, but what can I do? At the end of the day, I still come back to you. Maybe I'm just used to you being a part of my life. Sometimes, that's why I get angry with you. But the truth is, I love you more than you know. 🫶🏻💗",
  "And one more thing, I have no idea of leaving you. Not even a little bit. ❤️‍🩹",
  "I wish you would tell me exactly what you think and feel about me. Sometimes, I feel like you're hiding something inside and saying something else outside. That's why, even when you say something that hurts me, I sometimes feel like you're lying to me. Because you've already done that once before, and it still affects the way I think sometimes. 😔",
  "So please, you can always be honest with me. You don't have to hide anything from me. And I'll never feel jealous of you or anything like that, okay? You can tell me the truth about anything. ❤️",
  "And about what I told you that day, when I said I went to my athai's house and asked you to block me, that wasn't the real reason. I only said that casually. The truth is, I got scared thinking about certain things. So I blocked you, and I put my phone on airplane mode because I was scared that you might try to contact me through someone else. But the next day, I felt really bad about what I had done. 🥺💔",
  "Then we started talking again. That's what I wanted to tell you. When I was trying to explain all this, I just randomly brought up Asha's name.",
  "And listen, I have absolutely no intention of leaving you. I won't leave you, okay? ❤️🫂",
  "Sometimes, I'm scared that one day, even after all the fights, you might do something I really don't like, and we might end up separating because of it. That thought scares me. But then I think about how, even after fighting so much, we talk to each other again the very next day like nothing happened. 😂❤️ So I don't want to keep thinking about things that might never happen.",
  "I just want us to stay together, be happy, and keep talking to each other, even after all our fights. 🥹🫶🏻💗",
  "Love you, Chlooooooooo! ❤️😘🫂",
  "No matter how much we fight, at the end of the day, it's still you. Always you. ❤️♾️"
];
const SONGS = [   // optional: link: "https://..." for a direct song link
  { title: "Song name 1", artist: "Artist", why: "Why this song is us." },
  { title: "Song name 2", artist: "Artist", why: "The one I play when I miss you." },
  { title: "Song name 3", artist: "Artist", why: "Because of that one day." }
];
// =====================================================

RUN[5] = function (stage, finish, close) {
  // ---------- styles (self-contained) ----------
  if (!document.getElementById("w4css2")) {
    const st = document.createElement("style");
    st.id = "w4css2";
    st.textContent = `
.w4pn [hidden],.c4in [hidden],.w4sky[hidden],.w4fin [hidden]{display:none!important}
#x.xbtn{z-index:30}
.w4sky{position:absolute;inset:0;z-index:3;overflow:hidden}
.w4top{position:absolute;top:18px;left:0;right:0;text-align:center;color:#e9d9ff;pointer-events:none;transition:opacity 1s}
.w4dots{display:flex;gap:9px;justify-content:center;margin-bottom:7px}
.w4dots i{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.22);transition:all .8s}
.w4dots i.on{background:#ffe08a;box-shadow:0 0 10px #ffd36a}
.w4top span{font-size:13px;letter-spacing:1px;opacity:.85}
.w4hint{position:absolute;bottom:18px;left:0;right:0;text-align:center;font-size:14px;color:#d9c8ff;opacity:.9;pointer-events:none;padding:0 16px;transition:opacity 1s}
.w4ln{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;transition:opacity 1s}
.w4ln line{stroke:rgba(255,224,138,.55);stroke-width:1.2;stroke-dasharray:2 7;vector-effect:non-scaling-stroke;opacity:0;transition:opacity 1.8s}
.w4ln line.on{opacity:1}
.w4sh{position:absolute;width:90px;height:1.5px;background:linear-gradient(90deg,transparent,#fff);opacity:0;pointer-events:none;animation:w4sh 14s linear infinite}
@keyframes w4sh{0%{opacity:0;transform:translate(0,0) rotate(33deg)}2%{opacity:1}9%{opacity:0;transform:translate(-260px,170px) rotate(33deg)}100%{opacity:0}}
.w4o{position:absolute;transform:translate(-50%,-50%);background:none;border:0;color:#fff;display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;font-family:inherit;transition:opacity 1.4s ease,filter 1s ease}
.w4g{position:relative;width:66px;height:66px;border-radius:50%;display:grid;place-items:center;font-size:30px;background:radial-gradient(circle,rgba(255,226,150,.35),rgba(255,226,150,.04) 70%);box-shadow:0 0 26px rgba(255,214,130,.45)}
.w4o small{font-size:12px;opacity:.85;letter-spacing:1px}
.w4o.lock{opacity:0;pointer-events:none}
.w4o.cur .w4g{animation:w4p 2.2s ease-in-out infinite}
.w4o.done{pointer-events:none;opacity:.7}
.w4o.done .w4g{box-shadow:0 0 14px rgba(255,255,255,.35)}
.w4o.done .w4g::after{content:"✓";position:absolute;right:-4px;bottom:-4px;width:22px;height:22px;border-radius:50%;background:#ffe9a8;color:#3a2b00;font-size:13px;display:grid;place-items:center;font-weight:700}
.w4o.cross .w4g{width:84px;height:84px;font-size:44px;color:#ffe08a;text-shadow:0 0 18px #ffd36a}
.w4o.fin{transition:left 2.6s cubic-bezier(.55,0,.2,1),top 2.6s cubic-bezier(.55,0,.2,1),opacity 1s;opacity:1;pointer-events:none}
.w4o.fin small,.w4o.fin .w4g::after{display:none}
.w4o.fin .w4g{width:46px;height:46px;font-size:22px;animation:none;box-shadow:0 0 22px rgba(255,214,130,.8)}
@keyframes w4p{0%,100%{transform:scale(1);box-shadow:0 0 22px rgba(255,214,130,.4)}50%{transform:scale(1.1);box-shadow:0 0 44px rgba(255,214,130,.85)}}
.w4ov{position:absolute;inset:0;z-index:10;background:rgba(10,4,25,.93);display:flex;align-items:center;justify-content:center;padding:18px;overflow:auto;animation:w4in .5s ease both}
@keyframes w4in{from{opacity:0}to{opacity:1}}
.w4pn{width:100%;max-width:420px;text-align:center;color:#fff}
.w4pn h2{margin:10px 0 18px}
.w4cap{margin:0 0 12px;font-size:16px;color:#f3e6c8;letter-spacing:.5px}
.w4frame{position:relative}
.w4frame video{width:100%;max-height:62vh;border-radius:18px;background:#000;display:block;border:1px solid rgba(255,224,138,.35);box-shadow:0 0 40px rgba(255,200,120,.25)}
.w4big{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:70px;height:70px;border-radius:50%;border:0;font-size:28px;background:rgba(255,255,255,.9);cursor:pointer}
.w4miss{margin:26px 0;font-size:17px}
.w4row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:16px;align-items:center}
.w4back{background:none;border:0;color:#cbb8f5;font-size:14px;cursor:pointer;padding:8px 12px;margin-top:10px;font-family:inherit}
.w4ghost{opacity:.6}
.w4fz{position:relative;height:230px;margin:6px 0 8px}
.w4orb{position:absolute;margin:-34px 0 0 -34px;width:68px;height:68px;border-radius:50%;border:0;font-size:24px;font-weight:700;color:#fff;cursor:pointer;background:radial-gradient(circle at 35% 30%,#b58cff,#5a2fb0);box-shadow:0 0 26px rgba(160,110,255,.65);font-family:inherit;animation:w4fl 4s ease-in-out infinite}
.w4orb.ok{background:radial-gradient(circle at 35% 30%,#ffe9a8,#c9962b);color:#3a2b00;box-shadow:0 0 14px rgba(255,220,140,.5);animation:none}
.w4orb.shake{animation:w4s .45s}
@keyframes w4fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes w4s{0%,100%{transform:translateX(0)}20%{transform:translateX(-9px)}40%{transform:translateX(9px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}
.w4heart{font-size:120px;line-height:1;margin:10px 0 14px;animation:w4hb 1.3s ease-in-out infinite;cursor:pointer;filter:drop-shadow(0 0 24px rgba(255,90,140,.7));transition:transform .6s,opacity .6s}
.w4heart.split{transform:scale(1.7);opacity:0}
.w4heart.glow{filter:drop-shadow(0 0 40px rgba(255,140,180,1))}
@keyframes w4hb{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
.w4bubs{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin:20px 0}
.w4bub{min-width:96px;padding:20px 22px;border-radius:50%;border:0;color:#fff;font-size:17px;font-family:inherit;cursor:pointer;background:radial-gradient(circle at 35% 30%,#ff9ec0,#c2336f);box-shadow:0 0 26px rgba(255,110,160,.6);animation:w4pop .6s ease both}
.w4bub.ok{background:radial-gradient(circle at 35% 30%,#ffe9a8,#c9962b);color:#3a2b00}
@keyframes w4pop{from{transform:scale(.2);opacity:0}to{transform:scale(1);opacity:1}}
.w4sis{display:flex;flex-direction:column;align-items:center;margin:10px 0}
.w4star{background:none;border:0;font-size:56px;cursor:pointer;filter:drop-shadow(0 0 18px rgba(255,225,140,.9));font-family:inherit;color:#fff}
.w4star.lock{opacity:.25;filter:none;pointer-events:none}
.w4star.ok{opacity:.65}
.w4nm{font-size:14px;letter-spacing:1px;color:#f3e6c8}
.w4line{width:2px;height:70px;background:rgba(255,255,255,.25);transition:background 1s,box-shadow 1s;margin:6px 0}
.w4line.lit{background:#ffe08a;box-shadow:0 0 12px #ffd36a}
.w4lp{margin:0 0 16px;text-align:left;line-height:1.75;font-size:16px;opacity:0;animation:w4in 1s ease forwards}
.w4fin{position:absolute;inset:0;z-index:5;pointer-events:none}
.w4hl{position:absolute;left:50%;top:calc(38% + 5.5vmin);transform:translate(-50%,-50%);width:74.8vmin;height:68.2vmin;overflow:visible}
.w4hl path{fill:rgba(255,120,170,0);stroke:#ffe08a;stroke-width:.18;stroke-linecap:round;stroke-dasharray:100;stroke-dashoffset:100;filter:drop-shadow(0 0 3px #ffd36a);animation:w4d 3s 2.6s ease forwards,w4f 1.6s 5.4s ease forwards}
@keyframes w4d{to{stroke-dashoffset:0}}
@keyframes w4f{to{fill:rgba(255,120,170,.28)}}
.w4ft{position:absolute;left:0;right:0;bottom:5%;text-align:center;padding:0 16px;pointer-events:auto}
.w4ft h2{margin:0 0 14px}
@media (prefers-reduced-motion:reduce){.w4o.cur .w4g,.w4heart,.w4orb,.w4sh{animation:none}}
`;
    document.head.appendChild(st);
  }

  // ---------- base layout ----------
  let starsHTML = "";
  for (let i = 0; i < 70; i++) {
    const s = (1 + Math.random() * 2).toFixed(1);
    starsHTML += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 70).toFixed(1) + '%;width:' + s + 'px;height:' + s + 'px;animation-delay:' + (Math.random() * 3).toFixed(1) + 's"></i>';
  }
  stage.innerHTML = '<div class="c2bg on"><div class="c2stars">' + starsHTML + '</div><div class="c2moon"></div>' +
    '<svg class="c2hills" viewBox="0 0 1000 200" preserveAspectRatio="none"><path d="M0 130 C120 80 260 150 430 110 C600 70 780 150 1000 95 L1000 200 L0 200 Z" fill="#2b1156" opacity=".85"/><path d="M0 170 C180 130 350 190 540 155 C740 118 880 180 1000 150 L1000 200 L0 200 Z" fill="#150a2e"/></svg></div>' +
    '<div class="c2box" id="c4box"></div><div class="w4sky" id="sky" hidden></div><button class="xbtn" id="x">✕</button>';

  const box = stage.querySelector("#c4box");
  const sky = stage.querySelector("#sky");
  let pg = null, typer, timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
let resumeWanted = false;
const pauseMusic = () => { try { if (typeof playing !== "undefined" && playing && typeof music === "function") { music(false); resumeWanted = true; } } catch (e) {} };
const resumeMusic = () => { try { if (resumeWanted && typeof music === "function") { resumeWanted = false; music(true); } } catch (e) {} };
const cleanup = () => {
  clearInterval(typer); timers.forEach(clearTimeout);
  stage.querySelectorAll("video").forEach(v => { try { v.pause(); } catch (e) {} });
  resumeMusic();
};
  stage.querySelector("#x").onclick = () => { cleanup(); close(); };

  // ---------- overlay + video player ----------
  function overlay(html) {
    const o = document.createElement("div");
    o.className = "w4ov";
    o.innerHTML = html;
    stage.appendChild(o);
    const bk = o.querySelector("#bk");
    if (bk) bk.onclick = () => o.remove();
    return o;
  }

  // Counts as "watched" ONLY when the video ends (or test skip / file missing)
  function playVideo(file, caption, onDone) {
    pauseMusic();
    const o = overlay('<div class="w4pn"><p class="w4cap serif">' + caption + '</p>' +
      '<div class="w4frame"><video playsinline preload="metadata" src="' + file + '"></video><button class="w4big" hidden>▶</button></div>' +
      '<p class="w4miss" hidden>Video coming soon 🤍</p>' +
      '<div class="w4row"><button class="c2btn" id="vc" hidden>Continue 🤍</button>' +
      (TEST_MODE ? '<button class="c2btn w4ghost" id="vs">Skip (test)</button>' : "") +
      '</div><button class="w4back" id="vb">← Back</button></div>');
    const v = o.querySelector("video"), big = o.querySelector(".w4big"), miss = o.querySelector(".w4miss");
    const vc = o.querySelector("#vc"), vs = o.querySelector("#vs");
    let finished = false;
const complete = () => { try { v.pause(); } catch (e) {} o.remove(); resumeMusic(); onDone(); };
    const ready = () => { finished = true; vc.hidden = false; if (vs) vs.hidden = true; };
    v.onclick = () => { if (v.paused) v.play().catch(() => {}); else v.pause(); };
    big.onclick = () => { big.hidden = true; v.play().catch(() => { big.hidden = false; }); };
    v.addEventListener("play", () => { big.hidden = true; });
    v.addEventListener("ended", ready);
    v.addEventListener("error", () => { v.style.display = "none"; big.hidden = true; miss.hidden = false; ready(); });
    vc.onclick = complete;
    if (vs) vs.onclick = complete;
o.querySelector("#vb").onclick = () => { try { v.pause(); } catch (e) {} o.remove(); resumeMusic(); };
    v.play().catch(() => { if (!finished) big.hidden = false; });
  }

  // ---------- state ----------
  let idx = 0;
  const fDone = new Set(), hDone = new Set();
  let hSplit = false, sStep = 0;

  function completeBlock(i) {
    idx = i + 1;
    refresh();
    if (idx >= blocks.length) later(finale, 1300);
  }

  // ---------- block panels ----------
  const FPOS = [[20, 28], [78, 18], [26, 78], [80, 72]];

  function friendsPanel(i) {
    const o = overlay('<div class="w4pn"><p class="c2date">FRIENDS</p><h2 class="q serif">Tap each one</h2><div class="w4fz" id="fo"></div><p class="msg" id="fm"></p><button class="w4back" id="bk">← Back</button></div>');
    const fo = o.querySelector("#fo"), fm = o.querySelector("#fm");
    function draw() {
      fo.innerHTML = FRIENDS.map((f, k) => {
        const p = FPOS[k % FPOS.length], ok = fDone.has(f.id);
        return '<button class="w4orb' + (ok ? " ok" : "") + '" data-id="' + f.id + '" style="left:' + p[0] + '%;top:' + p[1] + '%;animation-delay:-' + (k * 0.9) + 's">' + (ok ? "✓" : f.id) + "</button>";
      }).join("");
      fm.textContent = fDone.size + " / " + FRIENDS.length;
      fo.querySelectorAll(".w4orb").forEach(b => {
        b.onclick = () => {
          const f = FRIENDS.find(x => x.id === b.dataset.id);
          if (fDone.has(f.id)) return;
          playVideo(f.file, "Wish from " + f.name, () => {
            fDone.add(f.id);
            if (fDone.size >= FRIENDS.length) { o.remove(); completeBlock(i); } else draw();
          });
        };
      });
    }
    draw();
  }

  function heartPanel(i) {
    const o = overlay('<div class="w4pn"><div class="w4heart" id="hh">❤️</div><div class="w4bubs" id="hb" hidden></div><p class="msg" id="hm">Tap the heart</p>' +
      '<button class="c2btn" id="hc" hidden>Continue 🤍</button><button class="w4back" id="bk">← Back</button></div>');
    const hh = o.querySelector("#hh"), hb = o.querySelector("#hb"), hm = o.querySelector("#hm"), hc = o.querySelector("#hc");
    function bubbles() {
      hh.hidden = true; hb.hidden = false; hm.textContent = "Tap a name";
      hb.innerHTML = HEART.map((p, k) => '<button class="w4bub' + (hDone.has(k) ? " ok" : "") + '" data-k="' + k + '">' + (hDone.has(k) ? "✓ " : "") + p.name + "</button>").join("");
      hb.querySelectorAll(".w4bub").forEach(b => {
        b.onclick = () => {
          const k = +b.dataset.k;
          if (hDone.has(k)) return;
          playVideo(HEART[k].file, "Wish from " + HEART[k].name, () => {
            hDone.add(k);
            if (hDone.size >= HEART.length) allDone(); else bubbles();
          });
        };
      });
    }
    function allDone() {
      hb.hidden = true; hh.hidden = false; hh.className = "w4heart glow"; hh.onclick = null;
      hm.textContent = "Full of love 🤍"; hc.hidden = false;
    }
    hc.onclick = () => { o.remove(); completeBlock(i); };
    if (hDone.size >= HEART.length) { allDone(); }
    else if (hSplit) { bubbles(); }
    else {
      hh.onclick = () => { hSplit = true; hh.classList.add("split"); hh.onclick = null; later(bubbles, 600); };
    }
  }

  const sDone = new Set();
  function sisterPanel(i) {
    const o = overlay('<div class="w4pn"><p class="c2date">SISTERS</p><div class="w4sis">' +
      '<button class="w4star">🌠</button><span class="w4nm">' + SISTERS[0].name + '</span>' +
      '<div class="w4line" id="sl"></div>' +
      '<button class="w4star">🌠</button><span class="w4nm">' + SISTERS[1].name + '</span></div>' +
      '<p class="msg" id="sm"></p><button class="w4back" id="bk">← Back</button></div>');
    const st = o.querySelectorAll(".w4star"), sl = o.querySelector("#sl"), sm = o.querySelector("#sm");
    function draw() {
      st.forEach((b, k) => { b.className = "w4star" + (sDone.has(k) ? " ok" : ""); });
      sl.className = "w4line" + (sDone.size >= 2 ? " lit" : "");
      sm.textContent = sDone.size + " / 2";
    }
    st.forEach((b, k) => {
      b.onclick = () => {
        if (sDone.has(k)) return;
        playVideo(SISTERS[k].file, "Wish from " + SISTERS[k].name, () => {
          sDone.add(k);
          if (sDone.size >= 2) { o.remove(); completeBlock(i); } else draw();
        });
      };
    });
    draw();
  }

  const single = (i, item, label) => () => playVideo(item.file, label, () => completeBlock(i));

  // ---------- blocks (order = unlock order) ----------
  const blocks = [
    { cls: " cross", glyph: "\u271D\uFE0E", label: "", x: 50, y: 20, hint: "Tap the glowing cross", open: () => single(0, CROSS, "A wish for you · " + CROSS.by)() },
    { glyph: "🫂", label: "Friends", x: 20, y: 36, hint: "Your friends are waiting", open: () => friendsPanel(1) },
    { glyph: "🏮", label: "Family", x: 80, y: 36, hint: "A light from home", open: () => single(2, FAMILY, "Wish from " + FAMILY.by)() },
    { glyph: "❤️", label: "", x: 50, y: 54, hint: "Tap the beating heart", open: () => heartPanel(3) },
    { glyph: "🌠", label: SISTERS[0].name + " & " + SISTERS[1].name, x: 24, y: 71, hint: "Two stars, one line", open: () => sisterPanel(4) },
    { glyph: "🌙", label: CHITHA.by, x: 76, y: 71, hint: "The last one. Saved for the end.", open: () => single(5, CHITHA, "Wish from " + CHITHA.by)() }
  ];

  let els = [], lns = [], topEl, hintEl, lnEl;
  function buildSky() {
    box.style.display = "none"; sky.hidden = false;
    let sh = "";
    [[78, 8, 2], [92, 30, 7], [60, 4, 11]].forEach(a => { sh += '<i class="w4sh" style="left:' + a[0] + '%;top:' + a[1] + '%;animation-delay:' + a[2] + 's"></i>'; });
    let ls = "";
    for (let k = 0; k < blocks.length - 1; k++) {
      ls += '<line x1="' + blocks[k].x + '" y1="' + blocks[k].y + '" x2="' + blocks[k + 1].x + '" y2="' + blocks[k + 1].y + '"/>';
    }
    sky.innerHTML = sh + '<svg class="w4ln" id="ln" viewBox="0 0 100 100" preserveAspectRatio="none">' + ls + '</svg>' +
      '<div class="w4top" id="tp"></div><div class="w4hint" id="ht"></div>';
    topEl = sky.querySelector("#tp"); hintEl = sky.querySelector("#ht"); lnEl = sky.querySelector("#ln");
    lns = Array.from(lnEl.querySelectorAll("line"));
    els = blocks.map((b, k) => {
      const el = document.createElement("button");
      el.style.left = b.x + "%"; el.style.top = b.y + "%";
      el.innerHTML = '<div class="w4g">' + b.glyph + "</div>" + (b.label ? "<small>" + b.label + "</small>" : "");
      el.onclick = () => { if (k === idx) b.open(); };
      sky.appendChild(el);
      return el;
    });
    refresh();
  }

  function refresh() {
    els.forEach((el, k) => {
      el.className = "w4o" + (blocks[k].cls || "") + (k > idx ? " lock" : k < idx ? " done" : " cur");
    });
    lns.forEach((l, k) => l.classList.toggle("on", k < idx));
    const n = Math.min(idx, blocks.length);
    topEl.innerHTML = '<div class="w4dots">' + blocks.map((b, k) => '<i class="' + (k < n ? "on" : "") + '"></i>').join("") + "</div><span>" + n + " / " + blocks.length + " wishes</span>";
    hintEl.textContent = idx < blocks.length ? blocks[idx].hint : "";
  }

  // ---------- finale: the stars fly into a heart and connect ----------
  const U = 2.2; // heart size unit (vmin)
  const hx = t => 16 * Math.pow(Math.sin(t), 3);
  const hy = t => 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

  function finale() {
    topEl.style.opacity = 0; hintEl.style.opacity = 0; lnEl.style.opacity = 0;
    const n = blocks.length;
    els.forEach((el, k) => {
      const t = (k / n) * 2 * Math.PI;
      el.classList.add("fin");
      el.style.left = "calc(50% + " + (hx(t) * U).toFixed(2) + "vmin)";
      el.style.top = "calc(38% + " + (-hy(t) * U).toFixed(2) + "vmin)";
    });
    let d = "";
    for (let i = 0; i <= 90; i++) {
      const t = (i / 90) * 2 * Math.PI;
      d += (i ? "L" : "M") + hx(t).toFixed(2) + " " + (-hy(t)).toFixed(2);
    }
    const nextLabel = SHOW_LETTER ? "Open the letter 💌" : SHOW_SONGS ? "One more thing…" : "Open the next door 🚪";
    const f = document.createElement("div");
    f.className = "w4fin";
    f.innerHTML = '<svg class="w4hl" viewBox="-17 -13 34 31"><path pathLength="100" d="' + d + 'Z"/></svg>' +
      '<div class="w4ft"><h2 class="q serif c2in" style="--d:5.4s">These are the people who love you 🤍</h2>' +
      '<button class="c2btn c2in" style="--d:6.2s" id="fc">' + nextLabel + "</button></div>";
    sky.appendChild(f);
    f.querySelector("#fc").onclick = () => { f.remove(); sky.hidden = true; after("sky"); };
  }

  function after(from) {
    if (from === "sky" && SHOW_LETTER) return letter();
    if (from !== "songs" && SHOW_SONGS) return songs();
    cleanup(); finish();
  }

  // ---------- page helper (letter / playlist) ----------
  function page(html) {
    if (pg) pg.remove();
    pg = document.createElement("div"); pg.className = "c4pg";
    pg.innerHTML = '<div class="c4in">' + html + "</div>";
    stage.appendChild(pg); box.style.display = "none";
    return pg;
  }

  function letter() {
    const p = page('<p class="c2date">A LETTER FOR YOU</p><h2 class="q serif">One more thing…</h2>' +
      '<div class="c4env" id="env"><span>💌</span></div><p class="msg">Tap the envelope to open it</p>');
    p.querySelector("#env").onclick = () => {
      p.querySelector(".c4in").innerHTML = '<div class="c4paper"><h3 class="c3t">' + LETTER_TITLE + "</h3>" +
        LETTER.map((t, k) => '<p class="w4lp" style="animation-delay:' + (0.4 + k * 0.7).toFixed(1) + 's">' + t + "</p>").join("") +
        '</div><button class="c2btn" id="nx">' + (SHOW_SONGS ? "Continue →" : "Open the next door 🚪") + "</button>";
      p.scrollTop = 0;
      p.querySelector("#nx").onclick = () => { after("letter"); };
    };
  }

  function songs() {
    const list = SONGS.map((s, i) =>
      '<div class="c4card"><div class="c4rel">SONG ' + (i + 1) + '</div><h3 class="c3t">' + s.title + '</h3><p class="c3p">' + s.artist + "</p>" +
      (s.why ? '<p class="c3p">' + s.why + "</p>" : "") +
      '<a class="c2btn c4a" target="_blank" rel="noopener" href="' + (s.link || "https://www.youtube.com/results?search_query=" + encodeURIComponent(s.title + " " + s.artist)) + '">▶ Listen</a></div>').join("");
    const p = page('<p class="c2date">OUR PLAYLIST</p><h2 class="q serif">Songs that sound like you</h2>' + list + '<button class="c2btn" id="nx">Open the next door 🚪</button>');
    p.querySelector("#nx").onclick = () => { cleanup(); finish(); };
  }

  // ---------- intro ----------
  box.className = "c2box";
  box.innerHTML = '<div>' + (CHAPTER.label ? '<p class="c2date c2in" style="--d:.2s">' + CHAPTER.label + "</p>" : "") +
    '<h2 class="q serif c2in" style="--d:.6s;margin:16px 0 6px">' + CHAPTER.title + "</h2>" +
    '<p class="msg c2in" style="--d:1.1s">' + CHAPTER.sub + "</p>" +
    '<button class="c2btn c2in" style="--d:1.8s;margin-top:22px" id="go">' + CHAPTER.btn + "</button></div>";
  box.querySelector("#go").onclick = buildSky;
};