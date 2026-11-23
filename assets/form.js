// Google Apps Script web app (source: apps-script/Code.gs). Re-deploy as a new version after editing.
const ENDPOINT = "https://script.google.com/macros/s/AKfycbyhQj5wXqlxlfM4xf-IMTzBgtQ_giW1O3TVDKwDrdHmuvni0a01yJSOt6nScj1o3BgD/exec";

const form = document.getElementById("join");
const msg = document.getElementById("msg");
const btn = document.getElementById("submit");

// "Other" chip reveals a text box
document.querySelectorAll("[data-other]").forEach((box) => {
  const target = document.getElementById(box.dataset.other);
  box.addEventListener("change", () => {
    target.classList.toggle("show", box.checked);
    if (box.checked) target.focus();
  });
});

function collect() {
  const fd = new FormData(form);
  const data = {};
  for (const [k, v] of fd.entries()) {
    data[k] = data[k] ? data[k] + ", " + v : v;
  }
  return data;
}

function problem() {
  const d = collect();
  if (!d.name) return "Add your name.";
  if (!d.instagram) return "Add your IG handle.";
  if (!d.city) return "Add your city.";
  if (!d.pieces) return "Tell us which piece you own.";
  if (!d.whatsapp || d.whatsapp.replace(/\D/g, "").length < 10) return "Add your WhatsApp number with country code.";
  if (!d.ok_whatsapp) return "Tick the WhatsApp box so we can reach you.";
  if (d.email && !/^\S+@\S+\.\S+$/.test(d.email)) return "That email doesn't look right.";
  if (!d.soiree) return "Let us know about the Soirée.";
  return "";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.className = "form-msg";
  const p = problem();
  if (p) { msg.textContent = p; msg.classList.add("error"); return; }

  const data = collect();
  if (data.website) return; // spam trap
  data.page = location.href;

  btn.disabled = true;
  msg.textContent = "Sending...";

  try {
    // text/plain keeps this a "simple" request, so no CORS preflight to Apps Script
    const res = await fetch(ENDPOINT, { method: "POST", body: JSON.stringify(data) });
    const out = await res.json();
    if (!out.ok) throw new Error(out.error || "failed");
    form.style.display = "none";
    document.getElementById("intro").style.display = "none";
    document.getElementById("done").classList.add("show");
    window.scrollTo(0, 0);
  } catch (err) {
    msg.textContent = "That didn't go through. Try again, or DM @stealdbeat.";
    msg.classList.add("error");
    btn.disabled = false;
  }
});
