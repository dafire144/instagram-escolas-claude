/** Local vector repertoire. Objects explain the theme; no people or remote assets. */
export const THEMES = Object.freeze(['escola', 'pertences', 'recados', 'familia-escola', 'dia-das-criancas']);

export function validateTheme(value = 'escola') {
  if (!THEMES.includes(value)) throw new Error(`Tema desconhecido. Use ${THEMES.join(', ')} ou adicione o assunto ao repertório temático antes de renderizar.`);
  return value;
}

const OBJECTS = {
  backpack: `<path d="M49 39V29c0-28 62-28 62 0v10" fill="none" stroke="var(--ink)" stroke-width="11"/><path d="M23 71C23 11 137 11 137 71v95c0 15-13 24-29 24H52c-18 0-29-9-29-24z" fill="var(--primary)"/><path d="M36 79h89v85q0 12-12 12H49q-13 0-13-12z" fill="var(--accent)"/><path d="M46 67h67M47 111h66" stroke="var(--ink)" stroke-width="5"/><path d="M22 104H10v52h14M137 104h13v52h-13" fill="var(--secondary)"/><rect x="64" y="132" width="34" height="21" rx="5" fill="var(--paper)"/><path d="M73 142h16" stroke="var(--ink)" stroke-width="4"/><path d="M100 109v15" stroke="var(--ink)" stroke-width="6"/>`,
  bottle: `<rect x="46" y="9" width="66" height="28" rx="9" fill="var(--primary)"/><path d="M55 37v18C30 61 31 74 31 91v86q0 17 17 17h65q17 0 17-17V91c0-17 1-30-25-36V37" fill="var(--secondary)"/><path d="M31 113q25-21 50-2t49 0v66q0 17-17 17H48q-17 0-17-17z" fill="var(--primary)"/><rect x="43" y="79" width="75" height="44" rx="9" fill="var(--paper)"/><path d="M58 94h42M58 108h29" stroke="var(--ink)" stroke-width="5"/><path d="M116 44c29 0 29-36 3-30" fill="none" stroke="var(--accent)" stroke-width="8"/>`,
  tag: `<path d="m18 68 51-45h76v104H66L18 82z" fill="var(--accent)"/><circle cx="45" cy="75" r="9" fill="var(--paper)"/><path d="M41 73C-7 91-13 32 34 34" fill="none" stroke="var(--primary)" stroke-width="6"/><path d="M76 58h49M76 77h35M76 95h45" stroke="var(--ink)" stroke-width="5"/>`,
  pencil: `<path d="M45 17h67v141H45z" fill="var(--accent)"/><path d="M90 17h22v141H90z" fill="var(--secondary)"/><path d="m45 158 33 42 34-42z" fill="var(--paper)"/><path d="m67 186 11 14 12-14z" fill="var(--ink)"/><path d="M45 15q0-13 13-13h41q13 0 13 13v17H45z" fill="var(--primary)"/><path d="M68 47v100" stroke="var(--ink)" stroke-width="5"/>`,
  notebook: `<rect x="24" y="10" width="119" height="182" rx="10" fill="var(--primary)"/><path d="M35 17h94v161H35z" fill="var(--paper)"/><path d="M126 17h10v161h-10z" fill="var(--secondary)"/><path d="M26 35h18M26 65h18M26 95h18M26 125h18M26 155h18" stroke="var(--ink)" stroke-width="9"/><path d="M60 64h45M60 88h45M60 112h45M60 136h28" stroke="var(--primary)" stroke-width="5"/><path d="m74 9 22 0v39l-11-9-11 9z" fill="var(--accent)"/>`,
  calendar: `<rect x="8" y="34" width="146" height="142" rx="14" fill="var(--paper)"/><path d="M8 47q0-13 13-13h120q13 0 13 13v35H8z" fill="var(--accent)"/><path d="M43 20v29M117 20v29" stroke="var(--ink)" stroke-width="10"/><g fill="var(--secondary)"><rect x="28" y="98" width="23" height="21" rx="3"/><rect x="68" y="98" width="23" height="21" rx="3"/><rect x="108" y="98" width="23" height="21" rx="3"/><rect x="28" y="134" width="23" height="21" rx="3"/><rect x="68" y="134" width="23" height="21" rx="3"/></g><path d="m107 143 8 8 20-26" fill="none" stroke="var(--primary)" stroke-width="7"/>`,
  envelope: `<path d="m10 69 70-51 72 51v104H10z" fill="var(--secondary)"/><rect x="28" y="24" width="104" height="123" rx="7" fill="var(--paper)"/><path d="M48 50h63M48 72h50M48 94h57" stroke="var(--primary)" stroke-width="5"/><path d="m10 69 70 47 72-47v104H10z" fill="var(--accent)"/><path d="m10 173 57-47q14-9 28 0l57 47" fill="none" stroke="var(--ink)" stroke-width="4"/>`,
  note: `<path d="m18 18 118 9-9 162L7 180z" fill="var(--paper)"/><path d="m41 9 77 5-2 29-77-5z" fill="var(--accent)"/><path d="m33 70 72 5m-75 24 72 5m-74 24 57 4" stroke="var(--primary)" stroke-width="6"/><path d="m128 145-27 1-2 32z" fill="var(--secondary)"/>`,
  speech: `<path d="M9 27q0-17 17-17h115q18 0 18 17v70q0 18-18 18H76l-29 28 1-28H26q-17 0-17-18z" fill="var(--accent)"/><path d="M34 47h98M34 70h78" stroke="var(--ink)" stroke-width="6"/><path d="M66 105h80q16 0 16 16v48h-20v23l-25-23H77q-13 0-13-13v-29" fill="var(--primary)"/><g fill="var(--paper)"><circle cx="88" cy="141" r="6"/><circle cx="110" cy="141" r="6"/><circle cx="132" cy="141" r="6"/></g>`,
  book: `<path d="M6 26q35-15 73 4 40-19 76-4v137q-36-13-76 5-38-18-73-5z" fill="var(--primary)"/><path d="M15 14q35-10 64 9 33-19 67-9v133q-30-10-67 9-33-19-64-9z" fill="var(--paper)"/><path d="M79 23v133" stroke="var(--ink)" stroke-width="5"/><path d="M29 52q18-1 34 6M29 78q18-1 34 6M95 57q19-6 35-3M95 83q19-6 35-3M29 104q18-1 34 6M95 109q19-6 35-3" stroke="var(--secondary)" stroke-width="7"/><path d="M108 10h21v66l-10-7-11 7z" fill="var(--accent)"/>`,
  ball: `<circle cx="80" cy="100" r="73" fill="var(--accent)"/><path d="M27 50q64 43 67 121M24 151q64-41 117-16M62 30q-23 71 75 118" fill="none" stroke="var(--primary)" stroke-width="10"/><path d="M100 31q-8 45 51 66" fill="none" stroke="var(--paper)" stroke-width="8"/>`,
  blocks: `<rect x="4" y="105" width="75" height="78" rx="9" fill="var(--primary)"/><rect x="85" y="105" width="75" height="78" rx="9" fill="var(--accent)"/><rect x="47" y="21" width="75" height="78" rx="9" fill="var(--secondary)"/><circle cx="42" cy="143" r="19" fill="var(--paper)"/><path d="m100 160 22-36 22 36z" fill="var(--ink)"/><rect x="67" y="41" width="35" height="35" rx="4" fill="var(--paper)"/>`,
  chalk: `<g transform="rotate(-14 80 100)"><rect x="17" y="47" width="34" height="130" rx="12" fill="var(--accent)"/><ellipse cx="34" cy="48" rx="17" ry="9" fill="var(--paper)"/><rect x="64" y="20" width="34" height="155" rx="12" fill="var(--primary)"/><ellipse cx="81" cy="21" rx="17" ry="9" fill="var(--secondary)"/><rect x="110" y="66" width="34" height="110" rx="12" fill="var(--secondary)"/><ellipse cx="127" cy="67" rx="17" ry="9" fill="var(--paper)"/></g>`,
  box: `<path d="m14 76 64-26 66 26v92l-66 28-64-28z" fill="var(--accent)"/><path d="m78 103 66-27v92l-66 28z" fill="var(--secondary)"/><path d="m14 76-11-38 59 24 16 41zM78 103l18-40 60-25-12 38" fill="var(--paper)"/><path d="M78 103v93M29 128l29 12" stroke="var(--ink)" stroke-width="5"/><path d="m31 61 11-37 41 12-11 30" fill="var(--primary)"/><path d="m97 62 11-42 27 8-8 39" fill="var(--secondary)"/>`,
  kite: `<path d="m75 8 75 72-76 91L6 79z" fill="var(--accent)"/><path d="m75 8 0 163 75-91z" fill="var(--secondary)"/><path d="m75 8-1 163M6 79l144 1" stroke="var(--ink)" stroke-width="4"/><path d="M74 171q-16 20 18 25" stroke="var(--primary)" stroke-width="5" fill="none"/><path d="m90 189-9-8v17l9-9 11-8v17z" fill="var(--primary)"/>`,
};

