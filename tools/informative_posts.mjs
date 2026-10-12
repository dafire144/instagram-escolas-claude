import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const LAYOUTS = Object.freeze(['info-cover', 'info-explain', 'info-list', 'info-steps', 'info-compare', 'info-summary', 'info-notice']);
const BRANDS = {
  aviaozinho: { name: 'Aviãozinho de Papel', font: 'Fredoka', weight: 700, fontFile: 'Fredoka-700.ttf', paper: '#FFFDF7', ink: '#2D2F91', primary: '#3472B9', accent: '#FFD025', secondary: '#60C6F0' },
  colibri: { name: 'Colibri', font: 'Baloo', weight: 800, fontFile: 'Baloo2-800.ttf', paper: '#FFF7E8', ink: '#14255E', primary: '#283D9B', accent: '#F0391E', secondary: '#F6A90A' },
};
const BODY_LIMIT = { 'info-cover': 180, 'info-explain': 420, 'info-list': 140, 'info-steps': 130, 'info-compare': 120, 'info-summary': 220, 'info-notice': 180 };

export const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

function plainText(value, label, max, required = false) {
  if (value === undefined || value === null) value = '';
  if (typeof value !== 'string') throw new Error(`${label} precisa ser texto.`);
  const text = value.trim();
  if (required && !text) throw new Error(`${label} é obrigatório.`);
  if ([...text].length > max) throw new Error(`${label} excede ${max} caracteres. Divida a informação em outra tela.`);
  return text;
}

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative !== '' && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

async function authorizedPhoto(value, reviewed, root) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') throw new Error('photo precisa ser um caminho local dentro de inputs/.');
  if (reviewed !== true) throw new Error('Foto exige safe_photo_reviewed=true após revisão visual de todas as pessoas.');
  const inputRoot = path.resolve(root, 'inputs');
  const photo = path.resolve(root, value);
  if (!isInside(inputRoot, photo) || !/\.(png|jpe?g|webp)$/i.test(photo)) throw new Error('Foto precisa ser PNG, JPEG ou WebP dentro de inputs/.');
  const [realInput, realPhoto] = await Promise.all([fs.realpath(inputRoot), fs.realpath(photo)]);
  if (!isInside(realInput, realPhoto) || !(await fs.stat(realPhoto)).isFile()) throw new Error('Foto precisa permanecer dentro de inputs/, inclusive após resolver links.');
  return realPhoto;
}

