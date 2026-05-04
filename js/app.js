/* =========================================================================
   APP — Bootstrap, event listeners, coordinazione fra state + garden.
   ======================================================================= */

(function () {
  const CONFIG = window.GIARDINO_CONFIG;
  const S = window.GIARDINO_STATE;
  const G = window.GIARDINO_GARDEN;
  const W = window.GIARDINO_WEATHER;

  // ---- DOM refs ----------------------------------------------------------
  const root = document.getElementById("scene");
  const vaseEl = document.getElementById("vase");
  const clickTarget = document.getElementById("vase-click");
  const flowersLayer = document.getElementById("flowers");
  const dropsLayer = document.getElementById("drops");
  const messageCard = document.getElementById("message");
  const surpriseOverlay = document.getElementById("surprise");
  const surpriseClose = document.getElementById("surprise-close");
  const surpriseRestart = document.getElementById("surprise-restart");
  const titleNameEl = document.getElementById("title-name");
  const dayCounterEl = document.getElementById("day-counter");
  const debugPanel = document.getElementById("debug");

  // ---- State -------------------------------------------------------------
  let state = S.load();
  let currentWeather = null;
  let debugWeatherOverride = null; // { time, condition } se attivo via debug

  // ---- Init --------------------------------------------------------------
  function init() {
    titleNameEl.textContent = CONFIG.girlfriendName || "te";

    G.mountVase(vaseEl);
    G.mountFlowers(flowersLayer);

    refreshWeather();
    // Ricontrolla ogni minuto: l'ora reale può cambiare fascia mentre la tab è aperta.
    setInterval(refreshWeather, 60 * 1000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) refreshWeather();
    });

    refreshUI();

    clickTarget.addEventListener("click", onWater);
    surpriseClose.addEventListener("click", () => G.hideFinalSurprise(surpriseOverlay));
    surpriseRestart.addEventListener("click", () => {
      S.reset();
      state = S.load();
      G.hideFinalSurprise(surpriseOverlay);
      refreshUI();
    });
    if (CONFIG.debug) {
      mountDebugPanel();
    }
  }

  function refreshUI() {
    // Stadio corrente (senza animazione "new bloom")
    G.renderStage(flowersLayer, state.daysWatered);
    G.setThirsty(root, S.isThirsty(state));

    if (CONFIG.showDayCounter) {
      dayCounterEl.textContent = `Giorno ${state.daysWatered} di 7`;
      dayCounterEl.style.display = "";
    } else {
      dayCounterEl.style.display = "none";
    }

    if (CONFIG.debug) updateDbgInfo();
  }

  function refreshWeather() {
    if (!W) return;
    const prev = currentWeather;
    currentWeather = W.apply(root, debugWeatherOverride);
    if (CONFIG.debug) updateDbgInfo();
    maybeShowWeatherMessage(prev);
  }

  // Messaggi meteo: una sola volta al giorno per ognuno, e solo quando lo
  // stato è "appena cambiato" (non li riproponiamo ad ogni interval refresh).
  //  - duringRain: oggi piove e l'apertura/transizione è appena avvenuta.
  //  - postRain:   è il giorno dopo una pioggia che lei ha visto.
  const STORAGE_RAIN_MSG = "giardino_rain_msg_shown";
  const STORAGE_POSTRAIN_MSG = "giardino_postrain_msg_shown";
  function todayKey() {
    const d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function readLS(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function writeLS(key, v) { try { localStorage.setItem(key, v); } catch (e) {} }
  function debugClearMessageFlags() {
    try {
      localStorage.removeItem(STORAGE_RAIN_MSG);
      localStorage.removeItem(STORAGE_POSTRAIN_MSG);
    } catch (e) {}
  }

  function maybeShowWeatherMessage(prev) {
    if (!currentWeather) return;
    const cfg = CONFIG.weatherMessages || {};
    if (cfg.enabled === false) return;

    const today = todayKey();
    const isRain = currentWeather.condition === "rain";
    const isPostRain = !!currentWeather.postRain;
    const wasRain = !!(prev && prev.condition === "rain");
    const wasPostRain = !!(prev && prev.postRain);

    if (isRain && cfg.duringRain) {
      const justBecame = !prev || !wasRain;
      if (justBecame && readLS(STORAGE_RAIN_MSG) !== today) {
        showWeatherMessage(cfg.duringRain, "rain-msg");
        writeLS(STORAGE_RAIN_MSG, today);
      }
    } else if (isPostRain && cfg.postRain) {
      const justBecame = !prev || !wasPostRain;
      if (justBecame && readLS(STORAGE_POSTRAIN_MSG) !== today) {
        showWeatherMessage(cfg.postRain, "post-rain");
        writeLS(STORAGE_POSTRAIN_MSG, today);
      }
    }
  }
  function showWeatherMessage(text, toneClass) {
    messageCard.textContent = text;
    messageCard.className = "message-card " + toneClass + " visible";
    setTimeout(() => {
      if (messageCard.classList.contains(toneClass)) {
        messageCard.classList.remove("visible");
      }
    }, 7000);
  }

  // ---- Actions -----------------------------------------------------------
  function onWater() {
    G.playWateringAnimation(dropsLayer);

    const r = S.tryWater(state);

    if (r.result === "grew") {
      // Aspetta un attimo per far vedere le gocce prima del bloom
      setTimeout(() => {
        G.renderStage(flowersLayer, state.daysWatered, { newStage: r.newStage });
        G.setThirsty(root, false);
        const msg = CONFIG.dailyMessages[r.newStage - 1] || "";
        G.showMessage(messageCard, msg, "bloom");

        if (state.daysWatered >= 7) {
          setTimeout(() => {
            G.showFinalSurprise(surpriseOverlay, CONFIG.finalSurprise);
          }, 4200);
        }
        refreshUI();
      }, 700);

    } else if (r.result === "already") {
      G.showMessage(
        messageCard,
        "Hai già dato acqua oggi ♡ Torna domani per il prossimo fiore.",
        "already"
      );

    } else if (r.result === "complete") {
      G.showFinalSurprise(surpriseOverlay, CONFIG.finalSurprise);
    }
  }

  // ---- DEBUG -------------------------------------------------------------
  function mountDebugPanel() {
    debugPanel.style.display = "";
    debugPanel.innerHTML = `
      <span class="dbg-label">DEBUG</span>
      <button data-act="advance" title="Simula un giorno in più">+1g</button>
      <button data-act="back" title="Torna indietro di uno stadio">-1</button>
      <button data-act="reset" title="Reset completo">Reset</button>
      <button data-act="cycle-time" title="Cambia fascia oraria">Ora</button>
      <button data-act="cycle-weather" title="Cambia meteo">Meteo</button>
      <button data-act="auto-weather" title="Ripristina meteo automatico">Auto</button>
      <button data-act="postrain" title="Simula 'ieri ha piovuto'">Post🌧</button>
      <span class="dbg-info"></span>
    `;
    debugPanel.addEventListener("click", (ev) => {
      const btn = ev.target.closest("button");
      if (!btn) return;
      const act = btn.dataset.act;
      if (act === "advance") {
        S.debugAdvanceDay(state);
      } else if (act === "back") {
        S.debugBack(state);
      } else if (act === "reset") {
        S.reset();
        state = S.load();
      } else if (act === "cycle-time") {
        const order = ["dawn", "day", "sunset", "night"];
        const cur = (debugWeatherOverride || currentWeather || {}).time || "day";
        const next = order[(order.indexOf(cur) + 1) % order.length];
        debugWeatherOverride = {
          time: next,
          condition: (debugWeatherOverride || currentWeather || {}).condition || "clear"
        };
        debugClearMessageFlags();
        refreshWeather();
      } else if (act === "cycle-weather") {
        const order = ["clear", "cloudy", "rain"];
        const cur = (debugWeatherOverride || currentWeather || {}).condition || "clear";
        const next = order[(order.indexOf(cur) + 1) % order.length];
        debugWeatherOverride = {
          time: (debugWeatherOverride || currentWeather || {}).time || "day",
          condition: next
        };
        debugClearMessageFlags();
        refreshWeather();
      } else if (act === "auto-weather") {
        debugWeatherOverride = null;
        debugClearMessageFlags();
        refreshWeather();
      } else if (act === "postrain") {
        // Simula che ieri abbia visto la pioggia: scrive ieri in localStorage
        // e forza meteo di oggi a non-pioggia. Cliccare di nuovo annulla.
        const RAIN_KEY = "giardino_last_rain_seen";
        const d = new Date(); d.setDate(d.getDate() - 1);
        const yKey = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        if (localStorage.getItem(RAIN_KEY) === yKey) {
          localStorage.removeItem(RAIN_KEY);
        } else {
          localStorage.setItem(RAIN_KEY, yKey);
          if (!debugWeatherOverride || debugWeatherOverride.condition === "rain") {
            debugWeatherOverride = {
              time: (debugWeatherOverride || currentWeather || {}).time || "day",
              condition: "clear"
            };
          }
        }
        debugClearMessageFlags();
        refreshWeather();
      }
      refreshUI();
      updateDbgInfo();
    });
    updateDbgInfo();
  }

  function updateDbgInfo() {
    const info = debugPanel.querySelector(".dbg-info");
    if (!info) return;
    const w = currentWeather || { time: "?", condition: "?" };
    const wTag = debugWeatherOverride ? "🔒" : "";
    const pr = w.postRain ? " · post🌧" : "";
    info.textContent = `${state.daysWatered}/7 · last=${state.lastWateredDate || "—"} · ${w.time}/${w.condition}${wTag}${pr}`;
  }

  // ---- Go ----------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", init);
})();
