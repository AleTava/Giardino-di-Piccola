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
  let debugWeatherOverride = null; // { time } se attivo via debug

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
    currentWeather = W.apply(root, debugWeatherOverride);
    if (CONFIG.debug) updateDbgInfo();
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
      <button data-act="auto-weather" title="Ripristina fascia automatica">Auto</button>
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
        debugWeatherOverride = { time: next };
        refreshWeather();
      } else if (act === "auto-weather") {
        debugWeatherOverride = null;
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
    const w = currentWeather || { time: "?" };
    const wTag = debugWeatherOverride ? "🔒" : "";
    info.textContent = `${state.daysWatered}/7 · last=${state.lastWateredDate || "—"} · ${w.time}${wTag}`;
  }

  // ---- Go ----------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", init);
})();