/** Validate data without launching Chrome or loading any photos/fonts. */
export async function validateInformativeJob(job, { root = ROOT } = {}) {
  if (!job || typeof job !== 'object' || Array.isArray(job)) throw new Error('Job precisa ser um objeto.');
  if (job.content_type !== 'informative') throw new Error('content_type precisa ser informative.');
  if (!Object.hasOwn(BRANDS, job.school)) throw new Error('Escola inválida. Use aviaozinho ou colibri.');
  if (!['carousel', 'static'].includes(job.format)) throw new Error('Formato inválido. Use carousel ou static.');
  const slug = plainText(job.slug, 'slug', 90, true);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('slug precisa usar letras minúsculas, números e hífens.');
  if (job.output !== undefined && (typeof job.output !== 'string' || !job.output.trim())) throw new Error('output precisa ser um caminho.');
  if (job.photos !== undefined) throw new Error('No informativo, informe photo em cada slide, não photos.');
  if (job.format === 'carousel' && job.photo !== undefined) throw new Error('No carrossel informativo, informe photo em cada slide.');
  let rawSlides = job.format === 'static' && job.slides === undefined ? [{ ...job, layout: job.layout || 'info-notice' }] : job.slides;
  const count = job.format === 'static' ? [1, 1] : [2, 10];
  if (!Array.isArray(rawSlides) || rawSlides.length < count[0] || rawSlides.length > count[1]) throw new Error(`Formato ${job.format} exige ${count[0] === count[1] ? count[0] : `${count[0]} a ${count[1]}`} tela(s).`);
  if (job.format === 'static' && job.slides !== undefined && job.photo !== undefined) {
    const slidePhoto = rawSlides[0]?.photo;
    if (slidePhoto !== undefined && slidePhoto !== job.photo) throw new Error('Foto estática conflitante: use photo na raiz ou no slide único.');
    rawSlides = [{ ...rawSlides[0], photo: job.photo }];
  }
  const slides = [];
  for (let i = 0; i < rawSlides.length; i++) {
    const slide = rawSlides[i];
    const label = `Tela ${i + 1}`;
    if (!slide || typeof slide !== 'object' || !LAYOUTS.includes(slide.layout)) throw new Error(`${label}: layout inválido. Use ${LAYOUTS.join(', ')}.`);
    const items = slide.items === undefined ? [] : slide.items;
    if (!Array.isArray(items)) throw new Error(`${label}: items precisa ser uma lista.`);
    const acceptsItems = ['info-list', 'info-steps', 'info-compare', 'info-notice'].includes(slide.layout);
    if (items.length && !acceptsItems) throw new Error(`${label}: ${slide.layout} não aceita items.`);
    if (items.length > 4 || (['info-list', 'info-steps'].includes(slide.layout) && items.length < 1)) throw new Error(`${label}: use de 1 a 4 itens.`);
    if (slide.layout === 'info-compare' && items.length !== 2) throw new Error(`${label}: comparação exige exatamente 2 grupos.`);
    const compare = slide.layout === 'info-compare';
    slides.push({
      layout: slide.layout,
      eyebrow: plainText(slide.eyebrow, `${label} eyebrow`, 40),
      title: plainText(slide.title, `${label} title`, 90, true),
      body: plainText(slide.body, `${label} body`, BODY_LIMIT[slide.layout]),
      note: plainText(slide.note, `${label} note`, 160),
      items: items.map((item, n) => {
        if (!item || typeof item !== 'object') throw new Error(`${label} item ${n + 1} inválido.`);
        return { title: plainText(item.title, `${label} item ${n + 1} title`, compare ? 60 : 70, true), body: plainText(item.body, `${label} item ${n + 1} body`, compare ? 220 : 130) };
      }),
      photo: await authorizedPhoto(slide.photo, job.safe_photo_reviewed, root),
    });
  }
  const photos = [...new Set(slides.map((slide) => slide.photo).filter(Boolean))];
  return { content_type: 'informative', school: job.school, format: job.format, slug, caption: plainText(job.caption, 'caption', 2200), output: path.resolve(root, job.output || path.join('outputs', job.school, slug)), slides, photos, safe_photo_reviewed: photos.length > 0 ? true : null };
}

async function dataUrl(file, mime) {
  return `data:${mime};base64,${(await fs.readFile(file)).toString('base64')}`;
}

export async function loadBrandAssets(school, { root = ROOT } = {}) {
  const brand = BRANDS[school];
  if (!brand) throw new Error('Escola inválida.');
  const [heading, body, bold, logo] = await Promise.all([
    dataUrl(path.join(root, 'assets', 'fonts', brand.fontFile), 'font/ttf'),
    dataUrl(path.join(root, 'assets', 'fonts', 'Nunito-600.ttf'), 'font/ttf'),
    dataUrl(path.join(root, 'assets', 'fonts', 'Nunito-800.ttf'), 'font/ttf'),
    dataUrl(path.join(root, 'assets', 'logos', 'render', `${school}.jpg`), 'image/jpeg'),
  ]);
  return { heading, body, bold, logo };
}

