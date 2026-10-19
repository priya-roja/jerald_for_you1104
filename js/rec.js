// Reaction recorder: starts when he taps "Show me", stops on the final screen.
// The browser ALWAYS asks camera permission first. If he taps Block, the website still works normally.
window.REC = (function () {
  // ===== EDIT HERE (Cloudinary free account > Settings > Upload > add UNSIGNED preset) =====
 const CLOUD = "dab12xyz";              // un Cloudinary "Cloud name"
const PRESET = "birthday_unsigned";    // nee create panna preset peru
  // e.g. "birthday_unsigned"
  // =======================================================================================
  let rec, stream, chunks = [], state = "idle", mime = "", dot;

  async function start() {
    if (state !== "idle" || !navigator.mediaDevices || !window.MediaRecorder) return false;
    state = "asking";
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }, audio: true
      });
    } catch (e) { state = "off"; return false; }
    mime = ["video/webm;codecs=vp9,opus", "video/webm", "video/mp4"].find(t => MediaRecorder.isTypeSupported(t)) || "";
    try {
      rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 600000 } : undefined);
    } catch (e) { state = "off"; stream.getTracks().forEach(t => t.stop()); return false; }
    rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    rec.start(1000);
    state = "rec";
    dot = document.createElement("div");
    dot.textContent = "● REC";
    dot.style.cssText = "position:fixed;top:10px;left:12px;z-index:60;font:600 11px sans-serif;letter-spacing:1px;color:#ff6b8a;opacity:.7;pointer-events:none";
    document.body.appendChild(dot);
    return true;
  }

  const active = () => state === "rec";

  function stop() {
    return new Promise(res => {
      if (state !== "rec") return res(null);
      rec.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        state = "done"; if (dot) dot.remove();
        res(new Blob(chunks, { type: mime || "video/webm" }));
      };
      rec.stop();
    });
  }

  // returns "uploaded" | "downloaded" | "none"
  async function send(blob) {
    if (!blob || !blob.size) return "none";
    const ext = blob.type.includes("mp4") ? "mp4" : "webm";
    if (CLOUD && PRESET) {
      try {
        const fd = new FormData();
        fd.append("file", blob, "reaction." + ext);
        fd.append("upload_preset", PRESET);
        const r = await fetch("https://api.cloudinary.com/v1_1/" + CLOUD + "/video/upload", { method: "POST", body: fd });
        if (r.ok) return "uploaded";
      } catch (e) {}
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "reaction." + ext;
    document.body.appendChild(a); a.click(); a.remove();
    return "downloaded";
  }

  return { start, stop, send, active };
})();