import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import { validateTheme, themeIllustration } from './informative_themes.mjs';

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
  const theme = validateTheme(job.theme);
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
      theme: validateTheme(slide.theme === undefined ? theme : slide.theme),
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
  return { content_type: 'informative', school: job.school, format: job.format, theme, slug, caption: plainText(job.caption, 'caption', 2200), output: path.resolve(root, job.output || path.join('outputs', job.school, slug)), slides, photos, safe_photo_reviewed: photos.length > 0 ? true : null };
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
  const paletteIndex = (index + (slide.layout === 'info-notice' ? 1 : 0)) % 3;
  const palette = job.school === 'aviaozinho'
    ? [{ primary: '#2D2F91', accent: '#FFD025', secondary: '#60C6F0' }, { primary: '#2D2F91', accent: '#FFD025', secondary: '#D03588' }, { primary: '#2D2F91', accent: '#60C6F0', secondary: '#68B93E' }][paletteIndex]
    : [{ primary: '#283D9B', accent: '#F6A90A', secondary: '#20BFD0' }, { primary: '#283D9B', accent: '#F6A90A', secondary: '#E85F66' }, { primary: '#283D9B', accent: '#F6A90A', secondary: '#F0391E' }][paletteIndex];
  const theme = slide.theme || job.theme || 'escola';
  const art = `<figure class="theme-art" data-measure>${themeIllustration(theme, job.school, index, slide.layout)}</figure>`;
  const items = itemMarkup(slide.items, slide.layout);
  const head = `<header class="heading" data-measure>${slide.eyebrow ? `<p class="eyebrow" data-measure>${escapeHtml(slide.eyebrow)}</p>` : ''}<h1 data-measure>${escapeHtml(slide.title)}</h1></header>`;
  const body = slide.body ? `<p class="body" data-measure>${escapeHtml(slide.body)}</p>` : '';
  const note = slide.note ? `<aside class="note" data-measure>${escapeHtml(slide.note)}</aside>` : '';
  const photo = assets.photo ? `<figure class="photo-frame" data-measure><img class="photo" src="${assets.photo}" alt="" /></figure>` : '';
  const intro = `<section class="intro" data-measure>${body}${art}</section>`;
  const story = slide.layout === 'info-summary' ? `${art}${head}${body}${photo}${note}` : `${head}${intro}${items}${photo}${note}`;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=1080"><title>${escapeHtml(slide.title)}</title><style>
