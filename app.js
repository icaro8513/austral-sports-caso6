"use strict";
// Datos ficticios usados exclusivamente para el parcial.
// DATOS: courts es un array (lista); cada objeto reúne las propiedades de una cancha.
// const impide reasignar la variable, pero permite modificar propiedades de objetos como state.
const courts = [
  {
    id: "patagonia",
    sport: "futbol",
    name: "Cancha Patagonia 1",
    description: "Fútbol 5 · Césped sintético",
    surface: "sintetico",
    price: 18000,
    deposit: 5000,
    type: "Fútbol 5",
    icon: "⚽",
  },
  {
    id: "glaciares",
    sport: "futbol",
    name: "Cancha Glaciares",
    description: "Fútbol 7 · Césped sintético",
    surface: "sintetico",
    price: 24000,
    deposit: 7000,
    type: "Fútbol 7",
    icon: "⚽",
  },
  {
    id: "indoor",
    sport: "futbol",
    name: "Cancha Austral Indoor",
    description: "Fútbol 5 · Techada",
    surface: "techada",
    price: 21000,
    deposit: 6000,
    type: "Fútbol 5",
    icon: "⚽",
  },
  {
    id: "padel1",
    sport: "padel",
    name: "Pádel Austral 1",
    description: "Pádel · Cancha techada",
    surface: "techada",
    price: 16000,
    deposit: 4500,
    type: "Pádel",
    icon: "🎾",
  },
  {
    id: "padel2",
    sport: "padel",
    name: "Pádel Patagonia",
    description: "Pádel · Cancha techada",
    surface: "techada",
    price: 17000,
    deposit: 5000,
    type: "Pádel",
    icon: "🎾",
  },
  {
    id: "basquet1",
    sport: "basquet",
    name: "Básquet Indoor",
    description: "Básquet · Cancha techada",
    surface: "techada",
    price: 20000,
    deposit: 6000,
    type: "Básquet",
    icon: "🏀",
  },
  {
    id: "natural",
    sport: "futbol",
    name: "Cancha Fueguina",
    description: "Fútbol 11 · Césped natural",
    surface: "natural",
    price: 36000,
    deposit: 10000,
    type: "Fútbol 11",
    icon: "⚽",
  },
  {
    id: "tenis1",
    sport: "tenis",
    name: "Tenis Austral 1",
    description: "Tenis · Polvo de ladrillo",
    surface: "polvo",
    price: 22000,
    deposit: 6000,
    type: "Tenis",
    icon: "🎾",
  },
];
// AUXILIARES DOM: querySelector() busca el primer elemento por selector CSS; $("#date") obtiene el calendario.
// $ convierte todos los resultados de querySelectorAll() en un array. money recibe un número y devuelve pesos argentinos.
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const money = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
// ESTADO DE RESERVA: objeto compartido con cancha, fecha, turno y número del comprobante.
const state = { court: null, date: "", time: null, number: "" };
// Devuelve hoy como YYYY-MM-DD en hora local. init() la usa para el valor y el mínimo del calendario.
function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Recibe una fecha YYYY-MM-DD y devuelve una etiqueta argentina para resúmenes. map(Number) convierte cada parte a número; if resuelve la fecha vacía.
function formatDate(date) {
  if (!date) return "—";
  const [y, m, d] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(y, m - 1, d));
}

