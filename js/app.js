/* Gau Maitry store logic. Prices & contact come from js/config.js */
(function () {
  const $ = (s) => document.querySelector(s);
  const KEY = "gm_cart_v1";
  const P = SITE.products;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const isPriced = (p) => typeof p.price === "number" && isFinite(p.price) && p.price > 0;
  const money = (n) => "₹" + n.toLocaleString("en-IN");
  const byId = (id) => P.find((p) => p.id === id);

  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { cart = {}; }
  Object.keys(cart).forEach((id) => { if (!byId(id) || !(cart[id] > 0)) delete cart[id]; });
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} };
  const cardQty = {}; P.forEach((p) => (cardQty[p.id] = 1));

  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 3200); }

  function imgEl(p, cls) {
    const img = document.createElement("img");
    img.src = p.image; img.alt = p.name + " – Gau Maitry, pack of " + p.pack; img.loading = "lazy";
    if (cls) img.className = cls;
    img.onerror = () => { const d = document.createElement("div"); d.className = "ph"; d.textContent = "Add photo: " + p.image; img.replaceWith(d); };
    return img;
  }
  const priceHtml = (p) => isPriced(p) ? `<div class="price">${money(p.price)} <small>per pack</small></div>` : `<div class="price tbc">Price to be confirmed</div>`;

  function renderProducts() {
    const grid = $("#productGrid"), hero = $("#heroProducts");
    grid.innerHTML = ""; hero.innerHTML = "";
    P.forEach((p) => {
      const f = document.createElement("figure"); f.appendChild(imgEl(p));
      const c = document.createElement("figcaption"); c.textContent = p.name; f.appendChild(c); hero.appendChild(f);
      const card = document.createElement("article"); card.className = "card"; card.dataset.id = p.id;
      const holder = document.createElement("div"); card.appendChild(holder); holder.replaceWith(imgEl(p));
      card.insertAdjacentHTML("beforeend", `
        <h3>${esc(p.name)}</h3><p class="hi">${esc(p.hindi)}</p>
        <p>Pack size: ${esc(p.pack)}</p>${priceHtml(p)}
        <div class="qty" role="group" aria-label="Quantity for ${esc(p.name)}">
          <button data-act="dec" aria-label="Decrease quantity">−</button><span data-q>1</span><button data-act="inc" aria-label="Increase quantity">+</button></div>
        <div class="actions">
          <button class="btn gold" data-act="add">Add to Cart</button>
          <button class="btn ghost" data-act="buy">Buy Now</button>
          <button class="btn wa" data-act="wa">Order on WhatsApp</button></div>`);
      card.insertAdjacentHTML("afterbegin", `<span class="badge">Pack of ${esc(p.pack)}</span>`);
      grid.appendChild(card);
    });
  }

  function totals() {
    const lines = Object.keys(cart).map((id) => ({ p: byId(id), q: cart[id] }));
    let sub = 0, unpriced = 0, pricedCount = 0, count = 0;
    lines.forEach((l) => { count += l.q; if (isPriced(l.p)) { sub += l.p.price * l.q; pricedCount++; } else unpriced++; });
    const hasDel = typeof SITE.deliveryCharge === "number" && SITE.deliveryCharge >= 0;
    const payable = lines.length && !unpriced && hasDel ? sub + SITE.deliveryCharge : null;
    return { lines, sub, unpriced, pricedCount, count, hasDel, payable };
  }

  function summaryHtml(t) {
    if (!t.lines.length) return "";
    let h = "";
    if (t.pricedCount) h += `<div>Subtotal (confirmed-price items only): <b>${money(t.sub)}</b></div>`;
    if (t.unpriced) h += `<div class="warn">⚠ ${t.unpriced === 1 ? "One item has" : "Some items have"} no confirmed price yet. Price will be confirmed on WhatsApp before your order is finalised.</div>`;
    h += t.hasDel ? `<div>Delivery charge: <b>${money(SITE.deliveryCharge)}</b></div>` : `<div>Delivery charge: to be confirmed</div>`;
    if (t.payable !== null) h += `<div>Total payable: <b>${money(t.payable)}</b></div>`;
    else h += `<div><b>Final payable amount will be confirmed on WhatsApp.</b></div>`;
    return h;
  }

  function renderCart() {
    const t = totals(), box = $("#cartItems");
    $("#cartCount").textContent = t.count;
    box.innerHTML = "";
    if (!t.lines.length) {
      box.innerHTML = `<div class="empty"><p>Your cart is empty.</p></div>`;
    }
    t.lines.forEach(({ p, q }) => {
      const row = document.createElement("div"); row.className = "line"; row.dataset.id = p.id;
      row.appendChild(imgEl(p));
      const mid = document.createElement("div");
      mid.innerHTML = `<b>${esc(p.name)}</b><small>${esc(p.hindi)} · ${esc(p.pack)}</small><small>${isPriced(p) ? money(p.price) + " × " + q + " = " + money(p.price * q) : "Price to be confirmed"}</small>
        <div class="qty" role="group" aria-label="Quantity"><button data-c="dec" aria-label="Decrease">−</button><span>${q}</span><button data-c="inc" aria-label="Increase">+</button></div>`;
      row.appendChild(mid);
      row.insertAdjacentHTML("beforeend", `<button class="rm" data-c="rm">Remove</button>`);
      box.appendChild(row);
    });
    $("#cartSummary").innerHTML = summaryHtml(t);
    $("#checkoutBtn").style.display = t.lines.length ? "" : "none";
  }

  function lineText(l) {
    return isPriced(l.p) ? `• ${l.p.name} (${l.p.pack}) × ${l.q} – ${money(l.p.price)} each = ${money(l.p.price * l.q)}`
                         : `• ${l.p.name} (${l.p.pack}) × ${l.q} – price to be confirmed`;
  }
  function buildMessage(lines, info, notes) {
    const t = { lines }, m = ["Hello Gau Maitry, I would like to place an order request:", ""];
    if (info && info.name) m.push("Name: " + info.name);
    if (info && info.phone) m.push("Phone: " + info.phone);
    if (info && info.addr) m.push("Address: " + info.addr);
    if (info) m.push("");
    m.push("Products:"); lines.forEach((l) => m.push(lineText(l)));
    let sub = 0, un = 0; lines.forEach((l) => (isPriced(l.p) ? (sub += l.p.price * l.q) : un++));
    m.push("");
    if (lines.some((l) => isPriced(l.p))) m.push("Subtotal (confirmed-price items): " + money(sub));
    if (un) m.push("Please confirm the price for items marked 'price to be confirmed'.");
    if (typeof SITE.deliveryCharge === "number") m.push("Delivery charge: " + money(SITE.deliveryCharge));
    if (!un && typeof SITE.deliveryCharge === "number") m.push("Total: " + money(sub + SITE.deliveryCharge));
    if (notes) m.push("", "Notes: " + notes);
    return m.join("\n");
  }
  function openWA(text) {
    const num = String(SITE.whatsappNumber || "");
    if (!/^\d{11,15}$/.test(num)) { toast("WhatsApp number is not set yet. Owner: edit js/config.js"); return; }
    const a = document.createElement("a");
    a.href = "https://wa.me/" + num + "?text=" + encodeURIComponent(text);
    a.target = "_blank"; a.rel = "noopener noreferrer"; document.body.appendChild(a); a.click(); a.remove();
    toast("WhatsApp opened. Press Send there to submit your request.");
  }

  const drawer = $("#cartDrawer"), overlay = $("#overlay"), modal = $("#checkoutModal");
  function openCart() { renderCart(); drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); overlay.hidden = false; $("#cartClose").focus(); }
  function closeAll() { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); overlay.hidden = true; modal.hidden = true; }
  function openCheckout() {
    const t = totals(); if (!t.lines.length) { toast("Your cart is empty."); return; }
    drawer.classList.remove("open"); overlay.hidden = true;
    $("#coSummary").innerHTML = t.lines.map((l) => esc(lineText(l))).join("<br>") + "<br><br>" + summaryHtml(t);
    modal.hidden = false; $("#coName").focus();
  }
  function add(id, q) { cart[id] = Math.min(99, (cart[id] || 0) + q); save(); renderCart(); }

  $("#productGrid").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-act]"); if (!b) return;
    const card = b.closest(".card"), id = card.dataset.id, a = b.dataset.act;
    if (a === "inc" || a === "dec") {
      cardQty[id] = Math.max(1, Math.min(99, cardQty[id] + (a === "inc" ? 1 : -1))); card.querySelector("[data-q]").textContent = cardQty[id];
    } else if (a === "add") { add(id, cardQty[id]); toast("Added to cart"); }
    else if (a === "buy") { add(id, cardQty[id]); openCheckout(); }
    else if (a === "wa") { openWA(buildMessage([{ p: byId(id), q: cardQty[id] }], null, "")); }
  });
  $("#cartItems").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-c]"); if (!b) return;
    const id = b.closest(".line").dataset.id, a = b.dataset.c;
    if (a === "inc") cart[id] = Math.min(99, cart[id] + 1);
    else if (a === "dec") { cart[id] -= 1; if (cart[id] < 1) delete cart[id]; }
    else delete cart[id];
    save(); renderCart();
  });
  $("#cartBtn").onclick = openCart; $("#cartClose").onclick = closeAll; overlay.onclick = closeAll; $("#coClose").onclick = closeAll;
  $("#continueBtn").onclick = () => { closeAll(); location.hash = "#shop"; };
  $("#checkoutBtn").onclick = openCheckout;
  modal.addEventListener("click", (e) => { if (e.target === modal) closeAll(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });
  document.querySelectorAll("[data-wa-general]").forEach((b) => (b.onclick = () => openWA("Hello Gau Maitry, I would like to enquire about your dhoop cups.")));

  const menuBtn = $("#menuBtn"), links = $("#navLinks");
  menuBtn.onclick = () => { const o = links.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", o); };
  links.onclick = (e) => { if (e.target.tagName === "A") { links.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); } };

  function setErr(inputId, msg) { const i = $("#" + inputId), er = $("#" + inputId + "Err"); er.textContent = msg || ""; i.classList.toggle("bad", !!msg); i.setAttribute("aria-invalid", !!msg); return !msg; }
  $("#checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#coName").value.trim(), addr = $("#coAddr").value.trim();
    const phone = $("#coPhone").value.replace(/[\s\-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, "");
    const ok = [setErr("coName", name.length < 2 ? "Please enter your full name." : ""),
      setErr("coPhone", /^[6-9]\d{9}$/.test(phone) ? "" : "Enter a valid 10-digit Indian mobile number."),
      setErr("coAddr", addr.length < 10 ? "Please enter your complete delivery address." : "")].every(Boolean);
    if (!ok) return;
    const lines = totals().lines; if (!lines.length) { toast("Your cart is empty."); return; }
    openWA(buildMessage(lines, { name, phone: "+91 " + phone, addr }, $("#coNotes").value.trim()));
  });
  $("#enquiryForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const n = $("#eqName").value.trim(), m = $("#eqMsg").value.trim();
    const ok = [setErr("eqName", n.length < 2 ? "Please enter your name." : ""), setErr("eqMsg", m.length < 5 ? "Please type your message." : "")].every(Boolean);
    if (ok) openWA("Hello Gau Maitry, this is " + n + ".\n\n" + m);
  });

  $("#contactPhone").textContent = SITE.phoneDisplay ? "Phone: " + SITE.phoneDisplay : "Phone: contact number to be added";
  const em = $("#contactEmail");
  if (SITE.email) { em.textContent = "Email: "; const a = document.createElement("a"); a.href = "mailto:" + SITE.email; a.textContent = SITE.email; em.appendChild(a); }
  else em.textContent = "Email: to be added";
  $("#year").textContent = new Date().getFullYear();
  renderProducts(); renderCart();
  document.documentElement.classList.add("js");
  const rv = document.querySelectorAll(".card,.info,.step,.title,.about p,.policies p");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    rv.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
  }
})();
