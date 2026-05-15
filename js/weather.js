/* =========================================================================
   WEATHER — Atmosfera del giardino: fascia oraria + meteo del giorno.

   - Fascia oraria: in base all'ora reale del dispositivo.
       alba    05:00 - 07:59
       giorno  08:00 - 17:59
       tramonto 18:00 - 19:59
       notte   20:00 - 04:59
   - Meteo: deterministico dal giorno (stessa data → stesso meteo per tutti).
       sereno 60%, nuvoloso 28%, pioggia 12%.

   La pioggia è solo atmosfera: non conta come annaffiatura.
   ======================================================================= */

(function () {
  const CONFIG = window.GIARDINO_CONFIG || {};

  function getTimeOfDay(date) {
    const h = (date || new Date()).getHours();
    if (h >= 5 && h < 8)   return "dawn";
    if (h >= 8 && h < 18)  return "day";
    if (h >= 18 && h < 20) return "sunset";
    return "night";
  }

  // Fase lunare reale dalla data.
  // phase ∈ [0,1): 0 = luna nuova, 0.25 = primo quarto, 0.5 = piena, 0.75 = ultimo quarto.
  // Riferimento: luna nuova del 6 gennaio 2000 18:14 UTC; ciclo sinodico 29.5306 giorni.
  function getMoonPhase(date) {
    const ref = Date.UTC(2000, 0, 6, 18, 14) / 86400000;
    const now = (date || new Date()).getTime() / 86400000;
    let phase = ((now - ref) / 29.5305882) % 1;
    if (phase < 0) phase += 1;
    return {
      phase,
      waxing: phase < 0.5,
      illumination: (1 - Math.cos(phase * 2 * Math.PI)) / 2
    };
  }

  function getCurrent() {
    const now = new Date();
    const time = CONFIG.forceTimeOfDay || getTimeOfDay(now);
    return { time };
  }

  const TIME_CLASSES = ["time-dawn", "time-day", "time-sunset", "time-night"];

  function apply(sceneEl, override) {
    if (CONFIG.weatherEnabled === false) return null;

    const { time } = override || getCurrent();
    sceneEl.classList.remove(...TIME_CLASSES);
    sceneEl.classList.add("time-" + time);

    ensureLayer(sceneEl, "stars",     buildStars,     time === "night");
    ensureLayer(sceneEl, "fireflies", buildFireflies, time === "night");

    if (time === "night") {
      const forced = CONFIG.forceMoonPhase;
      const phase = (typeof forced === "number") ? ((forced % 1) + 1) % 1 : getMoonPhase().phase;
      // Mappa phase → translateX dell'ombra (in %): 0=copertura totale, ±100=fuori.
      const shadowX = (phase <= 0.5) ? (-phase * 200) : ((1 - phase) * 200);
      sceneEl.style.setProperty("--moon-shadow-x", shadowX.toFixed(1) + "%");
    }

    return { time };
  }

  function ensureLayer(scene, className, factory, shouldExist) {
    const existing = scene.querySelector(":scope > ." + className);
    if (shouldExist && !existing) {
      const el = factory();
      el.classList.add(className);
      el.setAttribute("aria-hidden", "true");
      scene.appendChild(el);
    } else if (!shouldExist && existing) {
      existing.remove();
    }
  }

  function buildStars() {
    const layer = document.createElement("div");
    const COUNT = 55;
    for (let i = 0; i < COUNT; i++) {
      const s = document.createElement("span");
      s.className = "star";
      s.style.left = (Math.random() * 100).toFixed(2) + "%";
      s.style.top = (Math.random() * 55).toFixed(2) + "%";
      s.style.animationDelay = (-Math.random() * 4).toFixed(2) + "s";
      const size = (1 + Math.random() * 1.8).toFixed(2);
      s.style.width = size + "px";
      s.style.height = size + "px";
      layer.appendChild(s);
    }
    return layer;
  }

  function buildFireflies() {
    const layer = document.createElement("div");
    const COUNT = 12;
    for (let i = 0; i < COUNT; i++) {
      const f = document.createElement("span");
      f.className = "firefly";
      f.style.left = (8 + Math.random() * 84).toFixed(2) + "%";
      f.style.bottom = (8 + Math.random() * 32).toFixed(2) + "%";
      f.style.animationDelay = (-Math.random() * 6).toFixed(2) + "s";
      f.style.setProperty("--pulse-dur", (3.5 + Math.random() * 3).toFixed(2) + "s");
      f.style.setProperty("--drift-dur", (10 + Math.random() * 8).toFixed(2) + "s");
      layer.appendChild(f);
    }
    return layer;
  }

  window.GIARDINO_WEATHER = {
    apply,
    getCurrent,
    getTimeOfDay,
    getMoonPhase
  };
})();
