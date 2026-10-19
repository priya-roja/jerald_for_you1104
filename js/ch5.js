// Chapter 4 (door 4): Games Room (quiz + jigsaw + wish jar)
window.RUN = window.RUN || {};

// ===== EDIT HERE =====
const JIGSAW_PHOTO = "assets/photos/johns.jpeg";   // later: "assets/photos/jigsaw.jpeg"
const QUIZ = [
  { q: "What was the very first message you sent me?", o: ["🙄", "Hi", "Hey", "A song"], a: 0, ok: "Yes! That one emoji started everything 🤍" },
  { q: "Where did we meet for the first time?", o: ["Steak Park", "St. John's College", "New Bus Stand, Tirunelveli", "Araikulam (Vinitha akka's house)"], a: 1, ok: "My hands were shaking 😅" },
  { q: "On 1 Jan 2023, around 12:12:30 am, what did you tell me?", o: ["Love you pondati", "Love you chloo", "Love you", "Love you baby"], a: 0, ok: "You remembered 🥹" },
  { q: "When I'm happy, or when I'm buttering you up, what do I call you most of the time?", o: ["Chloo", "Jeraldu", "Thangoo", "Yele"], a: 0, ok: "Chloo it is 🤍" },
  { q: "What is my weight?", o: ["41", "42", "43.5", "42.5"], a: 3, ok: "You know everything 😄" },
  { q: "What is my favourite colour, and have I talked to your UG-time crush?", o: ["Black, no chance", "Black, already talked", "White, will talk in the coming days", "White, no chance"], a: 1, ok: "Yes, I already did 😜" }
];
// =====================

