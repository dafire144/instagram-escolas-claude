import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inputs = ['conteudo-demonstrativo.json', 'conteudo-dia-das-criancas.json'];
const publications = (await Promise.all(inputs.map(async name => JSON.parse(await fs.readFile(path.join(root, 'examples/informativos', name), 'utf8')).publications))).flat();
const output = path.join(root, 'outputs/informativos-v2-2026-10-12');
const jobDir = path.join(root, 'jobs/informativos-v2-2026-10-12');
const escape = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const relative = file => path.relative(output, file).split(path.sep).map(encodeURIComponent).join('/');
const names = { aviaozinho: 'Aviãozinho de Papel', colibri: 'Colibri' };
await fs.mkdir(output, { recursive: true });
await fs.mkdir(jobDir, { recursive: true });
const prepared = [];
const themeLabels = { escola: 'Escola', pertences: 'Pertences', recados: 'Recados', 'familia-escola': 'Família e escola', 'dia-das-criancas': 'Dia das Crianças' };

for (const [index, publication] of publications.entries()) {
  const folder = path.join(output, publication.school, publication.slug);
  const job = { ...publication, content_type: 'informative', output: path.relative(root, folder).split(path.sep).join('/') };
  const jobPath = path.join(jobDir, `${String(index + 1).padStart(2, '0')}-${publication.school}-${publication.slug}.json`);
  if (!process.argv.includes('--gallery-only')) {
    await fs.writeFile(jobPath, JSON.stringify(job, null, 2) + '\n');
    if (!process.argv.includes('--prepare-only')) {
      const result = await run(process.execPath, [path.join(root, 'tools/generate_posts.mjs'), '--job', jobPath], { cwd: root, maxBuffer: 8 * 1024 * 1024 });
      console.log(`${publication.school}/${publication.slug}: ${result.stdout.trim()}`);
      const checked = await run(process.execPath, [path.join(root, '.claude/skills/gerar-posts-escolas/scripts/audit-output.mjs'), '--job', jobPath], { cwd: root });
      console.log(checked.stdout.trim());
    }
  }
  const files = publication.format === 'static'
    ? [path.join(folder, 'post-estatico.png')]
    : publication.slides.map((_, i) => path.join(folder, 'png', `slide-${String(i + 1).padStart(2, '0')}.png`));
  prepared.push({ publication, folder, files });
}