@font-face{font-family:Heading;src:url('${assets.heading}');font-weight:${brand.weight}}
@font-face{font-family:Nunito;src:url('${assets.body}');font-weight:600}
@font-face{font-family:Nunito;src:url('${assets.bold}');font-weight:800}
*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1350px}body{font-family:Nunito,sans-serif;font-weight:600;color:${brand.ink}}
.post{--paper:${brand.paper};--ink:${brand.ink};--primary:${palette.primary};--accent:${palette.accent};--secondary:${palette.secondary};position:relative;width:1080px;height:1350px;background:var(--paper);overflow:hidden}
.post:after{content:"";position:absolute;inset:0;opacity:.032;pointer-events:none;z-index:4;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Cpath fill='%2314255E' filter='url(%23n)' opacity='.55' d='M0 0h140v140H0z'/%3E%3C/svg%3E")}
.field{position:absolute;inset:590px -80px 0;background:var(--secondary);transform:rotate(-6deg);border-radius:100px 100px 0 0}.field-alt{position:absolute;right:-130px;top:-125px;width:310px;height:310px;border:55px solid var(--accent);border-radius:50%}
.sprinkle{position:absolute;z-index:1;left:24px;top:385px;width:23px;height:23px;background:var(--secondary);transform:rotate(17deg);box-shadow:1000px 510px 0 var(--accent),24px 600px 0 var(--accent)}
.stage{position:absolute;left:72px;right:72px;top:74px;bottom:178px;display:flex;flex-direction:column;gap:25px;z-index:2}
h1,h2,p,figure{margin:0}h1{font-family:Heading,Nunito,sans-serif;font-size:88px;line-height:1.05;font-weight:${brand.weight};letter-spacing:-.025em;white-space:pre-line;overflow-wrap:break-word}
.heading{flex:none;position:relative}.eyebrow{font-size:23px;font-weight:800;letter-spacing:.095em;text-transform:uppercase;margin-bottom:23px;display:flex;align-items:center;gap:15px;line-height:1.3}.eyebrow:before{content:"";width:23px;height:23px;flex:none;background:var(--accent);border:4px solid var(--primary);border-radius:7px;transform:rotate(-12deg)}
.body{font-size:36px;line-height:1.32;white-space:pre-line;overflow-wrap:break-word;flex:none}.intro{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:18px;align-items:center;flex:none}.theme-art{display:flex;align-items:center;justify-content:center;width:300px;height:210px;flex:none}.theme-illustration{display:block;width:100%;height:100%;overflow:visible}
.note{font-size:30px;line-height:1.3;white-space:pre-line;overflow-wrap:break-word;flex:none;padding:22px 27px;background:var(--accent);border-radius:20px;box-shadow:6px 7px 0 var(--primary);margin-top:auto}
.items{display:flex;flex-direction:column;gap:20px;flex:none}.item{display:flex;gap:22px;align-items:flex-start;padding:24px 28px;background:var(--paper);border:4px solid var(--primary);border-radius:25px;box-shadow:7px 8px 0 var(--accent)}.item-copy{flex:1;min-width:0}h2{font-family:Nunito,sans-serif;font-size:36px;line-height:1.16;font-weight:800;white-space:pre-line;overflow-wrap:break-word}.item p{font-size:33px;line-height:1.26;margin-top:7px;white-space:pre-line;overflow-wrap:break-word}
.bullet{width:21px;height:21px;flex:none;margin-top:10px;border:4px solid var(--primary);border-radius:50%;background:var(--accent)}.check{margin-top:6px;width:27px;height:27px;flex:none;border:4px solid var(--primary);background:var(--accent);border-radius:7px;transform:rotate(-7deg)}
.footer{position:absolute;bottom:37px;left:72px;right:72px;height:98px;display:flex;align-items:center;justify-content:space-between;z-index:5}.logo{display:block;width:180px;height:98px;padding:10px;background:#fff;border-radius:18px;object-fit:contain;box-shadow:4px 5px 0 #14255e16}.pagination{display:flex;gap:10px;align-items:center;font-size:24px;font-weight:800;font-variant-numeric:tabular-nums;letter-spacing:.06em;background:var(--paper);border-radius:30px;padding:9px 16px 9px 9px}.pagination b{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:var(--paper)}
.info-cover .stage{gap:25px;top:84px}.info-cover .heading{padding:30px 33px;background:var(--paper);border-radius:22px;box-shadow:10px 11px 0 var(--accent);border:4px solid var(--primary)}.info-cover h1{font-size:100px}.info-cover .intro{display:flex;flex:1;flex-direction:column;gap:10px;align-items:flex-start;min-height:0}.info-cover .body{font-size:39px;max-width:810px;padding:12px 15px 0}.info-cover .theme-art{width:650px;height:410px;max-height:none;align-self:center;margin-top:auto}.info-cover .field{top:690px;background:var(--secondary);transform:rotate(-9deg);border-radius:140px 100px 0 0}.info-cover .note{margin-top:0;background:var(--paper)}
.info-explain .stage{gap:40px}.info-explain .heading{border-bottom:11px solid var(--accent);padding-bottom:22px}.info-explain .intro{flex:1;min-height:540px;padding:42px 35px 30px;background:var(--paper);border:6px solid var(--primary);border-radius:40px 40px 80px 30px;box-shadow:15px 16px 0 var(--accent);display:flex;flex-direction:column;align-items:flex-start;justify-content:space-between}.info-explain .body{font-size:42px;line-height:1.36;max-width:775px}.info-explain .theme-art{width:560px;height:375px;align-self:flex-end}.info-explain .field{inset:420px -150px 0 140px;transform:rotate(10deg);background:var(--secondary)}.info-explain .note{margin-top:0;background:var(--paper)}.info-explain.long-copy .intro{display:grid;grid-template-columns:minmax(0,1fr) 320px;align-items:center}.info-explain.long-copy .body{font-size:38px}.info-explain.long-copy .theme-art{width:320px;height:300px}
.info-list .heading{padding:24px 28px;background:var(--accent);border-radius:28px 28px 68px 28px;box-shadow:8px 9px 0 var(--primary)}.info-list .eyebrow:before{background:var(--paper)}.info-list .intro{padding-left:12px}.info-list .items{padding:0 11px;gap:22px}.info-list .item:nth-child(even){margin-left:24px;border-color:var(--secondary);box-shadow:7px 8px 0 var(--primary)}.info-list .item:nth-child(odd){margin-right:22px}.info-list .field{inset:610px -75px 0 28px;border-radius:100px 0 0 0;transform:rotate(-5deg)}.info-list h1,.info-steps h1,.info-notice h1{font-size:81px}
.info-steps .field{inset:0 0 0 750px;background:var(--secondary);transform:none;border-radius:0}.info-steps .stage{gap:22px}.info-steps .heading{padding-right:20px}.info-steps .intro{background:var(--paper);border-radius:25px;padding:0 15px}.info-steps .items{gap:22px;padding:0 12px}.info-steps .item{border:0;border-radius:20px 48px 20px 20px;background:var(--accent);box-shadow:8px 9px 0 var(--primary);padding:25px 27px;align-items:center}.info-steps .item:nth-child(even){background:var(--paper);border:4px solid var(--primary);margin-left:28px;border-radius:48px 20px 20px 20px;box-shadow:8px 9px 0 var(--secondary)}.item-index{font-family:Heading,sans-serif;font-size:48px;font-weight:${brand.weight};flex:none;width:77px;height:77px;background:var(--primary);color:var(--paper);border-radius:24px;display:grid;place-items:center;line-height:1;transform:rotate(-6deg)}.info-steps .item:nth-child(even) .item-index{background:var(--accent);color:var(--ink);border-radius:50%;transform:rotate(7deg)}
.info-compare .intro{grid-template-columns:minmax(0,1fr) 310px}.info-compare .theme-art{width:310px;height:235px}.info-compare .items{display:grid;grid-template-columns:1fr 1fr;gap:26px;flex:1;align-items:start;padding:12px 8px}.info-compare .item{position:relative;min-height:365px;padding:43px 26px 33px;background:var(--paper);border-width:6px;border-radius:18px 18px 60px 18px;box-shadow:10px 13px 0 var(--accent)}.info-compare .item:before{content:"";position:absolute;top:-17px;left:110px;width:95px;height:30px;background:var(--accent);transform:rotate(-8deg);opacity:.95}.info-compare .item:nth-child(2){margin-top:35px;border-color:var(--primary);box-shadow:10px 13px 0 var(--secondary);border-radius:18px 18px 18px 60px}.info-compare .item:nth-child(2):before{transform:rotate(8deg);background:var(--secondary)}.info-compare h2{font-size:38px}.info-compare .item p{font-size:35px;line-height:1.33;margin-top:24px}.info-compare .field{inset:690px -100px 0;background:var(--accent);border-radius:80px 80px 0 0;transform:rotate(6deg)}
.info-summary .stage{align-items:stretch;gap:23px}.info-summary .theme-art{width:520px;height:310px;align-self:center;flex:none}.info-summary .heading{background:var(--primary);color:var(--paper);padding:32px 33px;border-radius:30px 70px 28px 28px;box-shadow:12px 12px 0 var(--accent)}.info-summary .eyebrow:before{border-color:var(--paper);background:var(--accent)}.info-summary h1{font-size:88px}.info-summary .body{font-size:38px;padding:5px 28px}.info-summary .note{background:var(--paper);margin:0 18px;box-shadow:7px 8px 0 var(--primary);font-size:31px;border:4px solid var(--primary)}.info-summary .field{inset:740px -75px 0;background:var(--secondary);transform:rotate(-9deg)}
.info-notice .stage{top:64px;gap:20px}.info-notice .heading{padding:21px 28px 25px;border:5px solid var(--primary);border-radius:22px;background:var(--paper);box-shadow:10px 10px 0 var(--accent)}.info-notice .intro{grid-template-columns:minmax(0,1fr) 320px;gap:14px;padding-left:14px}.info-notice .theme-art{width:320px;height:220px}.info-notice .body{font-size:35px}.info-notice .items{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:6px 7px;align-items:stretch}.info-notice .item{padding:24px 21px;gap:14px;border:4px solid var(--primary);border-radius:20px;box-shadow:7px 8px 0 var(--accent)}.info-notice .item:nth-child(even){background:var(--accent);box-shadow:7px 8px 0 var(--primary);border-color:var(--paper)}.info-notice .item:nth-child(3):last-child{grid-column:1/-1;max-width:100%;margin:0 30px;background:var(--paper);box-shadow:7px 8px 0 var(--secondary)}.info-notice .item h2{font-size:35px}.info-notice .item p{font-size:32px;line-height:1.25}.info-notice .check{width:25px;height:25px}.info-notice .field{inset:650px -70px 0;background:var(--secondary);transform:rotate(-6deg)}.info-notice .note{font-size:29px;margin-top:0;background:var(--paper);padding:18px 24px}
.photo-frame{flex:1;min-height:220px;max-height:350px;width:100%;padding:16px;background:var(--paper);border:5px solid var(--secondary);border-radius:24px}.photo{display:block;width:100%;height:100%;object-fit:contain;object-position:center}.has-photo .theme-art{width:230px;height:155px}.has-photo .intro{flex:none;min-height:0;grid-template-columns:minmax(0,1fr) 230px;padding:15px}.has-photo h1{font-size:78px}.has-photo .stage{gap:21px}.has-photo .body{font-size:34px}.has-photo .note{font-size:28px;padding:18px 24px}.has-photo .items{gap:15px}.has-photo .item p{font-size:30px}.has-photo .item h2{font-size:33px}.has-photo.info-cover .intro{display:grid}.has-photo.info-summary .theme-art{height:170px;width:260px}
</style></head><body><main class="post ${job.school} ${slide.layout} theme-${theme}${slide.body.length > 200 ? ' long-copy' : ''}${assets.photo ? ' has-photo' : ''}"><div class="field" aria-hidden="true"></div><div class="field-alt" aria-hidden="true"></div><div class="sprinkle" aria-hidden="true"></div><article class="stage">${story}</article><footer class="footer"><img class="logo" src="${assets.logo}" alt="${escapeHtml(brand.name)}"/>${job.format === 'carousel' ? `<div class="pagination"><b>${index + 1}</b><span>/ ${job.slides.length}</span></div>` : ''}</footer></main><script id="render-check" type="application/json">{"ok":false,"errors":["Render não concluído"]}</script><script>${MEASURE_SCRIPT}</script></body></html>`;
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
      checks.push({ file: path.relative(job.output, target).replaceAll('\\', '/'), layout: slide.layout, theme: slide.theme, ...result });
      files.push(target);
    }
  } finally {
    await browser.close();
    // profile is the exact unique directory created by this run under the OS temp dir.
    if (isInside(os.tmpdir(), profile) && path.basename(profile).startsWith('escolas-informative-chrome-')) await fs.rm(profile, { recursive: true, force: true, maxRetries: 4, retryDelay: 250 });
  }
  const manifest = { generator_version: 'informative-1.1.0', created_at: new Date().toISOString(), content_type: 'informative', school: job.school, format: job.format, theme: job.theme, slide_themes: job.slides.map(slide => slide.theme), slug: job.slug, safe_photo_reviewed: job.safe_photo_reviewed, photo_review_required: job.photos.length > 0, photos: job.photos, files, layouts: job.slides.map(slide => slide.layout), source_job: sourceJob, render_checks: checks };
  await fs.writeFile(path.join(job.output, 'copy.md'), copyMarkdown(job), 'utf8');
  await fs.writeFile(path.join(job.output, 'render-checks.json'), JSON.stringify(checks, null, 2), 'utf8');
  await fs.writeFile(path.join(job.output, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  console.log(JSON.stringify({ output: job.output, files: files.length, content_type: 'informative', overflow: false }, null, 2));
  return manifest;
}
