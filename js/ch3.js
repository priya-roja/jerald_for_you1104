// Chapter 3: Our Story  (timeline + love counter + memory map with photos)
window.RUN = window.RUN || {};

// ===== EDIT HERE: your story data =====
const LOVE_START = new Date("2023-01-01T00:00:00");   // love started
const TALK_START = new Date("2022-11-06T00:00:00");   // started talking
const LOVE_TXT = "1 January 2023";
const STORY = [
  { date: "6 NOV 2022", title: "The first message",
    chat: [{ who: "him", text: "🙄" }, { who: "her", text: "enachi bro" }],
    text: "A single emoji on Instagram. That's how it began." },
  { date: "1 JAN 2023", title: "The day we became us", heart: true,
    text: "Nobody had said it out loud. We both just knew. Then you called me your pondati and said “love you”. That was all, and I didn't say a word." }
];
// Memories on the map: photo + your sentence show when the pin is tapped
const PLACES = [
  { tag: "MEMORY 1", title: "The first photo we took together.", name: "St. John's College", lat: 8.7209, lng: 77.7453, photo: "assets/photos/johns.jpeg",
    text: "I was so nervous standing next to you that my hands and legs were shaking." },
  { tag: "MEMORY 2", title: "The bike ride", name: "Steam park", lat: 8.7136, lng: 77.7567, photo: "assets/photos/steak.jpeg",   // TODO: exact Steak Park position
    text: "We went on a bike ride together, and then you put your hand on my shoulder. I was scared, and so, so happy." },
  { tag: "MEMORY 3", title: "Feeling like us", name: "Araikulam", lat: 8.7044, lng: 77.7137, photo: "assets/photos/araikulam.jpeg",
    text: "Even when you touched me, I wasn't scared this time. It just felt normal. And when we took a photo with that little baby, it felt like she was ours." }
  // MEMORY 4 goes here (copy one block above, add a comma before it)
];
// ======================================

