// ===============================
// GLOBAL "CLICK ANYWHERE -> TELEGRAM" REDIRECT
// ===============================
// GLOBAL "CLICK ANYWHERE -> TELEGRAM" REDIRECT (WITH SPECIAL LINK FOR /1/a/index.html)
// ===============================
const TELEGRAM_URL_DEFAULT = "https://t.me/+sK6ivH661qpiNTMy"; // default
const TELEGRAM_URL_SPECIAL = "https://t.me/+VnNMpSaUe1VlNjgy"; // <-- special for 1/a/index.html

function getTelegramUrlByPath() {
  const path = (window.location.pathname || "").toLowerCase();

const isSpecial =
  path === "/1/a/index.html" ||
  path === "/1/a/" ||
  path === "/1/a" ||
  path.startsWith("/1/a/") ||
  path === "/1/d/index.html" ||
  path === "/1/d/" ||
  path === "/1/d" ||
  path.startsWith("/1/d/");

return isSpecial ? TELEGRAM_URL_SPECIAL : TELEGRAM_URL_DEFAULT;

}
(function attachGlobalTelegramRedirect() {
  const TELEGRAM_URL = getTelegramUrlByPath();

  const EXCLUDE_SELECTOR = `
    a, button, input, textarea, select, option, label,
    [role="button"], [role="link"],
    [contenteditable="true"],
    [data-no-redirect],
    .registerBtn,
    #registrationModal, .homeModalOverlay, #closeModalBtn,
    #registrationForm
  `;

  let downX = 0;
  let downY = 0;

  document.addEventListener(
    "pointerdown",
    (e) => {
      downX = e.clientX;
      downY = e.clientY;
    },
    { capture: true }
  );

  document.addEventListener(
    "click",
    (e) => {
      // Excluded elements
      if (e.target.closest(EXCLUDE_SELECTOR)) return;

      // Text selection
      const sel = window.getSelection?.();
      if (sel && String(sel).trim().length > 0) return;

      // Drag protection
      const moved = Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY);
      if (moved > 6) return;

      // Only left click
      if (e.button !== 0) return;

      window.location.href = TELEGRAM_URL;
    },
    { capture: true }
  );
})();

// ===============================
// YOUR MODAL + FORM LOGIC
// ===============================
document.addEventListener("DOMContentLoaded", function () {
  const registerBtns = document.querySelectorAll(".registerBtn");
  const modal = document.getElementById("registrationModal");
  const closeBtn = document.getElementById("closeModalBtn");
  const overlay = document.querySelector(".homeModalOverlay");

  const form = document.getElementById("registrationForm");
  const nameInput = document.getElementById("name");
  const nameError = document.getElementById("nameError");
  const phoneInput = document.getElementById("phone");
  const phoneError = document.getElementById("phoneError");
  const submitBtn = document.getElementById("submitBtn");

  const phoneFormatter = window.phoneFormatter;

  let isModalOpen = false;
  let scrollY = 0;

  function openModal() {
    if (!modal) return;

    isModalOpen = true;
    scrollY = window.scrollY;

    modal.style.display = "block";
    document.body.style.overflow = "hidden";

    if (nameError) nameError.style.display = "none";
    if (phoneError) phoneError.style.display = "none";
  }

  function closeModal() {
    if (!modal || !isModalOpen) return;

    isModalOpen = false;
    modal.style.display = "none";

    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";

    window.scrollTo(0, scrollY);
  }

  registerBtns.forEach((btn) => btn.addEventListener("click", openModal));
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (overlay) overlay.addEventListener("click", closeModal);

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!phoneFormatter) {
        console.error(
          "phoneFormatter is not initialized. Check formatter.js load order."
        );
        if (phoneError) phoneError.style.display = "block";
        return;
      }

      const name = (nameInput?.value || "").trim();
      const phone = (phoneInput?.value || "").trim();

      let hasError = false;

      if (name) {
        if (nameError) nameError.style.display = "none";
      } else {
        if (nameError) nameError.style.display = "block";
        hasError = true;
      }

      if (phoneFormatter.validate(phone)) {
        if (phoneError) phoneError.style.display = "none";
      } else {
        if (phoneError) phoneError.style.display = "block";
        hasError = true;
      }

      if (hasError) return;

      if (submitBtn) {
        submitBtn.textContent = "YUBORILMOQDA...";
        submitBtn.disabled = true;
      }

      const now = new Date();
      const date = now.toLocaleDateString("uz-UZ");
      const time = now.toLocaleTimeString("uz-UZ");

      const payload = {
        Ism: name,
        TelefonRaqam: phoneFormatter.getCurrentCode() + " " + phone,
        SanaSoat: date + " - " + time,
      };

      localStorage.setItem("formData", JSON.stringify(payload));

      // Redirect to thank you
      window.location.href = "/thankYou.html";

      // These lines usually won't run because of navigation,
      // but kept to match your original behavior:
      if (submitBtn) {
        submitBtn.textContent = "DAVOM ETISH";
        submitBtn.disabled = false;
      }
      if (nameInput) nameInput.value = "";
      if (phoneInput) phoneInput.value = "";

      closeModal();
    });
  }
});

// ===============================
// TIMER
// ===============================
const timerEl = document.getElementById("timer");
let time = 120;

const interval = setInterval(() => {
  if (!timerEl) {
    clearInterval(interval);
    return;
  }

  const mm = Math.floor(time / 60);
  const ss = time % 60;

  timerEl.textContent =
    String(mm).padStart(2, "0") + ":" + String(ss).padStart(2, "0");

  if (time !== 0) time--;
  else clearInterval(interval);
}, 1000);
