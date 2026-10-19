// Reaction recorder: starts when he taps "Show me", stops on the final screen.
// The browser ALWAYS asks camera permission first.
window.REC = (function () {
  // ===== EDIT HERE (Cloudinary: Cloud name + UNSIGNED upload preset name) =====
  const CLOUD = "";    // e.g. "dxxxxxxx"
  const PRESET = "";   // e.g. "birthday_unsigned"
  // ===========================================================================
  let rec, stream, chunks = [], state = "idle", mime = "", dot, lastErr = "";

  const gum = c => navigator.mediaDevices.getUserMedia(c);

  async function start() {
    if (state === "rec") return true;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { lastErr = "NoMediaDevices (needs https + Chrome/Safari)"; return false; }
    if (!window.MediaRecorder) { lastErr = "NoMediaRecorder"; return false; }
    state = "asking";
    try {
      // 1) camera + mic, 2) if that fails for a non-permission reason, camera only
      try {
        stream = await gum({ video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }, audio: true });
      } catch (e1) {
        if (e1 && (e1.name === "NotAllowedError" || e1.name === "SecurityError")) throw e1;
        stream = await gum({ video: true });
      }
      const types = ["video/webm;codecs=vp9,opus", "video/webm", "video/mp4"];
      mime = types.find(t => MediaRecorder.isTypeSupported(t)) || "";
      try {
        rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 600000 } : undefined);
      } catch (e2) {
        rec = new MediaRecorder(stream);
        mime = rec.mimeType || "";
      }
      chunks = [];
      rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
      rec.start(1000);
      state = "rec";
      if (!dot) {
        dot = document.createElement("div");
        dot.textContent = "● REC";
        dot.style.cssText = "position:fixed;top:10px;left:12px;z-index:60;font:600 11px sans-serif;letter-spacing:1px;color:#ff6b8a;opacity:.7;pointer-events:none";
        document.body.appendChild(dot);
      }
      return true;
    } catch (e) {
      lastErr = (e && e.name) ? e.name + (e.message ? ": " + e.message : "") : String(e);
      try { if (stream) stream.getTracks().forEach(t => t.stop()); } catch (_) {}
      state = "idle";   // IMPORTANT: lets him try again
      return false;
    }
  }

  const active = () => state === "rec";
  const error = () => lastErr;

  function stop() {
    return new Promise(res => {
      if (state !== "rec") return res(null);
      rec.onstop = () => {
        try { stream.getTracks().forEach(t => t.stop()); } catch (_) {}
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

  return { start, stop, send, active, error };
})();