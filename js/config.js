/* =========================================================================
   CONFIG — Questo è l'UNICO file che devi modificare per personalizzare
   il giardino.

   Come si fa:
   1) Sostituisci [NOME] con il nome o il soprannome di lei.
   2) Scrivi i 7 messaggi, uno per ogni giorno. Possono essere brevi frasi
      d'amore, ricordi, dediche, versi, citazioni vostre.
   3) Scrivi la "sorpresa finale" che apparirà al 7° giorno. Può essere una
      lettera lunga, un invito, una promessa, o una foto.

   Salva il file, ricarica la pagina, e sei a posto.
   ======================================================================= */

window.GIARDINO_CONFIG = {

  // -------- NOME ----------------------------------------------------------
  // Il nome che apparirà nel titolo ("Il giardino di ...").
  girlfriendName: "Piccola",


  // -------- MESSAGGI GIORNALIERI ------------------------------------------
  // Esattamente 7 messaggi, uno per ogni giorno in cui cresce un fiore.
  // Tip: puoi usare \n per andare a capo dentro una frase.
  dailyMessages: [
    "Giorno 1 — Ciao amorino mio. Benvenuta in questo giardino speciale. Clicca ogni giorno sopra il vaso per far sbocciare un fiorellino. Un bacio! ",
    "Giorno 2 — Oh un altro fiorellino! Come stai oggi? Mi manchi tanto. Ti amo tanto.",
    "Giorno 3 — Sei così speciale. Il tuo sorriso fa sorridere le mie giornate!",
    "Giorno 4 — Ciao bubi, sei proprio piccolissima. Vorrei stringerti forte forte forte",
    "Giorno 5 — Lo sai che i papaveri sono alti alti altiiii.",
    "Giorno 6 — Aaaaah, sei tutta da sbaciucchiare. Dalla testa ai piedi",
    "Giorno 7 — Se sbocciasse un fiore ogni volta che ti penso ogni deserto ne sarebbe pieno."
  ],


  // -------- SORPRESA FINALE (giorno 7) ------------------------------------
  // Compare in un overlay a tutto schermo quando clicca per l'ultima volta.
  // type può essere: "text" (solo testo lungo) oppure "image" (testo + immagine).
  finalSurprise: {
    type: "text",
    title: "[Per la mia Piccola]",
    content:
      "[Ciao piccolina mia, spero che questo bouquet ti sia piaciuto.]\n\n" +
      "[Il mio cuore batte forte per te, quando è vicino a te, in presenza dei tuoi dolci pensieri e dei tuoi gesti]\n\n" +
      "[Ti amo tanto tanto tanto. 10^10^25 volte ti amo. Ora baciami forte.]",
    // Opzionale: se vuoi mostrare anche un'immagine (es. una vostra foto),
    // mettila dentro /assets/ e scrivi qui il percorso. Altrimenti null.
    imageUrl: null
  },


  // -------- OPZIONI -------------------------------------------------------
  // Mostra in alto a sinistra il contatore "Giorno X di 7".
  showDayCounter: true,

  // Se true, la musica parte automaticamente (i browser moderni la bloccano
  // quasi sempre finché l'utente non interagisce, quindi consigliato false).
  musicAutoplay: false,

  // Modalità debug: mostra in basso dei pulsanti per saltare avanti/indietro
  // nei giorni senza dover aspettare. METTI A false PRIMA DI REGALARGLIELO.
  debug: false,


  // -------- METEO DEL GIARDINO --------------------------------------------
  // L'atmosfera cambia in base all'ora reale (alba/giorno/tramonto/notte)
  // e al meteo del giorno (sereno/nuvoloso/pioggia, deterministico dalla data).
  // La pioggia è solo atmosferica: non conta come annaffiatura.

  weatherEnabled: true,

  // Per testare: forza una fascia oraria ("dawn"|"day"|"sunset"|"night").
  // Lascia null per il comportamento normale.
  forceTimeOfDay: null,

  // Per testare l'effetto giovedì senza aspettare il giorno giusto.
  // true = si attiva sempre (ignora il giorno e il "già visto oggi").
  forceThursday: false,

  // Per testare la fase lunare di notte. Numero tra 0 e 1:
  //   0 = luna nuova, 0.25 = primo quarto, 0.5 = piena, 0.75 = ultimo quarto.
  // Lascia null per usare la fase reale dalla data.
  forceMoonPhase: null,


};