function ornament(school, large = false) {
  // Decorative geometry, never used to simulate photos or depict children.
  if (school === 'aviaozinho') return `<svg class="ornament ${large ? 'large' : ''}" viewBox="0 0 260 200" fill="none" aria-hidden="true"><path d="M14 169C66 91 104 190 135 136" stroke="var(--primary)" stroke-width="5" stroke-linecap="round" stroke-dasharray="3 12"/><path d="m80 38 142 34-101 47 7-35z" fill="var(--accent)"/><path d="m80 38 48 46 94-12M128 84l-7 35" stroke="var(--ink)" stroke-width="4" stroke-linejoin="round"/><path d="m226 124 5 12 13 3-11 8 1 14-11-8-13 5 4-13-8-11 14 1z" fill="var(--secondary)"/><circle cx="47" cy="63" r="10" fill="var(--secondary)"/></svg>`;
  return `<svg class="ornament ${large ? 'large' : ''}" viewBox="0 0 260 200" fill="none" aria-hidden="true"><path d="M34 154V108a52 52 0 0 1 104 0v46" stroke="var(--accent)" stroke-width="29"/><path d="M80 154V111a49 49 0 0 1 98 0v43" stroke="var(--secondary)" stroke-width="27"/><circle cx="213" cy="79" r="25" fill="var(--primary)"/><path d="M195 145q16-24 34 0" stroke="var(--primary)" stroke-width="7" stroke-linecap="round"/><circle cx="45" cy="40" r="8" fill="var(--accent)"/></svg>`;
}

function itemMarkup(items, layout) {
  if (!items.length) return '';
  return `<div class="items" data-measure>${items.map((item, index) => `<section class="item" data-measure>${layout === 'info-steps' ? `<span class="item-index">${String(index + 1).padStart(2, '0')}</span>` : layout === 'info-notice' ? '<span class="check" aria-hidden="true"></span>' : layout === 'info-list' ? '<span class="bullet" aria-hidden="true"></span>' : ''}<div class="item-copy"><h2 data-measure>${escapeHtml(item.title)}</h2>${item.body ? `<p data-measure>${escapeHtml(item.body)}</p>` : ''}</div></section>`).join('')}</div>`;
}

const MEASURE_SCRIPT = `
  (async()=>{
    await document.fonts.ready;
    const imageErrors=[];
    await Promise.all([...document.images].map(async image=>{try{await image.decode()}catch{imageErrors.push('imagem inválida')}}));
    await new Promise(resolve=>setTimeout(resolve,100));
    const stage=document.querySelector('.stage').getBoundingClientRect();
    const errors=[...imageErrors];
    for(const el of document.querySelectorAll('[data-measure]')){
      const box=el.getBoundingClientRect();
      // All copy blocks have natural height. Their rectangles catch vertical
      // overflow without mistaking a font's descender metrics for clipped text.
      if(box.top<stage.top-1||box.bottom>stage.bottom+1||box.left<stage.left-1||box.right>stage.right+1||el.scrollWidth>el.clientWidth+2)errors.push(el.tagName.toLowerCase()+': '+el.textContent.trim().slice(0,70));
    }
    const result={ok:errors.length===0,errors,width:1080,height:1350};
    document.getElementById('render-check').textContent=JSON.stringify(result);
    document.documentElement.dataset.renderReady='true';
    return result;
  })().catch(error=>{const result={ok:false,errors:[error.message]};document.getElementById('render-check').textContent=JSON.stringify(result);return result});
`;

