/* =========================================================================
   STATE — Gestione del progresso nel localStorage.
   Stato = { startDate, daysWatered (0..7), lastWateredDate, musicEnabled }.
   ======================================================================= */

(function () {
  const STORAGE_KEY = "giardino_state_v1";

  function todayISO() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function daysBetween(isoA, isoB) {
    if (!isoA || !isoB) return 0;
    const a = new Date(isoA + "T00:00:00");
    const b = new Date(isoB + "T00:00:00");
    return Math.round((b - a) / 86400000);
  }

  function defaultState() {
    return {
      startDate: todayISO(),
      daysWatered: 0,
      lastWateredDate: null,
      musicEnabled: false
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const s = defaultState();
        save(s);
        return s;
      }
      const parsed = JSON.parse(raw);
      return Object.assign(defaultState(), parsed);
    } catch (e) {
      return defaultState();
    }
  }

  function save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Tenta di annaffiare. Ritorna un oggetto che descrive cosa è successo:
  //   { result: "grew",    newStage: N }   → fiore nuovo sbocciato
  //   { result: "already" }                → già annaffiato oggi
  //   { result: "complete" }                → bouquet già completo (stage 7)
  function tryWater(state) {
    if (state.daysWatered >= 7) {
      return { result: "complete" };
    }
    const today = todayISO();
    if (state.lastWateredDate === today) {
      return { result: "already" };
    }
    state.daysWatered += 1;
    state.lastWateredDate = today;
    save(state);
    return { result: "grew", newStage: state.daysWatered };
  }

  // True se è passato almeno un giorno dall'ultima annaffiatura e il bouquet
  // non è ancora completo. Usato per mostrare lo stato "hanno sete".
  function isThirsty(state) {
    if (state.daysWatered === 0) return false;        // non ancora iniziato
    if (state.daysWatered >= 7) return false;         // completo
    if (!state.lastWateredDate) return false;
    return daysBetween(state.lastWateredDate, todayISO()) >= 1;
  }

  // DEBUG — salta avanti di 1 giorno simulando che lastWateredDate sia ieri.
  function debugAdvanceDay(state) {
    if (state.lastWateredDate) {
      const d = new Date(state.lastWateredDate + "T00:00:00");
      d.setDate(d.getDate() - 1);
      state.lastWateredDate = d.toISOString().slice(0, 10);
    }
    save(state);
  }

  // DEBUG — fa retrocedere di 1 stadio.
  function debugBack(state) {
    state.daysWatered = Math.max(0, state.daysWatered - 1);
    state.lastWateredDate = null;
    save(state);
  }

  window.GIARDINO_STATE = {
    load, save, reset, tryWater, isThirsty,
    todayISO, debugAdvanceDay, debugBack
  };
})();
