// Chapter 5 (door 5): Your Wish (he asks me for one wish)
window.RUN = window.RUN || {};

RUN[4] = function (stage, finish, close) {
  let starsHTML = "";
  for (let i = 0; i < 70; i++) {
    const s = (1 + Math.random() * 2).toFixed(1);
    starsHTML += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 70).toFixed(1) + '%;width:' + s + 'px;height:' + s + 'px;animation-delay:' + (Math.random() * 3).toFixed(1) + 's"></i>';
  }
  stage.innerHTML = '<div class="c2bg on"><div class="c2stars">' + starsHTML + '</div><div class="c2moon"></div>' +
    '<svg class="c2hills" viewBox="0 0 1000 200" preserveAspectRatio="none"><path d="M0 130 C120 80 260 150 430 110 C600 70 780 150 1000 95 L1000 200 L0 200 Z" fill="#2b1156" opacity=".85"/><path d="M0 170 C180 130 350 190 540 155 C740 118 880 180 1000 150 L1000 200 L0 200 Z" fill="#150a2e"/></svg></div>' +
    '<div class="c2box" id="c6box"></div><button class="xbtn" id="x">✕</button>';
  const box = stage.querySelector("#c6box");
  let pg = null;
  stage.querySelector("#x").onclick = () => close();

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
    box.innerHTML = '<div><p class="c2date c2in" style="--d:.2s">CHAPTER 5</p>' +
      '<h2 class="q serif c2in" style="--d:.6s;margin:16px 0 6px">Your Wish</h2>' +
      '<p class="msg c2in" style="--d:1.1s">Now it\'s your turn to ask me for something.</p>' +
      '<button class="c2btn c2in" style="--d:1.8s;margin-top:22px" id="go">Begin</button></div>';
    box.querySelector("#go").onclick = wishMe;
  }

  // ---- make a wish to me: ask line -> he types -> "saved" replaces the ask line -> next door
  function wishMe() {
    const p = page('<p class="c2date">ONE WISH</p><h2 class="q serif">Make a wish to me</h2>' +
      '<p class="msg" id="m">Ask me for one thing. I will try my very best to make it come true 🤍</p>' +
      '<textarea class="field c5ta" id="t" rows="4" maxlength="300" placeholder="I wish you would..."></textarea>' +
      '<button class="c2btn" id="snd">Send my wish 💫</button>' +
      '<button class="c2btn" id="nx" style="display:none">Open the next door 🚪</button>');
    const t = p.querySelector("#t"), m = p.querySelector("#m"), snd = p.querySelector("#snd"), nx = p.querySelector("#nx");
    snd.onclick = () => {
      const v = t.value.trim();
      if (!v) { t.focus(); return; }
      try { localStorage.setItem("bd_wishme", v); } catch (e) {}
      t.style.display = "none"; snd.style.display = "none";
      m.textContent = "Your wish is saved 🤍 You will send it to me at the end.";
      nx.style.display = "";
      if (typeof confetti === "function") confetti();
    };
    nx.onclick = () => finish();
  }

  intro();
};