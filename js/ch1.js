// Chapter 1: The Gate (cinematic intro + gate puzzle)
window.RUN = window.RUN || {};
RUN[0] = function (stage, finish, close) {
  const KEY = "bd_gate";
  const CODE = "love you";   // secret code (spaces/capitals don't matter)
  const get = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const set = o => { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} };
  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const stop = () => { timers.forEach(clearTimeout); const c = stage.querySelector(".cine"); if (c) c.remove(); };
  const gate = cls => '<div class="gate ' + (cls || "") + '"><div class="arch"></div><div class="dr dl"></div><div class="dr drr"></div><div class="lock">🔒</div></div>';
  stage.innerHTML = '<button class="xbtn" id="x">✕</button><div id="box"></div>';
  const box = stage.querySelector("#box");
  stage.querySelector("#x").onclick = () => { stop(); close(); };

  function intro() {
    stage.classList.add("film");
    box.innerHTML = "";
    const cine = document.createElement("div"); cine.className = "cine";
    let dust = "";
    for (let k = 0; k < 16; k++) dust += '<i class="dust" style="left:' + Math.random() * 100 + "%;top:" + Math.random() * 100 + "%;--t:" + (6 + Math.random() * 8) + "s;--s:" + (0.6 + Math.random()) + '"></i>';
    cine.innerHTML = '<div class="leak"></div>' + dust + '<div class="grain"></div><div class="scn" id="scn"></div><button class="skip" id="sk">Skip</button>';
    stage.appendChild(cine);
    const scn = cine.querySelector("#scn");
    const S = [
      [5800, '<p>Out of all the people in this world…</p><p class="d2">Somehow, my heart chose <b>you.</b> ❤️</p>'],
      [4400, '<p class="sm">Priya Roja presents…</p><p class="d2">A story filled with memories, laughter, tears, and moments that will always mean something to me.</p>'],
      [6400, '<p class="sm">Starring</p><h1>Jerald Stephen</h1><p class="sm d3">The boy who became an unforgettable part of my life.</p>'],
      [5400, '<h1 class="big">US.</h1><p class="sm d2">Two hearts, countless memories, and a story that isn\'t over yet.</p>'],
      [6000, '<p>Before you enter our little world…</p><p class="d2">Prove that you were truly a part of this story. 🔐❤️</p>']
    ];
    let i = 0;
    const next = () => {
      if (i >= S.length) { stop(); return puzzle(); }
      const sc = S[i++];
      scn.style.transition = "none"; scn.className = "scn"; scn.innerHTML = sc[1];
      void scn.offsetWidth; scn.style.transition = ""; scn.classList.add("on");
      later(() => scn.classList.add("off"), sc[0] - 1000);
      later(next, sc[0]);
    };
    cine.querySelector("#sk").onclick = () => { stop(); puzzle(); };
    later(next, 1600);
  }

  // ---- question (2 chances, then code, then 1 last chance)
  function puzzle() {
    stage.classList.remove("film");
    const s = get();
    if (s.codeNeeded && !s.final) return codeScreen();
    const left = s.final ? 1 : 2 - (s.tries || 0);
    box.innerHTML = gate() + '<p class="q serif">How many times did we meet after you completed your UG?</p><div class="opts">' +
      [5, 4, 3, 6].map(n => '<button class="opt" data-n="' + n + '">' + n + '</button>').join("") +
      '</div><p class="msg" id="m">' + (s.final ? "Last chance 🤍" : "Only someone who was there knows. " + left + " chance" + (left > 1 ? "s" : "") + " left") + "</p>";
    box.querySelectorAll(".opt").forEach(b => b.onclick = () => answer(+b.dataset.n));
  }

  function answer(n) {
    if (n === 4) return correct();
    const s = get(), m = box.querySelector("#m"), g = box.querySelector(".gate");
    g.classList.add("rattle"); setTimeout(() => g.classList.remove("rattle"), 500);
    box.querySelectorAll(".opt").forEach(b => b.disabled = true);
    if (s.final) { m.textContent = "Not quite 💭"; return later(walkIn, 1400); }
    s.tries = (s.tries || 0) + 1;
    if (s.tries >= 2) {
      s.codeNeeded = true; set(s);
      m.textContent = "Oops, both chances are gone 😅"; return later(codeScreen, 1500);
    }
    set(s); m.textContent = "Not quite… think again 💭"; later(puzzle, 1400);
  }

  // ---- secret code to earn one more chance
  function codeScreen() {
    stage.classList.remove("film");
    box.innerHTML = gate() + '<p class="q serif">Say the secret code 🤍</p>' +
      '<p class="msg">Both chances are gone. Tell me the three little words I always say, and you will get one last chance.</p>' +
      '<input class="field" id="sw" placeholder="Secret code" autocomplete="off"><button class="btn" id="go">Unlock</button><p class="msg" id="m"></p>';
    const input = box.querySelector("#sw");
    const check = () => {
      const v = input.value.trim().toLowerCase().replace(/\s+/g, "");
      if (v === CODE.replace(/\s+/g, "")) {
        const s = get(); s.codeNeeded = false; s.final = true; s.tries = 0; set(s);
        box.querySelector("#m").textContent = "Yes, that is it 💕 One last chance…";
        later(puzzle, 1300);
      } else {
        box.querySelector("#m").textContent = "Hmm, that is not it. Think about what I say to you 💭";
      }
    };
    box.querySelector("#go").onclick = check;
    input.onkeydown = e => { if (e.key === "Enter") check(); };
  }

  // ---- gate opens (correct answer)
  function openGate(title, msg) {
  set({}); stop();
    stage.classList.remove("film");
    box.innerHTML = gate() + '<p class="q serif">' + title + '</p><p class="msg">' + msg + '</p><button class="btn" id="ok">Walk in</button>';
    const g = box.querySelector(".gate");
    later(() => g.classList.add("open"), 400);
    later(confetti, 1600);
    box.querySelector("#ok").onclick = finish;
  }
  function correct() {
    openGate("The gate is open", "Four times, and every one was special. Come in, " + CONFIG.name + ".");
  }
  function walkIn() {
    openGate("Okay, I will let you in anyway 🤍", "It was four times, by the way. Come in, " + CONFIG.name + ".");
  }
  intro();
};