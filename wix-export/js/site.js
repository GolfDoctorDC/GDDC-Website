(function () {
  const drawer = document.getElementById("drawer");
  const backdrop = document.getElementById("backdrop");
  const openBtn = document.getElementById("open-menu");
  const closeBtn = document.getElementById("close-menu");

  function open() {
    drawer?.classList.add("open");
    backdrop?.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function close() {
    drawer?.classList.remove("open");
    backdrop?.classList.remove("open");
    document.body.style.overflow = "";
  }
  openBtn?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);

  document.querySelectorAll("[data-amount]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-amount]").forEach((b) => b.classList.remove("on"));
      btn.classList.add("on");
      const val = btn.getAttribute("data-amount");
      const field = document.getElementById("gift-amount");
      if (field) {
        field.value = val === "custom" ? "" : "$" + val;
        field.readOnly = val !== "custom";
        if (val === "custom") field.focus();
      }
      const customWrap = document.getElementById("custom-wrap");
      const ppAmount = document.getElementById("pp-amount");
      const ppTotal = document.getElementById("pp-total");
      if (customWrap) customWrap.classList.toggle("hidden", val !== "custom");
      if (val !== "custom" && ppAmount) {
        ppAmount.value = Number(val).toFixed(2);
        if (ppTotal) ppTotal.textContent = "$" + Number(val).toFixed(2);
      }
    });
  });

  const customAmount = document.getElementById("custom-amount");
  customAmount?.addEventListener("input", () => {
    const n = Number(String(customAmount.value).replace(/[^0-9.]/g, ""));
    const ppAmount = document.getElementById("pp-amount");
    const ppTotal = document.getElementById("pp-total");
    if (Number.isFinite(n) && n >= 25) {
      if (ppAmount) ppAmount.value = n.toFixed(2);
      if (ppTotal) ppTotal.textContent = "$" + n.toFixed(2);
    }
  });

  document.getElementById("gift-paypal")?.addEventListener("submit", (e) => {
    const ppAmount = document.getElementById("pp-amount");
    const n = Number(ppAmount?.value);
    if (!Number.isFinite(n) || n < 25) {
      e.preventDefault();
      alert("Enter a gift card amount of at least $25.");
      return;
    }
    const from = document.getElementById("from-name")?.value?.trim();
    const recipient = document.getElementById("recipient-name")?.value?.trim();
    const email = document.getElementById("recipient-email")?.value?.trim();
    const message = document.getElementById("gift-note")?.value?.trim();
    const note = [
      from && "From: " + from,
      recipient && "Recipient: " + recipient,
      email && "Send to: " + email,
      message && "Note: " + message,
    ]
      .filter(Boolean)
      .join(" · ")
      .slice(0, 200);
    const os0 = document.getElementById("pp-note");
    if (os0) os0.value = note || "Studio gift card";
    const item = e.currentTarget.querySelector('input[name="item_name"]');
    if (item && recipient) item.value = "Golf Doctor DC Gift Card for " + recipient;
  });

  document.querySelectorAll("form[data-mail]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const kind = form.getAttribute("data-mail");
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const message = String(data.get("message") || "").trim();
      const extra = String(data.get("extra") || "").trim();
      const subject =
        kind === "gift"
          ? "Gift card request"
          : kind === "trade"
            ? "Trade-in quote request"
            : "Help me break Par!";
      const lines = [
        "Name: " + name,
        "Email: " + email,
        phone ? "Phone: " + phone : "",
        extra
          ? kind === "gift"
            ? "Gift amount: " + extra
            : "Clubs: " + extra
          : "",
        "",
        message,
      ].filter(Boolean);
      window.location.href =
        "mailto:matt@golfdoctordc.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(lines.join("\n"));
      const done = form.parentElement?.querySelector("[data-sent]");
      if (done) {
        form.classList.add("hidden");
        done.classList.remove("hidden");
      }
    });
  });
})();