const REPERTOIRE = {
  escola: [['book', 'pencil', 'blocks'], ['notebook', 'chalk', 'book'], ['blocks', 'book', 'pencil']],
  pertences: [['backpack', 'bottle', 'tag'], ['bottle', 'tag', 'pencil'], ['tag', 'backpack', 'pencil'], ['backpack', 'notebook', 'bottle']],
  recados: [['envelope', 'calendar', 'pencil'], ['notebook', 'note', 'envelope'], ['calendar', 'pencil', 'note'], ['note', 'envelope', 'notebook']],
  'familia-escola': [['speech', 'book', 'pencil'], ['book', 'speech', 'notebook'], ['notebook', 'pencil', 'speech']],
  'dia-das-criancas': [['ball', 'blocks', 'chalk'], ['blocks', 'ball', 'pencil'], ['chalk', 'blocks', 'ball'], ['ball', 'pencil', 'blocks']],
};

export function themeIllustration(theme, school, index = 0, layout = 'info-cover') {
  validateTheme(theme);
  const variants = school === 'aviaozinho' && theme === 'dia-das-criancas'
    ? [['book', 'pencil', 'box'], ['box', 'note', 'pencil'], ['pencil', 'book', 'box'], ['note', 'box', 'kite']]
    : REPERTOIRE[theme];
  const layoutOffset = { 'info-cover': 0, 'info-explain': 1, 'info-list': 2, 'info-steps': 3, 'info-compare': 4, 'info-summary': 5, 'info-notice': 2 }[layout] || 0;
  const variantIndex = Math.abs(index) + layoutOffset;
  const composition = variantIndex % 3;
  const objects = [...variants[variantIndex % variants.length]];
  const positions = [
    [{ x: 156, y: 35, scale: 1.47, rotate: -10 }, { x: 338, y: 127, scale: 1, rotate: 14 }, { x: 15, y: 166, scale: .87, rotate: -12 }],
    [{ x: 136, y: 50, scale: 1.42, rotate: 10 }, { x: 16, y: 122, scale: .97, rotate: -14 }, { x: 340, y: 150, scale: .9, rotate: 16 }],
    [{ x: 180, y: 41, scale: 1.46, rotate: 2 }, { x: 25, y: 151, scale: .95, rotate: -17 }, { x: 352, y: 121, scale: .86, rotate: 12 }],
  ][composition];
  return `<svg class="theme-illustration" data-theme="${theme}" data-composition="${composition}" viewBox="0 0 540 390" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><ellipse cx="270" cy="354" rx="196" ry="19" fill="var(--ink)" opacity=".11"/><path d="M43 181C9 41 182-16 309 29c179 0 247 120 145 241-85 119-323 90-411-89Z" fill="var(--secondary)" opacity=".24"/><g stroke="var(--ink)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${objects.map((name, objectIndex) => { const pos = positions[objectIndex]; return `<g data-object="${name}" transform="translate(${pos.x} ${pos.y}) rotate(${pos.rotate} 80 100) scale(${pos.scale})">${OBJECTS[name]}</g>`; }).join('')}</g><g stroke-linecap="round" stroke-width="8"><path d="m53 78 16 17M427 51l-5 22M474 277l17 5" stroke="var(--accent)"/><path d="m111 26 1 17M498 130l-15 9" stroke="var(--primary)"/></g><circle cx="58" cy="282" r="10" fill="var(--accent)"/><circle cx="454" cy="320" r="8" fill="var(--primary)"/><path d="m378 11 7 16 17 2-13 12 3 18-15-9-15 8 3-17-12-12 18-2z" fill="var(--accent)"/></svg>`;
}