if (!process.argv.includes('--prepare-only')) {
  for (const { folder } of prepared) {
    await fs.writeFile(path.join(folder, 'AUDITORIA-PESSOAS.md'), '# Revisão de pessoas\n\nNão aplicável: publicação informativa sem fotografia. Nenhuma pessoa representada e nenhuma revisão fotográfica simulada.\n');
  }
  await fs.writeFile(path.join(output, 'PLANO-SAFRA.md'), `# Exemplos do formato informativo\n\nDemonstrações para avaliação, sem calendário de publicação. Sem fotos; a fonte editorial é o conteúdo demonstrativo versionado.\n\n| Escola | Publicação | Formato | Telas | Composições |\n|---|---|---|---:|---|\n${prepared.map(({ publication: p, files }) => `| ${names[p.school]} | ${p.title} | ${p.format === 'static' ? 'Estático' : 'Carrossel'} | ${files.length} | ${p.slides.map(s => s.layout).join(', ')} |`).join('\n')}\n`);
  const sections = Object.entries(names).map(([school, name]) => {
    const pieces = prepared.filter(p => p.publication.school === school).sort((a, b) => Number(b.publication.theme === 'dia-das-criancas') - Number(a.publication.theme === 'dia-das-criancas'));
    return `<section id="${school}"><h2>${name}</h2>${pieces.map(({ publication: p, files, folder }) => `<article><div class="piece-head"><div><span class="tag">${p.format === 'static' ? 'Estático informativo' : 'Carrossel informativo'}</span><h3>${escape(p.title || p.slides[0].title)}</h3></div><a class="copy" href="${relative(path.join(folder, 'copy.md'))}">Ler legenda ↗</a></div><div class="slides">${files.map((f, i) => `<a class="slide" href="${relative(f)}" target="_blank"><img src="${relative(f)}" alt="${escape(p.slides[i]?.title || p.title)}" loading="eager"><span>${p.format === 'static' ? 'Arte única' : `Tela ${i + 1} de ${files.length}`}</span></a>`).join('')}</div></article>`).join('')}</section>`;
  }).join('');
  const css = `*{box-sizing:border-box}body{margin:0;background:#f4f4f1;color:#202a36;font:16px/1.5 system-ui,sans-serif}header,main{max-width:1720px;margin:auto;padding:36px 40px}header{padding-bottom:8px}h1{font-size:42px;line-height:1.12;margin:12px 0 18px;letter-spacing:-1.4px}header p{max-width:760px;color:#535d65}nav{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}nav a,.copy{background:white;border:1px solid #d4d9dc;padding:10px 18px;border-radius:30px;color:inherit;text-decoration:none}.label,.tag{text-transform:uppercase;letter-spacing:2px;font-size:11px;font-weight:750;color:#556470}h2{font-size:32px;margin:0 0 20px}section{scroll-margin-top:20px;margin-bottom:60px}article{background:#fff;border:1px solid #dfe3e5;padding:24px;border-radius:20px;margin-bottom:24px}.piece-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:22px}h3{font-size:22px;line-height:1.2;margin:8px 0 0}.slides{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.slide{text-decoration:none;color:#66717a;display:block;font-size:12px}.slide img{width:100%;height:auto;display:block;border-radius:8px;border:1px solid #edf0f2}.slide span{display:block;margin:8px 0 0}article:has(.slide:only-child) .slides{max-width:500px;grid-template-columns:1fr}footer{max-width:1720px;margin:auto;padding:0 40px 48px;color:#68747c;font-size:13px}@media(max-width:760px){header,main{padding:24px 18px}h1{font-size:32px}.slides{grid-template-columns:1fr}article{padding:16px}.piece-head{align-items:flex-start;flex-direction:column}.copy{font-size:13px}}`;
  const totalImages = prepared.reduce((sum, p) => sum + p.files.length, 0);
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Informativos com vida e tema | Escolas</title><style>${css}</style></head><body><header><span class="label">Aviãozinho de Papel · Colibri · Revisão visual 2</span><h1>Cada assunto ganha suas cores e seus elementos.</h1><p>Informativos com composições lúdicas e ilustrações que acompanham o tema. Dia das Crianças, pertences, recados e conversa com a escola. Exemplos para avaliação visual, sem publicação ou anúncio de eventos das escolas.</p><nav><a href="#aviaozinho">Aviãozinho de Papel</a><a href="#colibri">Colibri</a></nav></header><main>${sections}</main><footer>${prepared.length} publicações demonstrativas · ${totalImages} artes · 1080 × 1350 px. Abra qualquer arte para vê-la em tamanho original.</footer></body></html>`;
  await fs.writeFile(path.join(output, 'GALERIA.html'), html);
  for (const [school, name] of Object.entries(names)) {
    const pieces = prepared.filter(p => p.publication.school === school).sort((a, b) => Number(b.publication.theme === 'dia-das-criancas') - Number(a.publication.theme === 'dia-das-criancas'));
    const cards = pieces.flatMap(({ publication, files }) => files.map((file, i) => `<figure><img src="${relative(file)}"><figcaption>${themeLabels[publication.theme] || 'Informativo'} · ${publication.format === 'static' ? 'Estático' : `Tela ${i + 1}/${files.length}`}</figcaption></figure>`)).join('');
    await fs.writeFile(path.join(output, `prancha-${school}.html`), `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${name} | Informativos</title><style>*{box-sizing:border-box}body{margin:0;padding:34px 40px;background:#eaece9;font:18px system-ui;color:#23303e}h1{font-size:32px;margin:0 0 4px}p{margin:0 0 24px;color:#5a6874;font-size:16px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}figure{margin:0}img{display:block;width:100%;border-radius:5px}figcaption{margin:6px 0 0;font-size:13px}</style></head><body><h1>${name}</h1><p>Formato informativo · Exemplos para avaliação · 12/10/2026</p><div class="grid">${cards}</div></body></html>`);
  }
  const celebration = prepared.filter(p => p.publication.theme === 'dia-das-criancas');
  await fs.writeFile(path.join(output, 'dia-das-criancas.html'), `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Dia das Crianças | Nova direção</title><style>*{box-sizing:border-box}body{margin:0;padding:30px;background:#f0f0e9;color:#22314a;font-family:system-ui}h1{font-size:28px;margin:0 0 6px}p{margin:0 0 22px;color:#566379}.pair{display:grid;grid-template-columns:1fr 1fr;gap:24px}figure{margin:0}img{display:block;width:100%}figcaption{font-weight:700;margin-top:10px}</style><h1>Dia das Crianças</h1><p>Exemplos da direção informativa mais lúdica e temática.</p><div class="pair">${celebration.map(({ publication: p, files }) => `<figure><img src="${relative(files[0])}"><figcaption>${names[p.school]}</figcaption></figure>`).join('')}</div></html>`);
  await fs.writeFile(path.join(output, 'LEIA-ME.md'), `# Formato informativo das escolas, revisão visual 2\n\nRevisão pedida pelo Sr. Davi em 12/10/2026: informativos mais animados, como os posts de cotidiano, com elementos relacionados ao assunto. A direção anterior não foi aprovada visualmente.\n\nExemplos para avaliação. Não representam novos comunicados, regras ou eventos das escolas; não publicados no Instagram.\n\n- Dois carrosséis de seis telas e quatro estáticos.\n- Total: ${totalImages} PNGs em 1080 × 1350, ${prepared.length} legendas, fontes HTML e manifestos.\n- Inclui dois exemplos de Dia das Crianças.\n- Sem fotografias de crianças; revisão fotográfica não se aplica.\n- Abrir GALERIA.html para navegar.\n- Versão anterior preservada em outputs/informativos-2026-10-12/.\n`);
}
console.log(JSON.stringify({ output, publications: prepared.length, images: prepared.reduce((sum, p) => sum + p.files.length, 0), preparedOnly: process.argv.includes('--prepare-only') }));
