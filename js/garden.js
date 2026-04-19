/* =========================================================================
   GARDEN — Rendering della scena, fiori, animazioni e messaggi.
   Gli SVG sono inline qui dentro così il sito funziona senza dipendenze.
   ======================================================================= */

(function () {

  // ------------ SVG DEL VASO ----------------------------------------------
  const VASE_SVG = `
    <svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="vaseGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#f4e4d0"/>
          <stop offset="45%" stop-color="#dcb892"/>
          <stop offset="100%" stop-color="#b8905a"/>
        </linearGradient>
      </defs>
      <!-- Bocca del vaso -->
      <ellipse cx="120" cy="28" rx="88" ry="14" fill="#a07a50" opacity="0.6"/>
      <!-- Corpo del vaso (più panciuto e alto) -->
      <path d="M 32,28 Q 22,110 48,162 Q 120,180 192,162 Q 218,110 208,28 Z"
            fill="url(#vaseGrad)" stroke="#7a5a3a" stroke-width="2.2"/>
      <!-- Interno buio sulla bocca -->
      <ellipse cx="120" cy="30" rx="84" ry="9" fill="#2a1808" opacity="0.45"/>
      <!-- Riflesso di luce -->
      <path d="M 55,60 Q 70,100 58,155" stroke="#ffffff" stroke-width="3"
            fill="none" opacity="0.35" stroke-linecap="round"/>
      <path d="M 200,80 Q 210,120 195,150" stroke="#7a5a3a" stroke-width="2"
            fill="none" opacity="0.35" stroke-linecap="round"/>
      <!-- Decoro orizzontale sottile -->
      <path d="M 48,75 Q 120,82 192,75" stroke="#9a7548" stroke-width="1.5"
            fill="none" opacity="0.55"/>
    </svg>`;

  // ------------ SVG DEI 7 FIORI -------------------------------------------
  // Ogni fiore e un SVG completo con stelo + corolla. viewBox 0 0 100 220.
  // Gli ID delle gradient sono prefissati f{N}- per evitare collisioni globali.
  // Stile: bouquet illustrato, meno "clipart" e piu botanico.
  const INK = "#2a2118";          // contorno "inchiostro"
  const INK2 = "#1d1610";
  const STEM_STROKE = "#2e4a1c";  // stelo/foglie contorno
  const LEAF_FILL = "#6b9a47";

  const FLOWERS = {
    // 1. Margherita crema con centro albicocca
    1: `<svg viewBox="0 0 100 220" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="f1-wc" x="-45%" y="-45%" width="190%" height="190%">
              <feGaussianBlur stdDeviation="4"/>
            </filter>
            <radialGradient id="f1-petal" cx="50%" cy="38%" r="70%">
              <stop offset="0%" stop-color="#fffef8"/>
              <stop offset="68%" stop-color="#f8f1df"/>
              <stop offset="100%" stop-color="#eadcc1"/>
            </radialGradient>
            <radialGradient id="f1-core" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#f8d27b"/>
              <stop offset="100%" stop-color="#d7902d"/>
            </radialGradient>
          </defs>
          <path d="M 49,220 Q 54,170 52,128 Q 50,88 49,68" stroke="${STEM_STROKE}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
          <path d="M 50,158 Q 34,148 24,156 Q 34,171 50,164 Z" fill="${LEAF_FILL}" stroke="${STEM_STROKE}" stroke-width="1.3" stroke-linejoin="round"/>
          <path d="M 50,126 Q 62,116 74,122 Q 68,138 50,132 Z" fill="#7bad57" stroke="${STEM_STROKE}" stroke-width="1.3" stroke-linejoin="round"/>
          <path d="M 30,154 Q 40,157 46,163" stroke="#86b861" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.8"/>
          <path d="M 56,125 Q 63,126 68,128" stroke="#8ec06a" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.8"/>
          <ellipse cx="51" cy="58" rx="29" ry="30" fill="#f6d9dd" filter="url(#f1-wc)" opacity="0.45"/>
          <g transform="translate(51 58)" fill="url(#f1-petal)" stroke="${INK}" stroke-width="1.05" stroke-linejoin="round" opacity="0.98">
            <ellipse cx="0" cy="-24" rx="7.5" ry="18"/>
            <ellipse cx="0" cy="-24" rx="7.2" ry="18" transform="rotate(27)"/>
            <ellipse cx="0" cy="-24" rx="7" ry="17.8" transform="rotate(54)"/>
            <ellipse cx="0" cy="-24" rx="7.4" ry="18.4" transform="rotate(81)"/>
            <ellipse cx="0" cy="-24" rx="7.2" ry="18" transform="rotate(108)"/>
            <ellipse cx="0" cy="-24" rx="7.5" ry="18.5" transform="rotate(135)"/>
            <ellipse cx="0" cy="-24" rx="7.1" ry="17.7" transform="rotate(162)"/>
            <ellipse cx="0" cy="-24" rx="7.2" ry="18.2" transform="rotate(189)"/>
            <ellipse cx="0" cy="-24" rx="7" ry="17.8" transform="rotate(216)"/>
            <ellipse cx="0" cy="-24" rx="7.4" ry="18.1" transform="rotate(243)"/>
            <ellipse cx="0" cy="-24" rx="7.1" ry="17.8" transform="rotate(270)"/>
            <ellipse cx="0" cy="-24" rx="7.3" ry="18.4" transform="rotate(297)"/>
            <ellipse cx="0" cy="-24" rx="7" ry="18" transform="rotate(324)"/>
            <ellipse cx="0" cy="-24" rx="7.1" ry="17.9" transform="rotate(351)"/>
          </g>
          <circle cx="51" cy="58" r="8.8" fill="url(#f1-core)" stroke="${INK}" stroke-width="1.3"/>
          <g fill="#9a6118" opacity="0.65">
            <circle cx="48" cy="55" r="0.8"/><circle cx="52" cy="55.4" r="0.8"/>
            <circle cx="54.5" cy="58.5" r="0.8"/><circle cx="50" cy="60.8" r="0.8"/>
            <circle cx="46.8" cy="58.6" r="0.8"/><circle cx="52.2" cy="61.6" r="0.7"/>
          </g>
        </svg>`,

    // 2. Tulipano pesca
    2: `<svg viewBox="0 0 100 220" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="f2-wc" x="-45%" y="-45%" width="190%" height="190%">
              <feGaussianBlur stdDeviation="3.6"/>
            </filter>
            <linearGradient id="f2-petal" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#ffd8bb"/>
              <stop offset="55%" stop-color="#f39c67"/>
              <stop offset="100%" stop-color="#cb6437"/>
            </linearGradient>
          </defs>
          <path d="M 49,220 Q 46,160 50,108 Q 53,86 51,70" stroke="${STEM_STROKE}" stroke-width="2.3" fill="none" stroke-linecap="round"/>
          <path d="M 50,150 Q 63,138 77,145 Q 67,160 50,156 Z" fill="${LEAF_FILL}" stroke="${STEM_STROKE}" stroke-width="1.25" stroke-linejoin="round"/>
          <path d="M 49,124 Q 36,112 24,120 Q 31,136 48,130 Z" fill="#7fb65c" stroke="${STEM_STROKE}" stroke-width="1.2" stroke-linejoin="round"/>
          <ellipse cx="50" cy="70" rx="24" ry="30" fill="#ffd7ca" filter="url(#f2-wc)" opacity="0.45"/>
          <g transform="translate(50 68)" stroke="${INK}" stroke-width="1.25" stroke-linejoin="round" stroke-linecap="round">
            <path d="M -18,16 Q -24,-4 -12,-19 Q -8,-26 -3,-22 Q -2,-6 -4,11 Q -8,21 -18,16 Z" fill="#d96f48"/>
            <path d="M 18,16 Q 24,-4 12,-19 Q 8,-26 3,-22 Q 2,-6 4,11 Q 8,21 18,16 Z" fill="#cf633a"/>
            <path d="M -8,18 Q -11,-8 0,-26 Q 11,-8 8,18 Q 0,24 -8,18 Z" fill="url(#f2-petal)"/>
            <path d="M -2,-22 Q 1,-12 0,2" fill="none" stroke="#ffefd8" stroke-width="1.1" opacity="0.85"/>
            <path d="M -9,8 Q -6,4 -3,4" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.55"/>
            <path d="M 9,8 Q 6,4 3,4" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.55"/>
          </g>
        </svg>`,

    // 3. Fiordaliso ardesia
    3: `<svg viewBox="0 0 100 220" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="f3-wc" x="-45%" y="-45%" width="190%" height="190%">
              <feGaussianBlur stdDeviation="3.4"/>
            </filter>
            <linearGradient id="f3-petal" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#d7e5ff"/>
              <stop offset="55%" stop-color="#7e98d4"/>
              <stop offset="100%" stop-color="#5068a8"/>
            </linearGradient>
          </defs>
          <path d="M 49,220 Q 53,162 52,114 Q 51,82 50,62" stroke="${STEM_STROKE}" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M 49,154 Q 60,147 71,154 Q 60,163 49,159 Z" fill="#77a953" stroke="${STEM_STROKE}" stroke-width="1.2" stroke-linejoin="round"/>
          <ellipse cx="50" cy="58" rx="23" ry="22" fill="#c8d4f1" filter="url(#f3-wc)" opacity="0.42"/>
          <g transform="translate(50 58)" fill="url(#f3-petal)" stroke="${INK}" stroke-width="1.05" stroke-linejoin="round" stroke-linecap="round">
            <path d="M 0,0 L -7,-11 L -4,-23 L 0,-19 L 4,-23 L 7,-11 Z"/>
            <path d="M 0,0 L -7,-11 L -4,-23 L 0,-19 L 4,-23 L 7,-11 Z" transform="rotate(45)"/>
            <path d="M 0,0 L -7,-11 L -4,-23 L 0,-19 L 4,-23 L 7,-11 Z" transform="rotate(90)"/>
            <path d="M 0,0 L -7,-11 L -4,-23 L 0,-19 L 4,-23 L 7,-11 Z" transform="rotate(135)"/>
            <path d="M 0,0 L -7,-11 L -4,-23 L 0,-19 L 4,-23 L 7,-11 Z" transform="rotate(180)"/>
            <path d="M 0,0 L -7,-11 L -4,-23 L 0,-19 L 4,-23 L 7,-11 Z" transform="rotate(225)"/>
            <path d="M 0,0 L -7,-11 L -4,-23 L 0,-19 L 4,-23 L 7,-11 Z" transform="rotate(270)"/>
            <path d="M 0,0 L -7,-11 L -4,-23 L 0,-19 L 4,-23 L 7,-11 Z" transform="rotate(315)"/>
          </g>
          <circle cx="50" cy="58" r="5.8" fill="#32467d" stroke="${INK}" stroke-width="1"/>
          <circle cx="50" cy="58" r="2.1" fill="#edd17f"/>
        </svg>`,

    // 4. Rosa cipria
    4: `<svg viewBox="0 0 100 220" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="f4-wc" x="-45%" y="-45%" width="190%" height="190%">
              <feGaussianBlur stdDeviation="4"/>
            </filter>
            <radialGradient id="f4-rose" cx="48%" cy="40%" r="70%">
              <stop offset="0%" stop-color="#ffd6d2"/>
              <stop offset="55%" stop-color="#ef9d9e"/>
              <stop offset="100%" stop-color="#c97679"/>
            </radialGradient>
          </defs>
          <path d="M 49,220 Q 48,158 50,110 Q 51,86 50,74" stroke="${STEM_STROKE}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
          <path d="M 50,149 Q 35,140 24,148 Q 35,162 50,155 Z" fill="${LEAF_FILL}" stroke="${STEM_STROKE}" stroke-width="1.2" stroke-linejoin="round"/>
          <path d="M 50,120 Q 63,113 75,118 Q 68,132 50,127 Z" fill="#80b05c" stroke="${STEM_STROKE}" stroke-width="1.2" stroke-linejoin="round"/>
          <ellipse cx="50" cy="62" rx="30" ry="30" fill="#ffd7d3" filter="url(#f4-wc)" opacity="0.45"/>
          <g transform="translate(50 62)" stroke="${INK}" stroke-width="1.05" stroke-linejoin="round" stroke-linecap="round">
            <path d="M -24,2 Q -20,-17 -4,-21 Q 0,-18 3,-13 Q 8,-20 21,-14 Q 28,-2 22,12 Q 12,23 -4,22 Q -18,20 -24,2 Z" fill="url(#f4-rose)"/>
            <path d="M -18,2 Q -14,-10 -5,-11 Q 0,-8 2,-2 Q 4,-9 13,-8 Q 19,-1 15,9 Q 9,17 -2,17 Q -13,16 -18,2 Z" fill="#e99798"/>
            <path d="M -9,1 Q -7,-5 -2,-6 Q 1,-4 2,-1 Q 4,-5 8,-4 Q 11,0 8,5 Q 5,10 -1,10 Q -6,10 -9,1 Z" fill="#d67980"/>
            <path d="M -16,13 Q -8,9 -5,3" fill="none" stroke="#f8d7d4" stroke-width="0.95" opacity="0.8"/>
            <path d="M 15,11 Q 9,8 6,2" fill="none" stroke="#f8d7d4" stroke-width="0.95" opacity="0.8"/>
            <path d="M -2,-10 Q 1,-8 3,-5" fill="none" stroke="${INK}" stroke-width="0.75" opacity="0.65"/>
          </g>
        </svg>`,

    // 5. Papavero cremisi
    5: `<svg viewBox="0 0 100 220" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="f5-wc" x="-45%" y="-45%" width="190%" height="190%">
              <feGaussianBlur stdDeviation="3.5"/>
            </filter>
            <radialGradient id="f5-petal" cx="50%" cy="38%" r="72%">
              <stop offset="0%" stop-color="#ff9083"/>
              <stop offset="55%" stop-color="#dd4f4f"/>
              <stop offset="100%" stop-color="#962d38"/>
            </radialGradient>
          </defs>
          <path d="M 50,220 Q 53,170 52,128 Q 51,92 50,74" stroke="${STEM_STROKE}" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M 50,144 Q 61,136 73,143 Q 62,154 50,148 Z" fill="${LEAF_FILL}" stroke="${STEM_STROKE}" stroke-width="1.2" stroke-linejoin="round"/>
          <ellipse cx="50" cy="66" rx="23" ry="22" fill="#f2bbbe" filter="url(#f5-wc)" opacity="0.45"/>
          <g transform="translate(50 66)" fill="url(#f5-petal)" stroke="${INK}" stroke-width="1.05" stroke-linejoin="round" stroke-linecap="round">
            <path d="M 0,0 Q -20,2 -18,-17 Q -10,-28 0,-20 Q 10,-28 18,-17 Q 20,2 0,0 Z"/>
            <path d="M 0,0 Q -18,-1 -20,16 Q -8,24 0,19 Q 8,24 20,16 Q 18,-1 0,0 Z"/>
            <path d="M 0,0 Q -2,-18 -18,-16 Q -24,-5 -18,6 Q -10,8 0,0 Z"/>
            <path d="M 0,0 Q 2,-18 18,-16 Q 24,-5 18,6 Q 10,8 0,0 Z"/>
          </g>
          <circle cx="50" cy="66" r="6.5" fill="${INK2}" stroke="${INK}" stroke-width="0.9"/>
          <g fill="#e6be73">
            <circle cx="48.5" cy="63.2" r="0.75"/><circle cx="51.6" cy="63.6" r="0.75"/>
            <circle cx="54" cy="66" r="0.72"/><circle cx="50.2" cy="68.8" r="0.72"/>
            <circle cx="46.3" cy="66.6" r="0.72"/>
          </g>
        </svg>`,

    // 6. Lavanda — spiga con boccioli allungati a coppie
    6: `<svg viewBox="0 0 100 220" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="f6-wc" x="-60%" y="-30%" width="220%" height="160%">
              <feGaussianBlur stdDeviation="3.5"/>
            </filter>
            <linearGradient id="f6-bud" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#e4d0f8"/>
              <stop offset="50%" stop-color="#a87cd4"/>
              <stop offset="100%" stop-color="#6e45a8"/>
            </linearGradient>
          </defs>
          <!-- stelo principale -->
          <path d="M 50,220 Q 48,165 50,120 Q 52,85 50,46" stroke="${STEM_STROKE}" stroke-width="2" fill="none" stroke-linecap="round"/>
          <!-- foglie strette tipiche della lavanda -->
          <path d="M 49,162 Q 34,156 26,162 Q 34,170 49,165 Z" fill="${LEAF_FILL}" stroke="${STEM_STROKE}" stroke-width="1.1" stroke-linejoin="round"/>
          <path d="M 51,162 Q 66,156 74,162 Q 66,170 51,165 Z" fill="${LEAF_FILL}" stroke="${STEM_STROKE}" stroke-width="1.1" stroke-linejoin="round"/>
          <path d="M 49,134 Q 36,128 28,134 Q 36,142 49,137 Z" fill="#7ab054" stroke="${STEM_STROKE}" stroke-width="1" stroke-linejoin="round"/>
          <path d="M 51,134 Q 64,128 72,134 Q 64,142 51,137 Z" fill="#7ab054" stroke="${STEM_STROKE}" stroke-width="1" stroke-linejoin="round"/>
          <!-- macchia acquerello dietro la spiga -->
          <ellipse cx="50" cy="75" rx="18" ry="34" fill="#c8a8e8" filter="url(#f6-wc)" opacity="0.5"/>
          <!-- spiga: coppie di boccioli allungati, dal basso verso l'alto sempre più piccoli -->
          <g fill="url(#f6-bud)" stroke="${INK}" stroke-width="0.85" stroke-linejoin="round">
            <!-- coppia 1 (base, più grande) -->
            <path d="M 50,108 Q 44,104 43,97 Q 45,91 50,93 Z" />
            <path d="M 50,108 Q 56,104 57,97 Q 55,91 50,93 Z" />
            <!-- coppia 2 -->
            <path d="M 50,94 Q 44,90 43,83 Q 46,78 50,80 Z" />
            <path d="M 50,94 Q 56,90 57,83 Q 54,78 50,80 Z" />
            <!-- coppia 3 -->
            <path d="M 50,81 Q 44,77 44,71 Q 46,66 50,67 Z" />
            <path d="M 50,81 Q 56,77 56,71 Q 54,66 50,67 Z" />
            <!-- coppia 4 -->
            <path d="M 50,68 Q 45,65 45,59 Q 47,55 50,56 Z" />
            <path d="M 50,68 Q 55,65 55,59 Q 53,55 50,56 Z" />
            <!-- coppia 5 (cima, più piccola) -->
            <path d="M 50,57 Q 45,54 46,49 Q 48,46 50,47 Z" />
            <path d="M 50,57 Q 55,54 54,49 Q 52,46 50,47 Z" />
          </g>
          <!-- nervature interne ai boccioli -->
          <g stroke="#e8d4f8" stroke-width="0.5" fill="none" stroke-linecap="round" opacity="0.8">
            <line x1="46" y1="100" x2="47" y2="94"/>
            <line x1="54" y1="100" x2="53" y2="94"/>
            <line x1="46" y1="87" x2="47" y2="81"/>
            <line x1="54" y1="87" x2="53" y2="81"/>
            <line x1="47" y1="74" x2="47" y2="68"/>
            <line x1="53" y1="74" x2="53" y2="68"/>
          </g>
        </svg>`,

    // 7. Girasole ocra
    7: `<svg viewBox="0 0 100 220" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="f7-wc" x="-45%" y="-45%" width="190%" height="190%">
              <feGaussianBlur stdDeviation="4"/>
            </filter>
            <linearGradient id="f7-petal" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#ffe48d"/>
              <stop offset="55%" stop-color="#f0b13a"/>
              <stop offset="100%" stop-color="#c87d1c"/>
            </linearGradient>
            <radialGradient id="f7-core" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#6b4220"/>
              <stop offset="100%" stop-color="#2b1709"/>
            </radialGradient>
          </defs>
          <path d="M 50,220 Q 52,163 51,118 Q 50,86 50,54" stroke="${STEM_STROKE}" stroke-width="2.7" fill="none" stroke-linecap="round"/>
          <path d="M 50,145 Q 35,136 24,144 Q 35,158 50,151 Z" fill="${LEAF_FILL}" stroke="${STEM_STROKE}" stroke-width="1.2" stroke-linejoin="round"/>
          <path d="M 50,111 Q 63,104 75,110 Q 67,125 50,118 Z" fill="#7ea959" stroke="${STEM_STROKE}" stroke-width="1.2" stroke-linejoin="round"/>
          <ellipse cx="50" cy="55" rx="33" ry="31" fill="#ffe2a5" filter="url(#f7-wc)" opacity="0.4"/>
          <g transform="translate(50 55)" fill="url(#f7-petal)" stroke="${INK}" stroke-width="0.95" stroke-linejoin="round" stroke-linecap="round">
            <path d="M 0,-12 Q -6,-20 -4,-29 Q 0,-34 4,-29 Q 6,-20 0,-12 Z"/>
            <path d="M 0,-12 Q -6,-20 -4,-29 Q 0,-34 4,-29 Q 6,-20 0,-12 Z" transform="rotate(20)"/>
            <path d="M 0,-12 Q -6,-20 -4,-29 Q 0,-34 4,-29 Q 6,-20 0,-12 Z" transform="rotate(40)"/>
            <path d="M 0,-12 Q -6,-20 -4,-29 Q 0,-34 4,-29 Q 6,-20 0,-12 Z" transform="rotate(60)"/>
            <path d="M 0,-12 Q -6,-20 -4,-29 Q 0,-34 4,-29 Q 6,-20 0,-12 Z" transform="rotate(80)"/>
            <path d="M 0,-12 Q -6,-20 -4,-29 Q 0,-34 4,-29 Q 6,-20 0,-12 Z" transform="rotate(100)"/>
            <path d="M 0,-12 Q -6,-20 -4,-29 Q 0,-34 4,-29 Q 6,-20 0,-12 Z" transform="rotate(120)"/>
            <path d="M 0,-12 Q -6,-20 -4,-29 Q 0,-34 4,-29 Q 6,-20 0,-12 Z" transform="rotate(140)"/>
            <path d="M 0,-12 Q -6,-20 -4,-29 Q 0,-34 4,-29 Q 6,-20 0,-12 Z" transform="rotate(160)"/>
            <path d="M 0,-12 Q -6,-20 -4,-29 Q 0,-34 4,-29 Q 6,-20 0,-12 Z" transform="rotate(180)"/>
            <path d="M 0,-12 Q -6,-20 -4,-29 Q 0,-34 4,-29 Q 6,-20 0,-12 Z" transform="rotate(200)"/>
            <path d="M 0,-12 Q -6,-20 -4,-29 Q 0,-34 4,-29 Q 6,-20 0,-12 Z" transform="rotate(220)"/>
            <path d="M 0,-12 Q -6,-20 -4,-29 Q 0,-34 4,-29 Q 6,-20 0,-12 Z" transform="rotate(240)"/>
            <path d="M 0,-12 Q -6,-20 -4,-29 Q 0,-34 4,-29 Q 6,-20 0,-12 Z" transform="rotate(260)"/>
            <path d="M 0,-12 Q -6,-20 -4,-29 Q 0,-34 4,-29 Q 6,-20 0,-12 Z" transform="rotate(280)"/>
            <path d="M 0,-12 Q -6,-20 -4,-29 Q 0,-34 4,-29 Q 6,-20 0,-12 Z" transform="rotate(300)"/>
            <path d="M 0,-12 Q -6,-20 -4,-29 Q 0,-34 4,-29 Q 6,-20 0,-12 Z" transform="rotate(320)"/>
            <path d="M 0,-12 Q -6,-20 -4,-29 Q 0,-34 4,-29 Q 6,-20 0,-12 Z" transform="rotate(340)"/>
          </g>
          <circle cx="50" cy="55" r="12.5" fill="url(#f7-core)" stroke="${INK}" stroke-width="1.1"/>
          <circle cx="50" cy="55" r="8.5" fill="#342013" opacity="0.9"/>
          <g fill="#d7aa58" opacity="0.9">
            <circle cx="46" cy="51.5" r="0.85"/><circle cx="50" cy="50.5" r="0.85"/>
            <circle cx="54.2" cy="52" r="0.85"/><circle cx="47" cy="55.8" r="0.85"/>
            <circle cx="51" cy="56.2" r="0.85"/><circle cx="54.5" cy="57" r="0.85"/>
            <circle cx="49" cy="60" r="0.8"/>
          </g>
        </svg>`
  };

  // Posizioni fisse per ogni fiore (come emerge dal vaso). Il fiore più
  // recente appare al centro, quelli precedenti si spostano di lato.
  const POSITIONS = {
    1: { x: 6,   y: 1,  rot: 12,  scale: 0.93, z: 4, floatAmp: 1.5, floatDuration: 7.2 },
    2: { x: -7,  y: 0,  rot: -16, scale: 0.98, z: 3, floatAmp: 1.7, floatDuration: 7.8 },
    3: { x: 10,  y: -1, rot: 20,  scale: 0.9,  z: 3, floatAmp: 1.9, floatDuration: 8.2 },
    4: { x: -12, y: -2, rot: -24, scale: 0.9,  z: 2, floatAmp: 2.2, floatDuration: 8.6 },
    5: { x: 13,  y: -2, rot: 26,  scale: 0.88, z: 2, floatAmp: 2.1, floatDuration: 8.4 },
    6: { x: -4,  y: 4,  rot: -8,  scale: 1.08, z: 5, floatAmp: 1.2, floatDuration: 6.7 },
    7: { x: 0,   y: 2,  rot: 2,   scale: 1.13, z: 6, floatAmp: 1.1, floatDuration: 6.3 }
  };

  // ------------ RENDER ----------------------------------------------------
  function mountVase(container) {
    container.innerHTML = VASE_SVG;
  }

  function mountFlowers(container) {
    container.innerHTML = "";
    for (let i = 1; i <= 7; i++) {
      const p = POSITIONS[i];
      const div = document.createElement("div");
      div.className = "flower flower-" + i;
      div.dataset.stage = i;
      div.style.setProperty("--x", p.x + "%");
      div.style.setProperty("--y", p.y + "%");
      div.style.setProperty("--rot", p.rot + "deg");
      div.style.setProperty("--scale", p.scale);
      div.style.setProperty("--float-amp", (p.floatAmp || 1.5) + "deg");
      div.style.setProperty("--float-duration", (p.floatDuration || 7.5) + "s");
      div.style.zIndex = p.z;
      div.innerHTML = FLOWERS[i];
      container.appendChild(div);
    }
  }

  function renderStage(container, stage, opts) {
    opts = opts || {};
    const flowers = container.querySelectorAll(".flower");
    flowers.forEach((el) => {
      const s = Number(el.dataset.stage);
      if (s <= stage) {
        // Se è stato appena sbloccato, fai partire l'animazione bloom
        if (opts.newStage === s && !el.classList.contains("bloomed")) {
          el.classList.add("bloomed", "just-bloomed");
          setTimeout(() => el.classList.remove("just-bloomed"), 2200);
        } else {
          el.classList.add("bloomed");
        }
      } else {
        el.classList.remove("bloomed", "just-bloomed");
      }
    });
  }

  function setThirsty(root, on) {
    root.classList.toggle("thirsty", !!on);
  }

  // ------------ ANIMAZIONE GOCCE D'ACQUA ----------------------------------
  function playWateringAnimation(layer) {
    const drops = 8;
    for (let i = 0; i < drops; i++) {
      const drop = document.createElement("div");
      drop.className = "waterdrop";
      drop.style.left = (45 + Math.random() * 10) + "%";
      drop.style.animationDelay = (i * 60) + "ms";
      layer.appendChild(drop);
      setTimeout(() => drop.remove(), 1400);
    }
  }

  // ------------ MESSAGGI --------------------------------------------------
  function showMessage(cardEl, text, tone) {
    cardEl.className = "message-card " + (tone || "info");
    cardEl.textContent = text;
    cardEl.classList.add("visible");
    clearTimeout(showMessage._t);
    showMessage._t = setTimeout(() => {
      cardEl.classList.remove("visible");
    }, 6500);
  }

  // ------------ SORPRESA FINALE -------------------------------------------
  function showFinalSurprise(overlayEl, surprise) {
    const titleEl = overlayEl.querySelector(".surprise-title");
    const contentEl = overlayEl.querySelector(".surprise-content");
    const imgWrap = overlayEl.querySelector(".surprise-image");

    titleEl.textContent = surprise.title || "";
    contentEl.innerHTML = "";
    (surprise.content || "").split(/\n\n+/).forEach((p) => {
      const para = document.createElement("p");
      para.textContent = p;
      contentEl.appendChild(para);
    });

    if (surprise.type === "image" && surprise.imageUrl) {
      imgWrap.innerHTML = `<img src="${surprise.imageUrl}" alt="" />`;
      imgWrap.style.display = "";
    } else {
      imgWrap.innerHTML = "";
      imgWrap.style.display = "none";
    }

    overlayEl.classList.add("visible");
  }

  function hideFinalSurprise(overlayEl) {
    overlayEl.classList.remove("visible");
  }

  window.GIARDINO_GARDEN = {
    mountVase, mountFlowers, renderStage, setThirsty,
    playWateringAnimation, showMessage, showFinalSurprise, hideFinalSurprise
  };
})();
