import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { validateInformativeJob, buildSlideHtml, loadBrandAssets } from '../tools/informative_posts.mjs';
import { themeIllustration, THEMES } from '../tools/informative_themes.mjs';

const simple = (extra = {}) => ({ content_type: 'informative', school: 'colibri', format: 'static', slug: 'teste', title: 'Uma informação clara', body: 'Um recado para as famílias.', ...extra });

test('tema padrão mantém jobs antigos e override da tela é explícito', async () => {
  const old = await validateInformativeJob(simple());
  assert.equal(old.theme, 'escola');
  assert.equal(old.slides[0].theme, 'escola');
  const themed = await validateInformativeJob(simple({ theme: 'pertences', slides: [{ layout: 'info-cover', title: 'Um recado', theme: 'recados' }] }));
  assert.equal(themed.theme, 'pertences');
  assert.equal(themed.slides[0].theme, 'recados');
  await assert.rejects(validateInformativeJob(simple({ theme: '<script>tema</script>' })), /repertório/);
  await assert.rejects(validateInformativeJob(simple({ slides: [{ layout: 'info-cover', title: 'Uma tela', theme: 'inexistente' }] })), /repertório/);
});

test('repertório temático varia objetos e preserva território visual do Colibri', () => {
  for (const theme of THEMES) {
    const first = themeIllustration(theme, 'colibri', 0, 'info-cover');
    const second = themeIllustration(theme, 'colibri', 1, 'info-cover');
    assert.ok(first.includes('<svg'));
    assert.notEqual(first, second);
    assert.notEqual(first, themeIllustration(theme, 'colibri', 0, 'info-list'));
    assert.ok(!/data-object="(?:kite|plane|cloud)"/.test(first + second));
  }
  assert.match(themeIllustration('dia-das-criancas', 'colibri', 0, 'info-cover'), /data-object="ball"/);
  const aviaoHoliday = themeIllustration('dia-das-criancas', 'aviaozinho', 0, 'info-notice');
  assert.match(aviaoHoliday, /data-object="book"/);
  assert.match(aviaoHoliday, /data-object="pencil"/);
  assert.match(aviaoHoliday, /data-object="box"/);
});

test('informativo sem foto normaliza estático e dispensa revisão fotográfica', async () => {
  const job = await validateInformativeJob(simple());
  assert.equal(job.slides[0].layout, 'info-notice');
  assert.deepEqual(job.photos, []);
  assert.equal(job.safe_photo_reviewed, null);
  assert.equal((await validateInformativeJob(simple({ title: undefined, slides: [{ layout: 'info-summary', title: 'Fechamento' }] }))).slides.length, 1);
});

test('recusa valores inválidos e excesso de texto ou itens sem cortar conteúdo', async () => {
  for (const extra of [{ school: 'outra' }, { format: 'video' }, { title: '' }, { title: 'x'.repeat(91) }, { layout: 'cover' }, { layout: 'info-list', items: [] }, { layout: 'info-compare', items: [{ title: 'Só um lado' }] }, { format: 'carousel', slides: [{ title: 'Uma tela', layout: 'info-cover' }] }]) {
    await assert.rejects(validateInformativeJob(simple(extra)));
  }
});

test('foto exige revisão e permanece dentro de inputs inclusive via link', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'escolas-input-test-'));
  try {
    await fs.mkdir(path.join(root, 'inputs'));
    await fs.writeFile(path.join(root, 'inputs', 'foto.png'), 'fixture');
    await fs.writeFile(path.join(root, 'fora.png'), 'fixture');
    await assert.rejects(validateInformativeJob(simple({ photo: 'inputs/foto.png' }), { root }), /safe_photo_reviewed/);
    const withPhoto = await validateInformativeJob(simple({ photo: 'inputs/foto.png', safe_photo_reviewed: true }), { root });
    assert.equal(withPhoto.photos.length, 1);
    const topPhoto = await validateInformativeJob(simple({ photo: 'inputs/foto.png', safe_photo_reviewed: true, slides: [{ layout: 'info-explain', title: 'Foto do contexto' }] }), { root });
    assert.equal(topPhoto.slides[0].photo, withPhoto.photos[0]);
    await assert.rejects(validateInformativeJob(simple({ photo: 'inputs/foto.png', safe_photo_reviewed: true, slides: [{ layout: 'info-explain', title: 'Conflito', photo: 'inputs/outra.png' }] }), { root }), /conflitante/);
    await assert.rejects(validateInformativeJob(simple({ photo: 'fora.png', safe_photo_reviewed: true }), { root }), /inputs/);
    await fs.mkdir(path.join(root, 'external'));
    await fs.writeFile(path.join(root, 'external', 'foto.png'), 'fixture');
    await fs.symlink(path.join(root, 'external'), path.join(root, 'inputs', 'link'), process.platform === 'win32' ? 'junction' : 'dir');
    await assert.rejects(validateInformativeJob(simple({ photo: 'inputs/link/foto.png', safe_photo_reviewed: true }), { root }), /inputs/);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test('entrypoint preserva o legado e despacha somente informative para o módulo novo', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'escolas-dispatch-test-'));
  try {
    await fs.mkdir(path.join(root, 'tools'));
    await fs.copyFile(new URL('../tools/generate_posts.mjs', import.meta.url), path.join(root, 'tools', 'generate_posts.mjs'));
    await fs.writeFile(path.join(root, 'tools', 'build_test_posts.mjs'), 'console.log("LEGACY_SELECTED")');
    await fs.writeFile(path.join(root, 'tools', 'informative_posts.mjs'), 'export async function buildInformativeJob() { console.log("INFORMATIVE_SELECTED") }');
    await fs.writeFile(path.join(root, 'legacy.json'), JSON.stringify({ school: 'colibri' }));
    await fs.writeFile(path.join(root, 'informative.json'), JSON.stringify({ content_type: 'informative' }));
    for (const [args, expected] of [[['--help'], 'LEGACY_SELECTED'], [['--job', 'legacy.json'], 'LEGACY_SELECTED'], [['--job', 'informative.json'], 'INFORMATIVE_SELECTED']]) {
      const { stdout } = await promisify(execFile)(process.execPath, [path.join(root, 'tools', 'generate_posts.mjs'), ...args], { cwd: root });
      assert.equal(stdout.trim(), expected);
    }
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test('HTML escapa dados e usa assets locais, sem injetar marcação', async () => {
  const job = await validateInformativeJob(simple({ title: '<script>ruim()</script>', body: 'A & B "texto"' }));
  const html = buildSlideHtml(job, job.slides[0], 0, await loadBrandAssets(job.school));
  assert.ok(html.includes('&lt;script&gt;ruim()&lt;/script&gt;'));
  assert.ok(html.includes('A &amp; B &quot;texto&quot;'));
  assert.ok(html.includes('data:font/ttf;base64,'));
  assert.ok(html.includes('data:image/jpeg;base64,'));
  assert.ok(!html.includes('<script>ruim()'));
  assert.ok(html.includes('object-fit:contain'));
});