RUN[2] = function (stage, finish, close) {
  let starsHTML = "";
  for (let i = 0; i < 70; i++) {
    const s = (1 + Math.random() * 2).toFixed(1);
    starsHTML += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 70).toFixed(1) + '%;width:' + s + 'px;height:' + s + 'px;animation-delay:' + (Math.random() * 3).toFixed(1) + 's"></i>';
  }
  stage.innerHTML = '<div class="c2bg on"><div class="c2stars">' + starsHTML + '</div><div class="c2moon"></div>' +
    '<svg class="c2hills" viewBox="0 0 1000 200" preserveAspectRatio="none"><path d="M0 130 C120 80 260 150 430 110 C600 70 780 150 1000 95 L1000 200 L0 200 Z" fill="#2b1156" opacity=".85"/><path d="M0 170 C180 130 350 190 540 155 C740 118 880 180 1000 150 L1000 200 L0 200 Z" fill="#150a2e"/></svg></div>' +
    '<div class="c2box" id="c3box"></div><button class="xbtn" id="x">✕</button>';
  const box = stage.querySelector("#c3box");
  const MY = String(CONFIG.from || "Priya").split(" ")[0];
  let ticker, io, mapObj, timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  const cleanup = () => {
    clearInterval(ticker); if (io) io.disconnect(); timers.forEach(clearTimeout);
    if (mapObj) { try { mapObj.remove(); } catch (e) {} mapObj = null; }
  };
  stage.querySelector("#x").onclick = () => { cleanup(); close(); };

  // ---- intro
  function intro() {
    box.className = "c2box";
    box.innerHTML = '<div><p class="c2date c2in" style="--d:.2s">CHAPTER 3</p>' +
      '<h2 class="q serif c2in" style="--d:.6s;margin:16px 0 6px">Our Story</h2>' +
      '<p class="msg c2in" style="--d:1.1s">It started with a single emoji.</p>' +
      '<button class="c2btn c2in" style="--d:1.8s;margin-top:22px" id="go">Begin</button></div>';
    box.querySelector("#go").onclick = timeline;
  }

  // ---- timeline + love counter
  function timeline() {
    const items = STORY.map(e =>
      '<div class="c3it"><span class="c3dot' + (e.heart ? " heart" : "") + '"></span><div class="c3card">' +
      (e.date ? '<div class="c3date">' + e.date + "</div>" : "") +
      '<h3 class="c3t">' + e.title + "</h3>" +
      (e.chat ? '<div class="c3chat">' + e.chat.map(m => '<div class="c3b ' + m.who + '"><div class="c3who">' + (m.who === "him" ? CONFIG.name : MY) + "</div>" + m.text + "</div>").join("") + "</div>" : "") +
      (e.text ? '<p class="c3p">' + e.text + "</p>" : "") + "</div></div>").join("");
    const love = '<div class="c3it"><span class="c3dot heart"></span><div class="c3card c3love">' +
      '<div class="c3date">SINCE ' + LOVE_TXT.toUpperCase() + '</div><h3 class="c3t">And we are still counting 🤍</h3>' +
      '<div class="c3grid"><div class="c3u"><b id="cd">0</b><span>days</span></div><div class="c3u"><b id="ch">0</b><span>hours</span></div>' +
      '<div class="c3u"><b id="cm">0</b><span>minutes</span></div><div class="c3u"><b id="cs">0</b><span>seconds</span></div></div>' +
      '<p class="c3p c3talk" id="ct"></p></div></div>';
    box.className = "c3tl"; box.scrollTop = 0;
    box.innerHTML = '<div class="c3rail"><p class="c3hint">Scroll slowly ↓</p>' + items + love + "</div>" +
      '<div class="c3end c3it"><button class="c2btn" id="nx">Continue →</button></div>';

    const upd = () => {
      const now = Date.now(), d = Math.max(0, now - LOVE_START.getTime());
      box.querySelector("#cd").textContent = Math.floor(d / 864e5);
      box.querySelector("#ch").textContent = Math.floor(d / 36e5) % 24;
      box.querySelector("#cm").textContent = Math.floor(d / 6e4) % 60;
      box.querySelector("#cs").textContent = Math.floor(d / 1e3) % 60;
      box.querySelector("#ct").textContent = "Talking to each other for " + Math.floor((now - TALK_START.getTime()) / 864e5) + " days";
    };
    upd(); ticker = setInterval(upd, 1000);

    const its = box.querySelectorAll(".c3it");
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } }), { root: box, threshold: 0.2 });
      its.forEach(it => io.observe(it));
    } else its.forEach(it => it.classList.add("on"));
    box.querySelector("#nx").onclick = mapScene;
  }

  // ---- memory map (tap a pin: photo + your sentence)
  function mapScene() {
    clearInterval(ticker); if (io) io.disconnect();
    const seen = new Set(), markers = [];
    box.className = "c3stage"; box.scrollTop = 0;
    box.innerHTML = '<div class="c3map" id="c3map"></div><div class="c3hud" id="hud"></div><div class="c3go" id="go2"></div><div class="c3mod" id="mod"></div>';
    const hud = box.querySelector("#hud"), go = box.querySelector("#go2"), mod = box.querySelector("#mod"), el = box.querySelector("#c3map");
    const bounds = window.L ? L.latLngBounds(PLACES.map(p => [p.lat, p.lng])) : null;

    const upd = () => {
      if (seen.size < PLACES.length) hud.innerHTML = "Tap the glowing places <b>" + seen.size + " / " + PLACES.length + "</b>";
      else {
        hud.innerHTML = "You found all our memories 🤍";
        go.innerHTML = '<button class="c2btn c2in" id="nxt">Open the next door 🚪</button>';
        go.querySelector("#nxt").onclick = () => { cleanup(); finish(); };
      }
    };
    const markDone = i => {
      const m = markers[i], e = m && m.getElement();
      if (e) { e.classList.add("done"); const b = e.querySelector("b"); if (b) b.textContent = "✓"; }
    };

    function openPlace(i) {
      const p = PLACES[i];
      mod.innerHTML = '<div class="c3sheet"><div class="c3date">' + p.tag + '</div><h3 class="c3t">' + p.title + '</h3>' +
        '<div class="c3plc">📍 ' + p.name + '</div>' +
        '<img class="c3mpic" alt="" src="' + p.photo + '" onerror="this.style.display=\'none\'">' +
        '<p class="c3p">' + p.text + '</p><button class="c2btn" id="cl">Close</button></div>';
      mod.classList.add("on");
      if (!seen.has(i)) { seen.add(i); markDone(i); upd(); }
      mod.querySelector("#cl").onclick = () => {
        mod.classList.remove("on");
        if (mapObj && bounds) mapObj.flyToBounds(bounds, { padding: [70, 70], duration: 0.8 });
      };
    }

    if (window.L) {
      mapObj = L.map(el, { zoomControl: false });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, className: "c3tiles", attribution: "© OpenStreetMap contributors" }).addTo(mapObj);
      mapObj.fitBounds(bounds, { padding: [70, 70] });
      PLACES.forEach((p, i) => {
        const m = L.marker([p.lat, p.lng], { icon: L.divIcon({ className: "c3pin", html: '<div class="c3pinin"><i></i><b>📷</b></div>', iconSize: [44, 44], iconAnchor: [22, 22] }) }).addTo(mapObj);
        m.bindTooltip(p.name, { permanent: true, direction: "bottom", offset: [0, 18], className: "c3tip" });
        m.on("click", () => { mapObj.flyTo([p.lat, p.lng], 15, { duration: 0.9 }); later(() => openPlace(i), 900); });
        markers.push(m);
      });
      later(() => { if (mapObj) { mapObj.invalidateSize(); mapObj.fitBounds(bounds, { padding: [70, 70] }); } }, 250);
    } else {
      el.className = "c3fb";
      el.innerHTML = "<p>The map could not load, but the memories are still here 🤍</p>" + PLACES.map((p, i) => '<button class="c2btn" data-i="' + i + '">📍 ' + p.name + "</button>").join("");
      el.querySelectorAll("button").forEach(b => b.onclick = () => openPlace(+b.dataset.i));
    }
    upd();
  }

  intro();
};