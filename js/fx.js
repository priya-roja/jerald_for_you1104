// Floating hearts, shooting stars, tap sparkles
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const fx = document.getElementById("fx");
  const icons = ["💗", "💖", "✨", "🌸", "💕"];
  function heart() {
    const e = document.createElement("span"); e.className = "fh";
    e.textContent = icons[Math.random() * icons.length | 0];
    e.style.left = Math.random() * 100 + "%";
    e.style.fontSize = 12 + Math.random() * 16 + "px";
    e.style.setProperty("--dx", (Math.random() * 80 - 40) + "px");
    e.style.setProperty("--rot", (Math.random() * 60 - 30) + "deg");
    e.style.animationDuration = 9 + Math.random() * 7 + "s";
    fx.appendChild(e); setTimeout(() => e.remove(), 17000);
  }
  function star() {
    const s = document.createElement("div"); s.className = "shoot";
    s.style.left = 40 + Math.random() * 55 + "%"; s.style.top = Math.random() * 35 + "%";
    fx.appendChild(s); setTimeout(() => s.remove(), 1500);
  }
  setInterval(heart, 1800); setInterval(star, 6000);
  addEventListener("pointerdown", e => {
    for (let i = 0; i < 7; i++) {
      const s = document.createElement("span"); s.className = "spark"; s.textContent = "✦";
      s.style.left = e.clientX + "px"; s.style.top = e.clientY + "px"; s.style.color = i % 2 ? "#f7d9a8" : "#ff8fb3";
      const a = Math.random() * 6.28, d = 30 + Math.random() * 40;
      s.style.setProperty("--sx", Math.cos(a) * d + "px"); s.style.setProperty("--sy", Math.sin(a) * d + "px");
      document.body.appendChild(s); setTimeout(() => s.remove(), 850);
    }
  });
})();