// Muestra un mensaje de estado al filtrar, validar o copiar. Recibe texto y un booleano opcional de advertencia; textContent coloca texto en el DOM.
function notify(message, warning = false) {
  const e = $("#notice");
  e.hidden = false;
  e.textContent = message;
  e.classList.toggle("warning", warning);
  e.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Oculta el aviso al cambiar de pantalla. No recibe datos ni devuelve un valor explícito.
function clearNotify() {
  $("#notice").hidden = true;
}

// NAVEGACIÓN: recibe el ID de destino al navegar. Los if protegen pasos sin selección; oculta las demás vistas y actualiza el hash.
function show(id) {
  if (!document.getElementById(id)) id = "inicio";
  if (id === "horarios" && !state.court) id = "canchas";
  if (id === "confirmacion" && !state.time) id = "horarios";
  if (id === "comprobante" && !state.number) id = "inicio";
  $$(".view").forEach((v) => (v.hidden = v.id !== id));
  clearNotify();
  history.replaceState({}, "", `#${id}`);
  window.scrollTo({ top: 0, behavior: "instant" });
}

// FILTRADO Y TARJETAS: se ejecuta al iniciar y al enviar los filtros. filter() devuelve las canchas coincidentes; map() transforma cada objeto en una tarjeta del DOM.
function renderCourts() {
  const sport = $('input[name="sport"]:checked').value;
  const surface = $("#surface").value;
  const filtered = courts.filter(
    (c) => c.sport === sport && (surface === "todos" || surface === c.surface),
  );
  $("#result-count").textContent =
    `${filtered.length} ${filtered.length === 1 ? "cancha disponible" : "canchas disponibles"}`;
  $("#match-pill").textContent = `${filtered.length} opciones`;
  $("#empty-results").hidden = filtered.length > 0;
  $("#court-results").replaceChildren(
    ...filtered.map((c) => {
      const el = document.createElement("article");
      el.className = "card court";
      el.innerHTML = `<div class="court-top"><h3></h3><span class="pill">Ver turnos</span></div><p></p><div class="price"></div><button class="btn secondary full" type="button">Ver horarios →</button>`;
      el.querySelector("h3").textContent = `${c.icon} ${c.name}`;
      el.querySelector("p").textContent = c.description;
      el.querySelector(".price").textContent = money(c.price) + " / hora";
      el.querySelector("button").addEventListener("click", () =>
        selectCourt(c.id),
      );
      return el;
    }),
  );
}

// SELECCIÓN DE CANCHA: recibe su ID al pulsar Ver horarios. Busca el objeto, guarda cancha y fecha, borra el turno anterior y abre horarios.
function selectCourt(id) {
  state.court = courts.find((c) => c.id === id);
  state.date = $("#date").value;
  state.time = null;
  $("#selected-court-title").textContent = state.court.name;
  $("#selected-court-info").textContent = state.court.description;
  $("#selected-date").textContent = formatDate(state.date);
  renderSlots();
  show("horarios");
}

// ESTADOS: recibe una hora y devuelve busy, closed o free según los horarios fijos de demostración. Se consulta al dibujar cada turno.
function slotStatus(hour) {
  const index = Number(hour.slice(0, 2));
  if (index === 17 || index === 23) return "busy";
  if (index === 21 || index === 0) return "closed";
  return "free";
}

// HORARIOS Y SELECCIÓN: se ejecuta al elegir cancha o turno. for...of recorre las horas; crea botones y addEventListener() guarda la hora al hacer clic en uno libre.
function renderSlots() {
  const grid = $("#time-grid");
  grid.replaceChildren();
  for (const hour of [
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
    "00:00",
  ]) {
    const status = slotStatus(hour);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `slot ${status}${state.time === hour ? " active" : ""}`;
    btn.disabled = status !== "free";
    btn.setAttribute("aria-pressed", state.time === hour ? "true" : "false");
    btn.innerHTML = `<strong>${hour}</strong><small>${status === "busy" ? "Reservado" : status === "closed" ? "No disponible" : state.time === hour ? "Seleccionado" : "Disponible"}</small>`;
    if (status === "free")
      btn.addEventListener("click", () => {
        state.time = hour;
        renderSlots();
        updateSummary();
      });
    grid.append(btn);
  }
  updateSummary();
}

// Actualiza el resumen desde state después de dibujar los turnos. Habilita Continuar solamente cuando hay una hora elegida.
function updateSummary() {
  const c = state.court;
  $("#summary-court").textContent = c?.name || "—";
  $("#summary-date").textContent = formatDate(state.date);
  $("#summary-time").textContent = state.time
    ? `${state.time}–${nextHour(state.time)}`
    : "Elegí un horario";
  $("#summary-total").textContent = c ? money(c.price) : "—";
  $("#to-checkout").disabled = !state.time;
}

// Recibe la hora inicial y devuelve la siguiente; el módulo 24 permite pasar de 23:00 a 00:00. Se usa en los resúmenes.
function nextHour(time) {
  const hour = (Number(time.split(":")[0]) + 1) % 24;
  return `${String(hour).padStart(2, "0")}:00`;
}

// Recibe etiqueta y valor y devuelve un div con ambos como texto. checkout() y finish() reutilizan esta función para construir filas.
function summaryLine(label, value) {
  const row = document.createElement("div");
  row.className = "summary-line";
  const a = document.createElement("span");
  a.textContent = label;
  const b = document.createElement("strong");
  b.textContent = value;
  row.append(a, b);
  return row;
}

// PRECIO, SEÑA Y SALDO: al pulsar Continuar, muestra price y deposit de la cancha. El saldo es price - deposit; luego abre confirmación.
function checkout() {
  const c = state.court;
  const wrapper = $("#checkout-summary");
  wrapper.replaceChildren(
    summaryLine("Cancha", c.name),
    summaryLine("Deporte", c.type),
    summaryLine("Fecha", formatDate(state.date)),
    summaryLine("Horario", `${state.time}–${nextHour(state.time)}`),
    summaryLine("Precio total", money(c.price)),
    summaryLine("Seña de ejemplo", money(c.deposit)),
    summaryLine("Saldo al llegar", money(c.price - c.deposit)),
  );
  show("confirmacion");
}

// Limpia mensajes y aria-invalid antes de validar y al iniciar otra reserva. No cambia los datos del formulario.
function clearErrors() {
  $$(".error").forEach((e) => {
    e.hidden = true;
    e.textContent = "";
  });
  $$("#checkout-form input").forEach((i) => i.removeAttribute("aria-invalid"));
}

// VALIDACIONES: se ejecuta al enviar el formulario. Comprueba nombre, correo, teléfono y condiciones; enfoca el primer error y devuelve true o false.
function validation() {
  clearErrors();
  let first = null; // Auxiliar interno: recibe ID y mensaje, marca el campo y recuerda el primer error. Se llama cuando una condición de validación falla.
  function fail(id, msg) {
    const f = $("#" + id),
      e = $("#" + (id === "fullName" ? "name-error" : id + "-error"));
    f.setAttribute("aria-invalid", "true");
    e.hidden = false;
    e.textContent = msg;
    first ??= f;
  }
  const name = $("#fullName").value.trim(),
    email = $("#email").value.trim(),
    phone = $("#phone").value.replace(/[\s()+-]/g, "");
  if (name.length < 3)
    fail("fullName", "Ingresá tu nombre y apellido (mínimo 3 caracteres).");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    fail("email", "Ingresá un correo válido, por ejemplo usuario@dominio.com.");
  if (!/^\d{8,15}$/.test(phone)) fail("phone", "Ingresá entre 8 y 15 dígitos.");
  if (!$("#terms").checked) {
    const t = $("#terms-error");
    t.hidden = false;
    t.textContent = "Debés aceptar las reglas antes de confirmar.";
    first ??= $("#terms");
  }
  if (first) {
    notify("Revisá los campos marcados y corregí los errores.", true);
    first.focus();
    return false;
  }
  return true;
}

// COMPROBANTE: se ejecuta si validation() devuelve true. Genera un número aleatorio de demostración y completa resumen y seña desde state.
function finish() {
  state.number = "#AS-" + String(2000 + Math.floor(Math.random() * 7000));
  $("#booking-number").textContent = state.number;
  $("#ticket-details").replaceChildren(
    summaryLine("Cancha", state.court.name),
    summaryLine("Deporte", state.court.type),
    summaryLine("Fecha", formatDate(state.date)),
    summaryLine("Horario", `${state.time}–${nextHour(state.time)}`),
    summaryLine("Seña prevista (simulada)", money(state.court.deposit)),
    summaryLine(
      "Saldo estimado al llegar",
      money(state.court.price - state.court.deposit),
    ),
  );
  $("#payment-amount").textContent = money(state.court.deposit);
  show("comprobante");
}

// EVENTOS E INICIALIZACIÓN: se ejecuta en DOMContentLoaded, con el HTML listo. Configura fecha, resultados y escuchadores de navegación, formularios, copia e impresión.
function init() {
  const today = localToday();
  $("#date").min = today;
  $("#date").value = today;
  renderCourts();
  $$("[data-view]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      show(el.dataset.view);
    }),
  );
  $("#filters").addEventListener("submit", (e) => {
    e.preventDefault();
    renderCourts();
    notify("Resultados actualizados según tus filtros.");
  });
  $("#to-checkout").addEventListener("click", checkout);
  $("#checkout-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (validation()) finish();
  });
  // IMPRESIÓN: el clic llama a window.print(); styles.css define la hoja A4 con @page y @media print.
  $("#print-ticket").addEventListener("click", () => window.print());
  // COPIA: al hacer clic, arma texto con datos ficticios y usa el portapapeles; catch informa si el navegador no lo permite.
  const copyData = $("#copy-payment-details");
  copyData.addEventListener("click", async () => {
    const text = `AUSTRAL SPORTS — DATOS FICTICIOS (NO PAGAR)\nAlias de demostración: ${$("#payment-alias").textContent}\nWhatsApp de demostración: ${$("#payment-phone").textContent}\nSeña de ejemplo: ${$("#payment-amount").textContent}`;
    try {
      await navigator.clipboard.writeText(text);
      notify("Datos ficticios copiados. No transferir dinero.");
    } catch {
      notify(
        "No se pudo copiar automáticamente. Seleccioná los datos de ejemplo para copiarlos.",
        true,
      );
    }
  });
  $("#book-again").addEventListener("click", () => {
    state.time = null;
    state.number = "";
    clearErrors();
    $("#checkout-form").reset();
    show("canchas");
  });
  $("#show-rules").addEventListener("click", (e) => {
    e.preventDefault();
    $("#reglas").scrollIntoView({ behavior: "smooth" });
  });
  const route = location.hash.slice(1);
  if (
    route &&
    ["inicio", "canchas", "horarios", "confirmacion", "comprobante"].includes(
      route,
    )
  )
    show(route);
  else show("inicio");
}

// addEventListener() registra una función para un evento; acá init se ejecuta cuando el DOM está listo.
document.addEventListener("DOMContentLoaded", init);