/** assets.photo, if supplied, must be a data URL from an already validated file. */
export function buildSlideHtml(job, slide, index, assets) {
  const brand = BRANDS[job.school];
  const items = itemMarkup(slide.items, slide.layout);
  const isCover = slide.layout === 'info-cover';
  const head = `<header class="heading" data-measure>${slide.eyebrow ? `<p class="eyebrow" data-measure>${escapeHtml(slide.eyebrow)}</p>` : ''}<h1 data-measure>${escapeHtml(slide.title)}</h1></header>`;
  const body = slide.body ? `<p class="body" data-measure>${escapeHtml(slide.body)}</p>` : '';
  const note = slide.note ? `<aside class="note" data-measure>${escapeHtml(slide.note)}</aside>` : '';
  const photo = assets.photo ? `<figure class="photo-frame" data-measure><img class="photo" src="${assets.photo}" alt="" /></figure>` : '';
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=1080"><title>${escapeHtml(slide.title)}</title><style>
@font-face{font-family:Heading;src:url('${assets.heading}');font-weight:${brand.weight}}
@font-face{font-family:Nunito;src:url('${assets.body}');font-weight:600}
@font-face{font-family:Nunito;src:url('${assets.bold}');font-weight:800}
*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1350px}body{font-family:Nunito,sans-serif;font-weight:600;color:${brand.ink}}
.post{--paper:${brand.paper};--ink:${brand.ink};--primary:${brand.primary};--accent:${brand.accent};--secondary:${brand.secondary};position:relative;width:1080px;height:1350px;background:var(--paper);overflow:hidden}
.post:before{content:"";position:absolute;inset:0;opacity:.028;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Cpath fill='%2314255E' filter='url(%23n)' opacity='.55' d='M0 0h140v140H0z'/%3E%3C/svg%3E")}
.stage{position:absolute;left:72px;right:72px;top:86px;bottom:198px;display:flex;flex-direction:column;gap:32px;z-index:2}
h1,h2,p,figure{margin:0}h1{font-family:Heading,Nunito,sans-serif;font-size:88px;line-height:1.08;font-weight:${brand.weight};letter-spacing:-.024em;overflow-wrap:break-word;white-space:pre-line}
.heading{flex:none}.eyebrow{font-size:24px;font-weight:800;letter-spacing:.105em;text-transform:uppercase;margin-bottom:30px;display:flex;align-items:center;gap:16px;line-height:1.35}.eyebrow:before{content:"";width:30px;height:10px;flex:none;background:var(--accent);border-radius:8px}
.body{font-size:39px;line-height:1.36;white-space:pre-line;overflow-wrap:break-word;flex:none}
.note{margin-top:auto;padding:25px 30px 27px;border-left:7px solid var(--accent);background:#fff8;border-radius:4px 22px 22px 4px;font-size:30px;line-height:1.35;white-space:pre-line;flex:none;overflow-wrap:break-word}
.footer{position:absolute;bottom:49px;left:72px;right:72px;height:105px;display:flex;align-items:center;justify-content:space-between;z-index:3}
.logo{display:block;width:190px;height:105px;padding:12px;background:#fff;border-radius:18px;object-fit:contain}.pagination{display:flex;gap:10px;align-items:center;font-size:24px;font-weight:800;font-variant-numeric:tabular-nums;letter-spacing:.06em}.pagination b{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:var(--paper)}.pagination span{opacity:.65}
.ornament{position:absolute;right:260px;bottom:42px;width:150px;height:116px;opacity:.9;z-index:1}.ornament.large{right:-25px;bottom:180px;width:300px;height:231px}
.corner{position:absolute;right:-85px;top:-90px;width:190px;height:210px;border-radius:55%;border:35px solid var(--secondary);transform:rotate(-18deg);opacity:.55}.post.colibri .corner{border-radius:40px;transform:rotate(26deg);border-color:var(--accent);width:165px;height:200px}
.items{display:flex;flex-direction:column;gap:26px;flex:none}.item{display:flex;gap:24px;align-items:flex-start}.item-copy{flex:1;min-width:0}h2{font-family:Nunito,sans-serif;font-size:37px;line-height:1.18;font-weight:800;white-space:pre-line;overflow-wrap:break-word}.item p{font-size:33px;line-height:1.3;margin-top:9px;white-space:pre-line;overflow-wrap:break-word}
.bullet{width:16px;height:16px;flex:none;margin-top:14px;border:4px solid var(--primary);border-radius:50%;background:var(--accent)}
.info-cover .stage{justify-content:center;padding-bottom:140px;gap:36px}.info-cover h1{font-size:105px;line-height:1.075;max-width:880px}.info-cover .body{max-width:780px;font-size:42px}.info-cover .note{margin-top:24px;max-width:660px;font-size:29px;padding:18px 0;background:none;border-left:0;border-top:5px solid var(--accent);border-radius:0}.info-cover .ornament.large{bottom:181px}
.info-explain .body{font-size:42px;line-height:1.42;padding-left:30px;border-left:6px solid var(--secondary)}.info-explain .stage{gap:45px}.info-explain .note{border-left:0;border-top:6px solid var(--accent);border-radius:4px 4px 24px 24px}
.info-list .items{gap:28px}.info-list .item{padding-bottom:26px;border-bottom:2px solid color-mix(in srgb,var(--primary) 18%,transparent)}.info-list .item:last-child{padding-bottom:0;border:0}.info-list h1,.info-steps h1,.info-notice h1{font-size:83px}.info-list .body,.info-steps .body,.info-notice .body,.info-compare .body{font-size:35px}
.info-steps .items{gap:30px;position:relative}.info-steps .item{gap:26px}.item-index{font-family:Heading,sans-serif;font-size:43px;font-weight:${brand.weight};flex:none;width:74px;height:74px;background:var(--primary);color:var(--paper);border-radius:22px;display:grid;place-items:center;line-height:1}.info-steps .item:nth-child(even) .item-index{border-radius:50%;background:var(--secondary);color:var(--ink)}
.info-compare .items{display:grid;grid-template-columns:1fr 1fr;gap:26px;margin-top:14px;align-items:stretch}.info-compare .item{padding:34px 29px 40px;border-radius:34px;background:#fff9;border-top:10px solid var(--primary)}.info-compare .item:nth-child(2){border-color:var(--secondary);border-radius:34px 34px 60px 34px}.info-compare h2{font-size:39px}.info-compare .item p{font-size:35px;line-height:1.4;margin-top:24px}.info-compare h1{font-size:86px}
.info-summary .stage{justify-content:center;padding:35px 25px 80px}.info-summary .stage:before{content:"";position:absolute;inset:0 -24px 0;border:4px solid var(--primary);border-radius:45% 45% 32px 32px / 9% 9% 32px 32px;z-index:-1;opacity:.16}.info-summary h1{font-size:95px}.info-summary .eyebrow{margin-bottom:38px}.info-summary .body{font-size:42px}.info-summary .note{margin-top:22px;background:var(--primary);border:0;color:var(--paper);font-size:33px;border-radius:24px;padding:28px 32px}
.info-notice .stage{top:105px;gap:28px}.info-notice .heading{padding-bottom:27px;border-bottom:7px solid var(--accent)}.info-notice .items{margin-top:4px;padding:32px;border:2px solid color-mix(in srgb,var(--primary) 18%,transparent);border-radius:26px;background:#fff7;gap:28px}.check{margin-top:6px;width:28px;height:28px;flex:none;border:3px solid var(--primary);border-radius:8px}.info-notice .note{font-size:30px;border:none;border-radius:0;background:none;padding:10px 0}
.photo-frame{flex:1;min-height:220px;max-height:400px;width:100%;padding:16px;background:#fff;border:2px solid var(--secondary);border-radius:24px}.photo{display:block;width:100%;height:100%;object-fit:contain;object-position:center}.has-photo .stage{gap:24px}.has-photo h1{font-size:78px}.has-photo .body{font-size:35px}.has-photo .note{font-size:28px;padding:18px 24px}.has-photo .items{gap:18px}.has-photo .item p{font-size:30px}.has-photo .item h2{font-size:33px}.has-photo.info-cover .stage{padding-bottom:0;justify-content:flex-start}.has-photo.info-cover .ornament.large{display:none}.has-photo.info-summary .stage{padding-top:25px;padding-bottom:25px}.has-photo.info-explain .body{font-size:35px}
</style></head><body><main class="post ${job.school} ${slide.layout}${assets.photo ? ' has-photo' : ''}"><div class="corner" aria-hidden="true"></div>${ornament(job.school, isCover)}<article class="stage">${head}${body}${items}${photo}${note}</article><footer class="footer"><img class="logo" src="${assets.logo}" alt="${escapeHtml(brand.name)}"/>${job.format === 'carousel' ? `<div class="pagination"><b>${index + 1}</b><span>/ ${job.slides.length}</span></div>` : ''}</footer></main><script id="render-check" type="application/json">{"ok":false,"errors":["Render não concluído"]}</script><script>${MEASURE_SCRIPT}</script></body></html>`;
}

function chromeExecutable() {
  const candidates = [process.env.CHROME_PATH, 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(Boolean);
  const found = candidates.find((candidate) => fsSync.existsSync(candidate));
  if (!found) throw new Error('Google Chrome não encontrado. Defina CHROME_PATH.');
  return found;
}

/** Chrome's pipe transport uses null-delimited JSON and needs no browser library. */
function launchChrome(chrome, profile) {
  const child = spawn(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', `--user-data-dir=${profile}`, '--allow-file-access-from-files', '--remote-debugging-pipe', '--force-device-scale-factor=1'], { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'], windowsHide: true });
  let sequence = 0;
  let buffer = '';
  const pending = new Map();
  const events = new Set();
  const fail = (error) => { for (const { reject, timer } of pending.values()) { clearTimeout(timer); reject(error); } pending.clear(); };
  child.on('error', fail);
  child.on('exit', () => fail(new Error('Chrome encerrou antes de concluir a renderização.')));
  child.stdio[4].setEncoding('utf8');
  child.stdio[4].on('data', (chunk) => {
    buffer += chunk;
    let end;
    while ((end = buffer.indexOf('\0')) >= 0) {
      const packet = buffer.slice(0, end);
      buffer = buffer.slice(end + 1);
      if (!packet) continue;
      const message = JSON.parse(packet);
      if (message.id && pending.has(message.id)) {
        const request = pending.get(message.id);
        clearTimeout(request.timer);
        pending.delete(message.id);
        if (message.error) request.reject(new Error(message.error.message));
        else request.resolve(message.result);
      } else for (const listener of events) listener(message);
    }
  });
  function send(method, params = {}, sessionId) {
    return new Promise((resolve, reject) => {
      const id = ++sequence;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Chrome não respondeu a ${method}.`)); }, 45000);
      pending.set(id, { resolve, reject, timer });
      child.stdio[3].write(`${JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) })}\0`);
    });
  }
  function event(method, sessionId) {
    return new Promise((resolve, reject) => {
      const listener = (message) => { if (message.method === method && message.sessionId === sessionId) { clearTimeout(timer); events.delete(listener); resolve(message.params); } };
      const timer = setTimeout(() => { events.delete(listener); reject(new Error(`Chrome não emitiu ${method}.`)); }, 45000);
      events.add(listener);
    });
  }
  async function close() {
    if (child.exitCode !== null) return;
    const exit = new Promise(resolve => child.once('exit', resolve));
    const killTimer = setTimeout(() => child.kill(), 3000);
    // Browser.close may terminate the pipe before acknowledging the command.
    send('Browser.close').catch(() => {});
    await exit;
    clearTimeout(killTimer);
  }
  return { send, event, close };
}