RUN[3] = function (stage, finish, close) {
  let starsHTML = "";
  for (let i = 0; i < 70; i++) {
    const s = (1 + Math.random() * 2).toFixed(1);
    starsHTML += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 70).toFixed(1) + '%;width:' + s + 'px;height:' + s + 'px;animation-delay:' + (Math.random() * 3).toFixed(1) + 's"></i>';
  }
  stage.innerHTML = '<div class="c2bg on"><div class="c2stars">' + starsHTML + '</div><div class="c2moon"></div>' +
    '<svg class="c2hills" viewBox="0 0 1000 200" preserveAspectRatio="none"><path d="M0 130 C120 80 260 150 430 110 C600 70 780 150 1000 95 L1000 200 L0 200 Z" fill="#2b1156" opacity=".85"/><path d="M0 170 C180 130 350 190 540 155 C740 118 880 180 1000 150 L1000 200 L0 200 Z" fill="#150a2e"/></svg></div>' +
    '<div class="c2box" id="c5box"></div><button class="xbtn" id="x">✕</button>';
  const box = stage.querySelector("#c5box");
  let pg = null, timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const cleanup = () => timers.forEach(clearTimeout);
  stage.querySelector("#x").onclick = () => { cleanup(); close(); };

  function page(html) {
    if (pg) pg.remove();
    pg = document.createElement("div"); pg.className = "c4pg";
    pg.innerHTML = '<div class="c4in">' + html + "</div>";
    stage.appendChild(pg); box.style.display = "none";
    return pg;
  }

  // ---- intro
  function intro() {
    box.className = "c2box";
    box.innerHTML = '<div><p class="c2date c2in" style="--d:.2s">CHAPTER 4</p>' +
      '<h2 class="q serif c2in" style="--d:.6s;margin:16px 0 6px">Games Room</h2>' +
      '<p class="msg c2in" style="--d:1.1s">Let\'s see how well you know us 😄</p>' +
      '<button class="c2btn c2in" style="--d:1.8s;margin-top:22px" id="go">Let\'s play</button></div>';
    box.querySelector("#go").onclick = quiz;
  }

  // ---- game 1: quiz
  function quiz() {
    let qi = 0, score = 0;
    const show = () => {
      const Q = QUIZ[qi];
      const p = page('<p class="c2date">QUESTION ' + (qi + 1) + ' / ' + QUIZ.length + '</p><h2 class="q serif">' + Q.q + '</h2>' +
        '<div class="c5opts">' + Q.o.map((t, i) => '<button class="c5opt" data-i="' + i + '">' + t + "</button>").join("") + '</div><p class="msg" id="m"></p>');
      const btns = p.querySelectorAll(".c5opt"), m = p.querySelector("#m");
      btns.forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        btns.forEach(x => x.disabled = true);
        btns[Q.a].classList.add("good");
        if (i === Q.a) { score++; m.textContent = Q.ok || "Yes! 🤍"; }
        else { b.classList.add("bad"); m.textContent = "Not quite 😄 It was: " + Q.o[Q.a]; }
        later(() => { qi++; if (qi < QUIZ.length) show(); else quizEnd(score); }, 1500);
      });
    };
    show();
  }
  function quizEnd(score) {
    const msg = score === QUIZ.length ? "Perfect! You really know us 🥹" : score >= QUIZ.length / 2 ? "Not bad at all 😄" : "Okay, I will remind you everything 😜";
    const p = page('<p class="c2date">YOUR SCORE</p><h2 class="q serif">' + score + " / " + QUIZ.length + '</h2><p class="msg">' + msg + '</p><button class="c2btn" id="nx">Next game →</button>');
    p.querySelector("#nx").onclick = jigsaw;
  }

  // ---- game 2: jigsaw (tap two pieces to swap). Next button shows ONLY after solved
  function jigsaw() {
    const N = 3, TOTAL = N * N;
    let order = Array.from({ length: TOTAL }, (_, i) => i);
    do { order.sort(() => Math.random() - 0.5); } while (order.every((v, i) => v === i));
    let sel = -1, won = false;
    const p = page('<p class="c2date">PUZZLE</p><h2 class="q serif">Put us back together</h2>' +
      '<div class="c5jig" id="jg"></div><p class="msg" id="m">Tap one piece, then another, to swap them</p><button class="c2btn" id="nx" style="display:none">Next game →</button>');
    const jg = p.querySelector("#jg"), m = p.querySelector("#m"), nx = p.querySelector("#nx");
    const draw = () => {
      jg.innerHTML = "";
      order.forEach((pc, pos) => {
        const d = document.createElement("div");
        d.className = "c5pc" + (pos === sel ? " sel" : "");
        d.style.backgroundImage = 'url("' + JIGSAW_PHOTO + '")';
        d.style.backgroundSize = (N * 100) + "% " + (N * 100) + "%";
        d.style.backgroundPosition = ((pc % N) * 100 / (N - 1)) + "% " + (Math.floor(pc / N) * 100 / (N - 1)) + "%";
        d.onclick = () => {
          if (won) return;
          if (sel < 0) sel = pos;
          else {
            if (sel !== pos) { const t = order[sel]; order[sel] = order[pos]; order[pos] = t; }
            sel = -1;
          }
          draw();
          if (order.every((v, i) => v === i)) {
            won = true; m.textContent = "You did it! 🤍"; nx.style.display = "";
            if (typeof confetti === "function") confetti();
          }
        };
        jg.appendChild(d);
      });
    };
    draw();
    nx.onclick = () => { if (won) jar(); };
  }

  // ---- game 3: wish jar (3 wishes, saved for the finale)
  function jar() {
    const NEED = 3;
    let mine = [];
    const p = page('<p class="c2date">WISH JAR</p><h2 class="q serif">Make 3 wishes for us</h2>' +
      '<p class="msg">Write a wish, drop it in the jar, then the next one.</p>' +
      '<textarea class="field c5ta" id="w" rows="3" maxlength="200" placeholder="Wish 1 of ' + NEED + '..."></textarea>' +
      '<button class="c2btn" id="add">Drop it in the jar ✨</button>' +
      '<div class="c5jar"><div class="c5stars" id="st"></div><b id="n"></b></div>' +
      '<p class="msg" id="m"></p>' +
      '<button class="c2btn" id="nx" style="display:none">Open the next door 🚪</button>');
    const w = p.querySelector("#w"), st = p.querySelector("#st"), n = p.querySelector("#n"), m = p.querySelector("#m"),
      nx = p.querySelector("#nx"), add = p.querySelector("#add");
    const count = () => { n.textContent = mine.length + " / " + NEED + " wishes"; };
    count();
    add.onclick = () => {
      const v = w.value.trim(); if (!v || mine.length >= NEED) return;
      mine.push(v);
      try { localStorage.setItem("bd_wishes", JSON.stringify(mine)); } catch (e) {}
      const s = document.createElement("i"); s.textContent = "✨"; s.style.left = (10 + Math.random() * 70) + "%"; st.appendChild(s);
      w.value = ""; count();
      if (mine.length >= NEED) {
        w.disabled = true; add.style.display = "none"; w.style.display = "none";
        m.textContent = "Your wishes are safe in the jar 🤍 We will open it at the very end.";
        nx.style.display = "";
      } else {
        w.placeholder = "Wish " + (mine.length + 1) + " of " + NEED + "...";
      }
    };
    nx.onclick = () => { cleanup(); finish(); };

} 
  intro();
};
