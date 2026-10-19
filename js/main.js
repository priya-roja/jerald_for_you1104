// ===== CONFIG: இங்க மட்டும் மாத்தினா போதும் =====
const CONFIG = {
  name: "Jeraldu",            // partner
  fullName: "Jerald Stephen",
  from: "Priya Roja",         // you
  birthday: "2002-10-20",
  age: 24,
  phone: "+919342326388",     // her WhatsApp number
  secret: "forever"
};
const CHAPTERS = [
  {ic:"🌙", t:"The Gate", s:"Gate", items:["Puzzle unlock","Cinematic intro"]},
  {ic:"🎂", t:"Birthday Moment", s:"Birthday Moment", items:["Make a wish (candle)","Balloon pop"]},
  {ic:"📖", t:"Our Story", s:"Our Journey", items:["Our journey","Calendar of Love","Map of memories","Photo reveal"]},
  {ic:"🎮", t:"Games Room", s:"Games", items:["Mini game","Jigsaw puzzle","Wish jar"]},
  {ic:"🌠", t:"Your Wish", s:"Ask me for one", items:["Make a wish to me"]},
  {ic:"💌", t:"Wish Sky", s:"Wishes from people who love you", items:["Video wishes","Letter"]},
  {ic:"🎁", t:"The Grand Finale", s:"Grand Finale", items:["Wishes","Send to her","Reaction"]}
];
let done = [];
if (location.search.includes("reset")) { try { localStorage.clear(); } catch(e){} }
const save = () => { try{ localStorage.setItem("bd_done", JSON.stringify(done)); }catch(e){} };
const $ = id => document.getElementById(id);

// ===== stars =====
const cv = $("sky"), cx = cv.getContext("2d"); let stars = [];
function size(){ cv.width = innerWidth; cv.height = innerHeight;
  stars = Array.from({length:110},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*1.5+.3,p:Math.random()*6.28,v:.01+Math.random()*.02})); }
addEventListener("resize", size); size();
(function draw(t){ cx.clearRect(0,0,cv.width,cv.height);
  stars.forEach(s=>{ s.p+=s.v; cx.globalAlpha=.35+.65*Math.abs(Math.sin(s.p)); cx.fillStyle="#fff3dc"; cx.beginPath(); cx.arc(s.x,s.y,s.r,0,6.28); cx.fill(); });
  requestAnimationFrame(draw); })();

// ===== background music (mp3, loops) =====
// put your song at assets/music/bg.mp3
const bgm = new Audio("assets/music/bg.mp3");
bgm.loop = true; bgm.volume = 0.5;
let playing = false;
function music(on){
  playing = on; $("music").style.opacity = on ? 1 : .5;
  if (on) bgm.play().catch(()=>{}); else bgm.pause();
}
$("music").onclick = () => music(!playing);

// ===== loader: "Show me" button (no camera) =====
const enterButton = $("enter");

if (enterButton) {
  enterButton.onclick = () => {
    music(true);   // must start inside the tap, phones need this
    const loader = $("loader");
    const main = $("main");
    if (loader) loader.classList.add("out");
    if (main) main.hidden = false;
    setTimeout(() => {
      if (loader) loader.style.display = "none";
    }, 1300);
  };
}