async function renderHtml(browser, session, htmlFile, target) {
  const loaded = browser.event('Page.loadEventFired', session);
  await browser.send('Page.navigate', { url: pathToFileURL(htmlFile).href }, session);
  await loaded;
  const measured = await browser.send('Runtime.evaluate', { expression: MEASURE_SCRIPT, awaitPromise: true, returnByValue: true }, session);
  const result = measured.result?.value;
  if (!result || measured.exceptionDetails) throw new Error('Chrome não retornou as medidas da arte.');
  if (!result.ok) throw new Error(`Conteúdo não cabe ou asset falhou em ${path.basename(htmlFile)}: ${result.errors.join('; ')}. Reduza o texto ou divida a tela.`);
  const screenshot = await browser.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: 1080, height: 1350, scale: 1 } }, session);
  const png = Buffer.from(screenshot.data, 'base64');
  if (png.toString('ascii', 1, 4) !== 'PNG' || png.readUInt32BE(16) !== 1080 || png.readUInt32BE(20) !== 1350) throw new Error('Chrome gerou dimensões inesperadas.');
  await fs.writeFile(target, png);
  return result;
}

function copyMarkdown(job) {
  return `# ${BRANDS[job.school].name} | Informativo\n\n${job.slides.map((slide, index) => `## ${job.format === 'static' ? 'Arte' : `Tela ${index + 1}`}\n\n${slide.eyebrow ? `${slide.eyebrow}\n\n` : ''}**${slide.title}**\n\n${slide.body}${slide.items.length ? `\n\n${slide.items.map(item => `- **${item.title}**${item.body ? `: ${item.body}` : ''}`).join('\n')}` : ''}${slide.note ? `\n\n${slide.note}` : ''}`).join('\n\n')}\n\n## Legenda\n\n${job.caption}\n`;
}

