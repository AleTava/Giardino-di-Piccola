/* =========================================================================
   THURSDAY — Ogni giovedì: il prato si riempie di lavanda + messaggio.
   Si attiva una volta sola per giovedì (al primo caricamento del giorno).
   Per testare: metti forceThursday: true in config.js.
   ======================================================================= */

(function () {
  const CONFIG = window.GIARDINO_CONFIG || {};

  function isThursday() {
    return new Date().getDay() === 4; // 0=Dom … 4=Gio … 6=Sab
  }

  function todayKey() {
    const d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  function hasShownToday() {
    try { return localStorage.getItem("giardino_thursday_shown") === todayKey(); }
    catch (e) { return false; }
  }

  function markShown() {
    try { localStorage.setItem("giardino_thursday_shown", todayKey()); }
    catch (e) {}
  }

  // ---------- SVG LAVANDA --------------------------------------------------
  // Una spiga di lavanda stilizzata, scalabile, in linea col resto del progetto.
  function lavenderSVG(scale) {
    const w = Math.round(22 * scale);
    const h = Math.round(60 * scale);
    return `<svg viewBox="0 0 22 60" width="${w}" height="${h}"
               xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="11" y1="60" x2="11" y2="14"
            stroke="#3d6b22" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M11,45 Q6,40 6,32 Q9,26 11,29 Z"  fill="#6e45a8"/>
      <path d="M11,45 Q16,40 16,32 Q13,26 11,29 Z" fill="#7a50b8"/>
      <path d="M11,31 Q6,26 7,19 Q9.5,14 11,16 Z"  fill="#9060cc"/>
      <path d="M11,31 Q16,26 15,19 Q12.5,14 11,16 Z" fill="#9c6cd8"/>
      <path d="M11,18 Q7,14 8,8  Q10,4 11,6 Z"    fill="#b080e0"/>
      <path d="M11,18 Q15,14 14,8  Q12,4 11,6 Z"    fill="#bc8cec"/>
      <path d="M11,8  Q9,4  10,1 Q11,0 11,2 Z"    fill="#cca0f4"/>
      <path d="M11,8  Q13,4  12,1 Q11,0 11,2 Z"    fill="#cca0f4"/>
    </svg>`;
  }

  // ---------- CAMPO DI LAVANDA ---------------------------------------------
  // Distribuzione in profondità: ogni pianta ha un valore di "depth" [0,1].
  //   depth = 0 → lontano (piccolo, in alto sull'orizzonte, sbiadito)
  //   depth = 1 → vicino  (grande, in basso, saturo)
  // L'ordine DOM è poi ordinato dal più lontano al più vicino, così le piante
  // davanti coprono naturalmente quelle dietro.
  function buildLavenderField(scene) {
    const field = document.createElement("div");
    field.className = "thursday-field";
    field.setAttribute("aria-hidden", "true");

    const plants = [];

    // Geometria del prato (.meadow height: 42%, primo profilo a y=180/500):
    //   - orizzonte della collina di fondo:    ~27vh dal basso
    //   - orizzonte della collina di davanti:  ~20vh dal basso
    // Tetto plausibile per le piante: 18vh, così nessuna sembra sospesa.
    const VASE_LEFT  = 33;
    const VASE_RIGHT = 67;
    const MAX_BOTTOM_VH = 18;

    // Helper per costruire un oggetto-pianta completo dato (leftPct, depth, bottomVh)
    function makePlant(leftPct, depth, bottomVh) {
      return {
        depth, leftPct, bottomVh,
        scale     : 0.32 + depth * 1.15,
        opacity   : 0.6  + depth * 0.4,    // un filo più visibili in lontananza
        saturate  : 0.7  + depth * 0.3,
        brightness: 0.88 + depth * 0.12,
        swayDur: (2.6 + Math.random() * 3.4),
        swayAmt: (1.5 + Math.random() * 5),
        swayDel: Math.random() * 4,
        growDel: Math.random() * 1.0
      };
    }

    // 1) GRIGLIA JITTERATA — distribuzione uniforme senza "clumps".
    //    Ogni lato (sinistra: -6%..33%, destra: 67%..106%) diviso in 9 colonne.
    //    Ogni colonna ospita fino a 5 piante, posizionate a caso dentro la cella.
    //    Profondità casuale per pianta → varietà alto/basso che rompe le righe.
    //    Skip rate ~18% per non rendere la griglia visibile.
    const COLS = 9;
    const PLANTS_PER_COL = 5;
    const SKIP_RATE = 0.18;

    for (let side = 0; side < 2; side++) {
      const xStart = side === 0 ? -6        : VASE_RIGHT;
      const xEnd   = side === 0 ? VASE_LEFT : 106;
      const cellW  = (xEnd - xStart) / COLS;

      for (let col = 0; col < COLS; col++) {
        for (let p = 0; p < PLANTS_PER_COL; p++) {
          if (Math.random() < SKIP_RATE) continue;

          const leftPct  = xStart + (col + Math.random()) * cellW;
          const depth    = Math.pow(Math.random(), 0.85);
          // bottomVh segue la profondità ma con jitter ±1.5vh per evitare righe
          const bottomVh = Math.max(
            0,
            (1 - depth) * MAX_BOTTOM_VH + (Math.random() - 0.5) * 3
          );

          plants.push(makePlant(leftPct, depth, bottomVh));
        }
      }
    }

    // 2) CLUSTER VICINO AL VASO — 12 piante grandi, in primo piano, attaccate
    //    ai due lati del vaso per dare densità nel punto focale.
    for (let i = 0; i < 12; i++) {
      const depth    = 0.7 + Math.random() * 0.3;          // primo piano
      const bottomVh = Math.random() * 5;                   // attaccate al fondo
      const onLeft   = i % 2 === 0;
      const offset   = Math.random() * 7;                   // 0..7% dal bordo del vaso
      const leftPct  = onLeft ? VASE_LEFT - offset : VASE_RIGHT + offset;
      plants.push(makePlant(leftPct, depth, bottomVh));
    }

    // Lontane prima → vengono renderizzate dietro
    plants.sort((a, b) => a.depth - b.depth);

    for (const p of plants) {
      const plant = document.createElement("div");
      plant.className = "thursday-plant";
      plant.style.left      = p.leftPct.toFixed(1) + "%";
      plant.style.bottom    = p.bottomVh.toFixed(1) + "vh";
      plant.style.opacity   = p.opacity.toFixed(2);
      plant.style.filter    = `saturate(${p.saturate.toFixed(2)}) brightness(${p.brightness.toFixed(2)})`;
      plant.style.setProperty("--sway-dur", p.swayDur.toFixed(2) + "s");
      plant.style.setProperty("--sway-amt", p.swayAmt.toFixed(1) + "deg");
      plant.style.animationDelay = p.swayDel.toFixed(2) + "s";

      const inner = document.createElement("div");
      inner.className = "thursday-plant-inner";
      inner.style.animationDelay = p.growDel.toFixed(2) + "s";
      inner.innerHTML = lavenderSVG(p.scale);

      plant.appendChild(inner);
      field.appendChild(plant);
    }

    scene.appendChild(field);
    return field;
  }

  // ---------- PETALI DI CONFETTI -------------------------------------------
  function buildPetals(scene) {
    const layer = document.createElement("div");
    layer.className = "thursday-petals";
    layer.setAttribute("aria-hidden", "true");

    const COLORS = ["#e4d0f8", "#c8a0e8", "#a87cd4", "#8e5ec0", "#d4b8f0", "#b890e0"];
    const COUNT  = 65;

    for (let i = 0; i < COUNT; i++) {
      const p     = document.createElement("span");
      p.className = "thursday-petal";
      const angle = Math.random() * Math.PI * 2;
      const dist  = 25 + Math.random() * 65;
      p.style.setProperty("--tx",    (Math.cos(angle) * dist).toFixed(1) + "vw");
      p.style.setProperty("--ty",    (Math.sin(angle) * dist).toFixed(1) + "vh");
      p.style.setProperty("--rot",   (Math.random() * 720 - 360).toFixed(0) + "deg");
      p.style.setProperty("--size",  (5 + Math.random() * 12).toFixed(1) + "px");
      p.style.setProperty("--color", COLORS[Math.floor(Math.random() * COLORS.length)]);
      p.style.animationDelay    = (Math.random() * 0.5).toFixed(2) + "s";
      p.style.animationDuration = (1.6 + Math.random() * 1.6).toFixed(2) + "s";
      layer.appendChild(p);
    }

    scene.appendChild(layer);
    setTimeout(() => layer.remove(), 5000);
  }

  // ---------- OVERLAY TESTO ------------------------------------------------
  function buildOverlay(scene) {
    const overlay = document.createElement("div");
    overlay.className = "thursday-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Buon giovedì!");

    overlay.innerHTML = `
      <div class="thursday-card">
        <div class="thursday-emoji">🪻</div>
        <div class="thursday-text">Buon giovedì<br>lavandaaaa!</div>
        <button class="thursday-close" aria-label="Chiudi">✕</button>
      </div>
    `;

    const dismiss = () => {
      overlay.classList.add("thursday-out");
      setTimeout(() => overlay.remove(), 500);
    };

    overlay.querySelector(".thursday-close").addEventListener("click", dismiss);
    setTimeout(dismiss, 8000);

    scene.appendChild(overlay);
  }

  // ---------- AVVIO --------------------------------------------------------
  function init() {
    const force = !!CONFIG.forceThursday;
    if (!force && !isThursday()) return;

    const scene = document.getElementById("scene");
    if (!scene) return;

    // Il campo di lavanda persiste per tutto il giovedì: si rigenera ad ogni
    // caricamento della pagina e non viene rimosso quando l'overlay si chiude.
    setTimeout(() => buildLavenderField(scene), 200);

    // L'animazione di benvenuto (petali + scritta) parte UNA volta al giorno.
    if (!force && hasShownToday()) return;
    markShown();

    setTimeout(() => {
      buildPetals(scene);
      setTimeout(() => buildOverlay(scene), 500);
    }, 1000);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
