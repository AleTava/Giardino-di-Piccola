# Il Giardino 🌸

Un piccolo sito-regalo: un prato all'aria aperta con un bouquet che cresce
un fiore al giorno per 7 giorni. Ogni giorno lei clicca per dare acqua,
sblocca un nuovo fiore + un messaggio dolce, e al 7° giorno appare una
sorpresa finale.

## Come personalizzarlo

Apri `js/config.js` con un editor di testo (anche Blocco Note va bene) e
modifica solo:

1. `girlfriendName` → il suo nome o soprannome.
2. `dailyMessages` → i 7 messaggi, uno per giorno.
3. `finalSurprise` → titolo + contenuto della sorpresa finale.

Salva. Apri `index.html` nel browser con doppio clic. Pronto.

## Testare prima di regalarlo

`config.js` ha un flag `debug: true`. Con questo attivo, in fondo alla
pagina vedi un pannellino con:

- **+1 giorno (simula)** → finge che sia passato un giorno, così puoi
  cliccare di nuovo e vedere il fiore successivo.
- **−1 stadio** → torna indietro di un fiore.
- **Reset** → ricomincia da zero.

**IMPORTANTE:** prima di regalarglielo metti `debug: false` in `config.js`,
altrimenti vedrà il pannellino.

## Come pubblicarlo online (GitHub Pages)

1. Crea un account su [github.com](https://github.com) se non ce l'hai.
2. Crea un nuovo repository (es. `giardino`). Puoi metterlo pubblico —
   l'URL non sarà indicizzato subito e nessuno lo troverà senza il link.
3. Carica tutti i file di questa cartella nel repository (tramite
   interfaccia web "Add file → Upload files", oppure con Git).
4. Vai in **Settings → Pages**. Sotto "Source" seleziona `main` branch e
   cartella `/ (root)`. Salva.
5. Dopo 1-2 minuti il sito sarà su
   `https://<tuo-username>.github.io/giardino/`.
6. Condividi il link con lei.

## Audio ambient (opzionale)

Se vuoi la musica di sottofondo con uccellini/vento:

1. Scarica un file CC0 da [Pixabay](https://pixabay.com/music/) cercando
   "meadow ambience" o "soft birds".
2. Rinominalo in `ambient.mp3` e mettilo nella cartella `assets/`.
3. Se non lo metti, il pulsante musica ci sarà ma non suonerà nulla —
   niente errori.

## Struttura file

```
giardino/
├── index.html              ← apri questo in browser
├── styles.css              ← tutto lo stile
├── README.md               ← questa guida
├── js/
│   ├── config.js           ← 🌟 MODIFICA SOLO QUESTO
│   ├── state.js            ← logica giorni/progresso
│   ├── garden.js           ← rendering fiori e animazioni
│   └── app.js              ← collante
└── assets/
    └── ambient.mp3         ← (opzionale) audio ambient
```

## Come funziona la crescita

- Lei apre il sito, vede il vaso vuoto nel prato.
- Il primo click "dà acqua" → sboccia il primo fiore + messaggio giorno 1.
- Se ri-clicca lo stesso giorno: "Hai già dato acqua oggi ♡".
- Il giorno dopo può cliccare di nuovo → sboccia il secondo fiore.
- Se salta un giorno: niente panico, il bouquet "ha sete" (fiori un po'
  opachi) ma riprende appena lei torna. Nessun progresso perso.
- Al 7° click (settimo giorno effettivo), dopo l'animazione del girasole,
  parte l'overlay con la sorpresa finale.

## Note tecniche

- Solo HTML + CSS + JS vanilla, nessuna dipendenza, nessun build.
- Lo stato è nel `localStorage` del browser di lei. Se cambia computer,
  riparte da zero (il che è ok perché il rituale è pensato per un PC solo).
- Tutti gli SVG sono inline nel codice, così niente download esterni.