export async function buildInformativeJob(jobFile, { root = ROOT } = {}) {
  const sourceJob = path.resolve(root, jobFile);
  const job = await validateInformativeJob(JSON.parse(await fs.readFile(sourceJob, 'utf8')), { root });
  const assets = await loadBrandAssets(job.school, { root });
  const chrome = chromeExecutable();
  const htmlDir = path.join(job.output, '_html');
  const pngDir = job.format === 'carousel' ? path.join(job.output, 'png') : job.output;
  await fs.mkdir(htmlDir, { recursive: true });
  await fs.mkdir(pngDir, { recursive: true });
  // Do not leave an earlier successful manifest attached to a failed rerender.
  await fs.rm(path.join(job.output, 'manifest.json'), { force: true });
  const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'escolas-informative-chrome-'));
  const browser = launchChrome(chrome, profile);
  const files = [];
  const checks = [];
  try {
    const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await browser.send('Target.attachToTarget', { targetId, flatten: true });
    await browser.send('Page.enable', {}, sessionId);
    await browser.send('Emulation.setDeviceMetricsOverride', { width: 1080, height: 1350, deviceScaleFactor: 1, mobile: false }, sessionId);
    for (const [index, slide] of job.slides.entries()) {
      const number = String(index + 1).padStart(2, '0');
      const name = job.format === 'carousel' ? `slide-${number}` : 'post-estatico';
      const htmlFile = path.join(htmlDir, `${name}.html`);
      const target = path.join(pngDir, `${name}.png`);
      const photo = slide.photo ? await dataUrl(slide.photo, /\.png$/i.test(slide.photo) ? 'image/png' : /\.webp$/i.test(slide.photo) ? 'image/webp' : 'image/jpeg') : null;
      await fs.writeFile(htmlFile, buildSlideHtml(job, slide, index, { ...assets, photo }), 'utf8');
      const result = await renderHtml(browser, sessionId, htmlFile, target);
      checks.push({ file: path.relative(job.output, target).replaceAll('\\', '/'), layout: slide.layout, ...result });
      files.push(target);
    }
  } finally {
    await browser.close();
    // profile is the exact unique directory created by this run under the OS temp dir.
    if (isInside(os.tmpdir(), profile) && path.basename(profile).startsWith('escolas-informative-chrome-')) await fs.rm(profile, { recursive: true, force: true, maxRetries: 4, retryDelay: 250 });
  }
  const manifest = { generator_version: 'informative-1.0.0', created_at: new Date().toISOString(), content_type: 'informative', school: job.school, format: job.format, slug: job.slug, safe_photo_reviewed: job.safe_photo_reviewed, photo_review_required: job.photos.length > 0, photos: job.photos, files, layouts: job.slides.map(slide => slide.layout), source_job: sourceJob, render_checks: checks };
  await fs.writeFile(path.join(job.output, 'copy.md'), copyMarkdown(job), 'utf8');
  await fs.writeFile(path.join(job.output, 'render-checks.json'), JSON.stringify(checks, null, 2), 'utf8');
  await fs.writeFile(path.join(job.output, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  console.log(JSON.stringify({ output: job.output, files: files.length, content_type: 'informative', overflow: false }, null, 2));
  return manifest;
}