// ===== map =====
const unlocked = i => i === 0 || done.includes(i-1);
function render(){
  $("title").textContent = CONFIG.name + ", this world is yours";
  $("hearts").textContent = CHAPTERS.map((_,i)=> done.includes(i) ? "❤️" : "🤍").join("");
  $("count").textContent = done.length + " / " + CHAPTERS.length + " surprises opened";
  $("path").innerHTML = "";
  CHAPTERS.forEach((c,i)=>{
    const b = document.createElement("button");
    const st = done.includes(i) ? "done" : unlocked(i) ? "open" : "locked";
    b.className = "door " + st;
    b.innerHTML = `<span class="ic">${st==="locked"?"🔒":c.ic}</span><span><b>${c.t}</b><small>${st==="locked"?"Open the previous door first":c.s}</small></span>`;
    b.onclick = () => { if(st==="locked"){ b.classList.add("shake"); setTimeout(()=>b.classList.remove("shake"),400); } else (window.RUN && RUN[i] ? startChapter(i) : openPanel(i)); };
    $("path").appendChild(b);
  });
}
function openPanel(i){
  const c = CHAPTERS[i];
  $("sheet").innerHTML = `<h3 class="serif">${c.t}</h3>
    <ul>${c.items.map(x=>`<li>${x}</li>`).join("")}</ul>
    <p class="note">This chapter will be built in the next steps. For now you can test the unlock system.</p>
    <button class="btn" id="fin">${done.includes(i)?"Already completed ✓":"Test: mark chapter as done"}</button>
    <button class="btn ghost" id="cls">Close</button>`;
  $("panel").classList.add("show");
  $("cls").onclick = () => $("panel").classList.remove("show");
  $("fin").onclick = () => { if(!done.includes(i)){ done.push(i); save(); } $("panel").classList.remove("show"); render(); };
}
$("panel").onclick = e => { if(e.target.id==="panel") $("panel").classList.remove("show"); };
render();

// ===== chapter stage =====
function endStage(){ const st=$("stage"); st.classList.remove("show"); st.className=""; st.innerHTML=""; }
function startChapter(i){
  const st=$("stage"); st.innerHTML=""; st.className="show";
  RUN[i](st, ()=>{ if(!done.includes(i)){ done.push(i); save(); } endStage(); render();
    const d = $("path").children[i+1]; if(d){ d.classList.add("fresh"); d.scrollIntoView({behavior:"smooth",block:"center"}); }
  }, endStage);
}
function confetti(){
  const c=document.createElement("canvas"); c.style.cssText="position:fixed;inset:0;width:100%;height:100%;z-index:20;pointer-events:none";
  c.width=innerWidth; c.height=innerHeight; document.body.appendChild(c); const x=c.getContext("2d");
  const cols=["#f3d3a4","#e8b4a0","#ffd9e6","#c9a0ff","#ffffff"];
  const P=Array.from({length:150},()=>({x:Math.random()*c.width,y:-20-Math.random()*c.height*.5,vx:(Math.random()-.5)*3,vy:2+Math.random()*4,s:5+Math.random()*6,r:Math.random()*6,c:cols[Math.random()*5|0]}));
  let f=0; (function loop(){ x.clearRect(0,0,c.width,c.height);
    P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.r+=.1;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);x.restore();});
    if(++f<260) requestAnimationFrame(loop); else c.remove(); })();
}

// ===== front page: lines appear one by one =====
(function () {
  const L = [
    "Hey, you. 🤍",
    "Yes, you.",
    "Someone couldn’t stop thinking about you,<br>so she created a little world of her own—",
    "a world filled with love, little thoughts of you,<br>and all the feelings she couldn’t put into words. 🥹✨"
  ];
  const T = [2200, 2200, 4800, 5200];
  const p = $("ln1"), b = $("enter"); let i = 0;
  function next() {
    if (i >= L.length) { b.classList.add("show"); return; }
    p.classList.remove("in"); void p.offsetWidth;
    p.innerHTML = L[i]; p.classList.add("in");
    const wait = T[i++];
    if (i >= L.length) setTimeout(() => b.classList.add("show"), 2600);
    else setTimeout(next, wait);
  }
  setTimeout(next, 700);
})();

// ===== TEST ONLY: reset button. Shows ONLY when the URL has ?test  (he will never see it) =====
if (location.search.includes("test")) {
  const b = document.createElement("button");
  b.textContent = "↺ Reset everything (testing)";
  b.className = "resetbtn";
  b.onclick = () => { try { localStorage.clear(); } catch (e) {} location.href = location.pathname; };
  $("main").appendChild(b);
}