import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");
const RAW = path.join(ROOT, "raw", "imagens-base-manual-de-marca");
const MANUALS = path.join(ROOT, "manuais-de-marca");
let OUT = path.join(ROOT, "safra-teste-01-v2");
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const CHROME = CHROME_CANDIDATES.find((candidate) => fsSync.existsSync(candidate));
if (!CHROME) {
  throw new Error("Google Chrome não encontrado. Defina CHROME_PATH com o executável do navegador.");
}
const FONT_DIR = path.join(ROOT, "assets", "fonts");
const fontFiles = {
  fredoka600: path.join(FONT_DIR, "Fredoka-600.ttf"),
  fredoka700: path.join(FONT_DIR, "Fredoka-700.ttf"),
  baloo600: path.join(FONT_DIR, "Baloo2-600.ttf"),
  baloo800: path.join(FONT_DIR, "Baloo2-800.ttf"),
  bubblegum: path.join(FONT_DIR, "BubblegumSans-400.ttf"),
  nunito600: path.join(FONT_DIR, "Nunito-600.ttf"),
  nunito800: path.join(FONT_DIR, "Nunito-800.ttf"),
};
const fontData = Object.fromEntries(
  await Promise.all(
    Object.entries(fontFiles).map(async ([key, file]) => [key, (await fs.readFile(file)).toString("base64")]),
  ),
);

const CONTENT = {
  aviaozinho: {
    name: "Aviãozinho de Papel",
    photoDir: path.join(RAW, "Aviãozinho de Papel", "fotos-criancas"),
    logoSource: path.join(ROOT, "assets", "logos", "render", "aviaozinho.jpg"),
    colors: {
      paper: "#FFFDF7",
      sky: "#5E93CD",
      blue: "#3472B9",
      ink: "#2D2F91",
      yellow: "#FFD025",
      cyan: "#60C6F0",
      pink: "#D03588",
      green: "#68B93E",
    },
    carousel: {
      slug: "carrossel-a-cor-comeca-nas-maos",
      photoIndices: [5, 7, 8, 9, 12, 14],
      slides: [
        { title: "A COR COMEÇA NAS MÃOS", body: "Antes do desenho, existe o toque.", layout: "cover" },
        { title: "PRIMEIRO, A COR.", body: "O dedo encontra a tinta. A tinta encontra o papel.", layout: "split" },
        { title: "DEPOIS, A ESCOLHA.", body: "Um risco aqui. Outra cor ali. A página começa a mudar.", layout: "polaroid" },
        { title: "MISTURAR TAMBÉM É CRIAR.", body: "As cores se encontram e novos tons aparecem.", layout: "color" },
        { title: "UMA PERGUNTA PARA CASA:", body: "“Que nome você daria para essa cor?”", layout: "question" },
        { title: "A FOLHA GUARDA CADA ESCOLHA.", body: "Salve para criar em família.", layout: "cta" },
      ],
      caption: `Antes de existir desenho, existe o encontro: mão, cor, papel e vontade de experimentar. Nesta atividade, as crianças tocaram a tinta, escolheram tons, fizeram riscos e acompanharam as marcas que surgiam. Uma cor encontrou a outra. Um traço puxou o próximo.

O bonito não está em todas as folhas parecerem iguais, mas em cada criação carregar um caminho diferente.

Em casa, a brincadeira pode continuar com lápis, giz ou tinta e uma pergunta simples: “Que nome você daria para essa cor?”

A resposta pode abrir mais uma página para a imaginação. Salve esta ideia para um próximo momento de criação em família.`,
    },
    static: {
      slug: "estatico-o-caminho-aparece-tentando",
      photoIndex: 3,
      title: "O CAMINHO APARECE TENTANDO.",
      body: "Um passo. Uma pausa. Outro jeito de passar.",
      caption: `Entre um elástico e outro, o caminho não vem pronto. É preciso olhar, escolher por onde passar, testar um movimento e, às vezes, mudar de ideia.

A foto de hoje guarda justamente esse instante: a criança diante de um percurso que pede tentativa. Um passo. Uma pausa. Outro jeito.

Não importa transformar a brincadeira em corrida ou buscar um acerto perfeito. O que vale observar é o processo acontecendo, com o corpo em ação e novas possibilidades aparecendo pelo caminho.

Cada tentativa desenha uma rota diferente. E toda descoberta pode começar com a coragem tranquila de tentar mais uma vez.

Qual tentativa merece aplauso por aí hoje?`,
    },
  },
  colibri: {
    name: "Colibri",
    photoDir: path.join(RAW, "Colibri", "fotos-de-crianças"),
    logoSource: path.join(ROOT, "assets", "logos", "render", "colibri.jpg"),
    colors: {
      paper: "#FFF7E8",
      blue: "#283D9B",
      navy: "#14255E",
      orange: "#F0391E",
      gold: "#F6A90A",
      white: "#FFFFFF",
      cyan: "#20BFD0",
      coral: "#E85F66",
    },
    carousel: {
      slug: "carrossel-agua-em-movimento",
      photoIndices: [2, 6, 8, 11, 23, 1],
      slides: [
        { title: "ÁGUA EM MOVIMENTO", body: "Gestos, escolhas e encontros na mesma experiência.", layout: "cover" },
        { title: "ENCHER. VIRAR. RECOMEÇAR.", body: "A água muda de forma a cada movimento.", layout: "split" },
        { title: "CADA OBJETO CONVIDA A UMA AÇÃO.", body: "Pegar, despejar, transportar, observar.", layout: "steps" },
        { title: "JUNTO, O RITMO MUDA.", body: "A brincadeira abre espaço para observar, esperar e compartilhar materiais.", layout: "group" },
        { title: "EXPERIMENTE EM CASA:", body: "Dois potes de tamanhos diferentes. Onde cabe mais?", layout: "question" },
        { title: "UMA ATIVIDADE. MUITOS JEITOS DE PARTICIPAR.", body: "Salve esta ideia.", layout: "cta" },
      ],
      caption: `Água nunca fica parada por muito tempo quando entra na brincadeira. Ela passa de um pote para outro, escorre, ocupa espaços e muda conforme as mãos se movimentam.

Nesta experiência, os materiais criaram convites simples: encher, virar, transportar, observar e recomeçar.

Quando a atividade acontece em grupo, também surgem momentos de convivência, como acompanhar o gesto do outro, esperar um espaço e compartilhar objetos.

Sem transformar a brincadeira em aula, a cena mostra algo importante: experimentar junto abre muitas possibilidades.

Em casa, dois potes de tamanhos diferentes já rendem uma boa pergunta: “Onde cabe mais?”

Salve a ideia para um dia de água e descoberta.`,
    },
    static: {
      slug: "estatico-conseguir-comeca-tentando",
      photoIndex: 14,
      title: "CONSEGUIR COMEÇA TENTANDO.",
      body: "Um gesto de cada vez. Um sorriso no caminho.",
      caption: `Nem toda conquista precisa ser grande para merecer atenção. Às vezes, ela aparece quando a criança tenta de novo, encontra outro jeito e sorri no meio da atividade.

O retrato de hoje registra um instante assim: um sorriso e uma experiência em andamento.

O valor está no que pode ser visto pelo caminho. Observar. Experimentar. Ajustar. Continuar. Sem pressa para acertar de primeira e sem comparar ritmos.

Uma tentativa não precisa terminar em perfeição para valer. Ela pode abrir espaço para a próxima escolha, o próximo gesto, o próximo jeito de fazer.

Conte para a gente: qual pequena conquista deixou o seu dia mais alegre?`,
    },
  },
};

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

async function listImages(directory) {
  const found = [];
  async function walk(current) {
    for (const item of await fs.readdir(current, { withFileTypes: true })) {
      const full = path.join(current, item.name);
      if (item.isDirectory()) await walk(full);
      else if (/\.(jpe?g|png|webp)$/i.test(item.name)) found.push(full);
    }
  }
  await walk(directory);
  return found.sort((a, b) => a.localeCompare(b, "pt-BR"));
}

async function prepareLogo(brandKey, brand) {
  const dir = path.join(OUT, "_assets");
  await fs.mkdir(dir, { recursive: true });
  const target = path.join(dir, `${brandKey}-logo${path.extname(brand.logoSource)}`);
  await fs.copyFile(brand.logoSource, target);
  return target;
}

function commonCss() {
  return `
    @font-face{font-family:Fredoka;src:url(data:font/ttf;base64,${fontData.fredoka600});font-weight:600}
    @font-face{font-family:Fredoka;src:url(data:font/ttf;base64,${fontData.fredoka700});font-weight:700}
    @font-face{font-family:Baloo;src:url(data:font/ttf;base64,${fontData.baloo600});font-weight:600}
    @font-face{font-family:Baloo;src:url(data:font/ttf;base64,${fontData.baloo800});font-weight:800}
    @font-face{font-family:Bubblegum;src:url(data:font/ttf;base64,${fontData.bubblegum});font-weight:400}
    @font-face{font-family:Nunito;src:url(data:font/ttf;base64,${fontData.nunito600});font-weight:600}
    @font-face{font-family:Nunito;src:url(data:font/ttf;base64,${fontData.nunito800});font-weight:800}
    *{box-sizing:border-box}
    html,body{margin:0;width:1080px;height:1350px;overflow:hidden}
    body{font-family:Nunito,Arial,sans-serif}
    .post{position:relative;width:1080px;height:1350px;overflow:hidden}
    .photo{position:absolute;display:block;width:100%;height:100%;object-fit:contain;object-position:center}
    .logo-pill{position:absolute;z-index:20;width:192px;height:108px;background-color:#fff;background-repeat:no-repeat;background-position:center;background-size:160px 82px;border-radius:18px;box-shadow:0 8px 22px #0002}
    .counter{position:absolute;z-index:20;font-weight:700;font-size:22px;letter-spacing:.08em}
    .kicker{font-size:20px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
    h1{margin:0;font-weight:800;letter-spacing:-.025em;line-height:.94}
    p{margin:0;line-height:1.23}
    .safe-photo{position:absolute;overflow:hidden}
    .safe-photo .photo{inset:0}
  `;
}

function aviDecor(index) {
  const variants = [
    `<div class="kid-shape star one">★</div><div class="kid-shape dot pink"></div><div class="kid-shape arc"></div>`,
    `<div class="kid-shape cloud">☁</div><div class="kid-shape squiggle">∿∿∿</div><div class="kid-shape dot green"></div>`,
    `<div class="kid-shape sun">☀</div><div class="kid-shape triangle"></div><div class="kid-shape dot pink"></div>`,
    `<div class="kid-shape splash pink"></div><div class="kid-shape splash cyan"></div><div class="kid-shape star two">★</div>`,
    `<div class="kid-shape bubble">?</div><div class="kid-shape pencil">✎</div><div class="kid-shape dot yellow"></div>`,
    `<div class="kid-shape plane">➤</div><div class="kid-shape cloud small">☁</div><div class="kid-shape confetti">● ◆ ▲ ●</div>`,
  ];
  return variants[index % variants.length];
}

function colibriDecor(index) {
  const variants = [
    `<div class="col-shape bubble a"></div><div class="col-shape bubble b"></div><div class="col-shape zig">〰</div>`,
    `<div class="col-shape rainbow"><i></i><i></i><i></i></div><div class="col-shape spark">✦</div>`,
    `<div class="col-shape blocks"><i></i><i></i><i></i></div><div class="col-shape ring"></div>`,
    `<div class="col-shape burst">✹</div><div class="col-shape beadline">● ● ● ●</div>`,
    `<div class="col-shape drops"><i></i><i></i><i></i></div><div class="col-shape wave">≈</div>`,
    `<div class="col-shape confetti">● ▲ ■ ● ◆</div><div class="col-shape smile">⌣</div>`,
  ];
  return variants[index % variants.length];
}

function aviSlide(brand, slide, image, index, total, logoUrl, standalone = false) {
  const c = brand.colors;
  const photoUrl = pathToFileURL(image).href;
  const base = `
  <style>
    ${commonCss()}
    .post{background:${c.paper};color:${c.ink}}
    h1{font-family:Fredoka,Nunito,sans-serif}
    .paper{background:${c.paper};box-shadow:0 18px 45px #244b7824}
    .kid-shape{position:absolute;z-index:14;line-height:1;pointer-events:none}
    .kid-shape.star{color:${c.yellow};font-size:78px;filter:drop-shadow(0 6px 0 #fff)}
    .kid-shape.star.one{left:45px;top:42px;transform:rotate(-12deg)}
    .kid-shape.star.two{right:66px;top:54px;transform:rotate(13deg)}
    .kid-shape.dot{width:78px;height:78px;border-radius:50%;border:10px solid #fff}
    .kid-shape.dot.pink{right:58px;top:250px;background:${c.pink}}
    .kid-shape.dot.green{right:54px;top:52px;background:${c.green}}
    .kid-shape.dot.yellow{right:62px;top:58px;background:${c.yellow}}
    .kid-shape.arc{right:-65px;top:70px;width:310px;height:160px;border:34px solid ${c.cyan};border-left-color:${c.yellow};border-bottom-color:${c.pink};border-radius:220px 220px 0 0;transform:rotate(14deg)}
    .kid-shape.cloud{left:38px;top:48px;font-size:110px;color:#fff;filter:drop-shadow(7px 9px 0 ${c.cyan})}
    .kid-shape.cloud.small{left:55px;top:58px;font-size:95px;color:#fff;filter:drop-shadow(6px 8px 0 ${c.cyan})}
    .kid-shape.squiggle{right:36px;top:60px;font-family:Bubblegum,cursive;font-size:74px;color:${c.yellow};transform:rotate(-8deg)}
    .kid-shape.sun{left:38px;top:38px;font-size:112px;color:${c.yellow};filter:drop-shadow(5px 7px 0 ${c.pink})}
    .kid-shape.triangle{right:58px;top:56px;width:0;height:0;border-left:52px solid transparent;border-right:52px solid transparent;border-bottom:92px solid ${c.green};transform:rotate(18deg)}
    .kid-shape.splash{width:155px;height:122px;border-radius:48% 52% 44% 56%;filter:drop-shadow(8px 10px 0 #fff)}
    .kid-shape.splash.pink{right:45px;top:55px;background:${c.pink};transform:rotate(21deg)}
    .kid-shape.splash.cyan{left:36px;top:85px;background:${c.cyan};transform:rotate(-13deg)}
    .kid-shape.bubble{left:42px;top:54px;width:100px;height:100px;border-radius:50%;display:grid;place-items:center;background:${c.yellow};color:${c.ink};font-family:Fredoka;font-size:62px;border:8px solid #fff}
    .kid-shape.pencil{right:54px;top:65px;color:${c.pink};font-size:96px;transform:rotate(-16deg)}
    .kid-shape.plane{right:58px;top:64px;color:${c.yellow};font-size:96px;transform:rotate(-24deg);filter:drop-shadow(4px 5px 0 #fff)}
    .kid-shape.confetti{left:42px;top:62px;color:${c.pink};font-family:Fredoka;font-size:36px;letter-spacing:18px;text-shadow:60px 12px ${c.yellow},120px -9px ${c.green},180px 8px ${c.cyan}}
    .logo-pill{left:70px;bottom:56px}
    .counter{right:70px;bottom:76px;color:${c.ink}}
  </style>`;
  let body = "";
  if (slide.layout === "cover") {
    body = `
      <div class="photo-frame"><img class="photo" src="${photoUrl}"></div>
      <section class="paper copy"><div class="kicker">MÃOS QUE CRIAM</div><h1>${esc(slide.title)}</h1><p>${esc(slide.body)}</p><div class="drag">ARRASTE PARA O LADO ›</div></section>
      <style>
        .photo-frame{position:absolute;left:0;top:0;width:100%;height:760px;overflow:hidden;background:${c.cyan};clip-path:polygon(0 0,100% 0,100% 88%,67% 100%,0 91%)}
        .photo-frame .photo{object-position:center;filter:saturate(1.08) contrast(1.02)}
        .copy{position:absolute;left:70px;right:70px;top:650px;min-height:470px;border-radius:34px;padding:62px 58px 52px;transform:rotate(-1deg)}
        .copy .kicker{color:${c.pink};margin-bottom:22px}.copy h1{font-size:91px;max-width:820px}
        .copy p{font-size:32px;margin-top:30px;max-width:700px}.drag{margin-top:40px;color:${c.blue};font-weight:700;font-size:19px;letter-spacing:.12em}
      </style>`;
  } else if (slide.layout === "split") {
    body = `
      <div class="sky"></div><div class="photo-card"><img class="photo" src="${photoUrl}"></div>
      <section class="paper copy"><span class="num">01</span><h1>${esc(slide.title)}</h1><p>${esc(slide.body)}</p></section>
      <style>
        .sky{position:absolute;inset:0;background:linear-gradient(145deg,${c.sky},${c.blue})}
        .photo-card{position:absolute;left:80px;top:88px;width:760px;height:690px;background:${c.yellow};padding:20px;transform:rotate(-3deg);box-shadow:0 26px 55px #1739684c;overflow:hidden;border:12px solid #fff}
        .photo-card .photo{position:relative;object-position:center}
        .copy{position:absolute;right:65px;bottom:135px;width:760px;min-height:420px;padding:54px;border-radius:30px;transform:rotate(1.5deg);border:8px solid ${c.pink}}
        .num{font-family:Bubblegum,cursive;color:${c.pink};font-size:54px}.copy h1{font-size:82px;margin-top:12px}.copy p{font-size:34px;margin-top:28px;max-width:610px}
      </style>`;
  } else if (slide.layout === "polaroid") {
    body = `
      <div class="dots"></div><div class="photo-card"><img class="photo" src="${photoUrl}"></div>
      <section class="copy"><div class="kicker">CADA TRAÇO CONTA</div><h1>${esc(slide.title)}</h1><p>${esc(slide.body)}</p></section>
      <style>
        .dots{position:absolute;inset:0;background:radial-gradient(${c.cyan} 2px,transparent 3px);background-size:34px 34px;opacity:.22}
        .photo-card{position:absolute;right:58px;top:84px;width:610px;height:660px;background:${c.pink};padding:22px 22px 90px;transform:rotate(3deg);box-shadow:0 26px 50px #1e3f6c28;overflow:hidden;border:10px solid #fff}
        .photo-card .photo{position:relative;object-position:center}
        .copy{position:absolute;left:62px;bottom:170px;width:770px;background:${c.yellow};padding:58px 54px;border-radius:30px;transform:rotate(-2deg);box-shadow:12px 18px 0 ${c.cyan}}
        .copy .kicker{color:${c.blue};margin-bottom:18px}.copy h1{font-size:79px}.copy p{font-size:33px;margin-top:26px;max-width:620px}
      </style>`;
  } else if (slide.layout === "color") {
    body = `
      <div class="photo-half"><img class="photo" src="${photoUrl}"></div>
      <section class="copy"><div class="paint p1"></div><div class="paint p2"></div><div class="paint p3"></div><h1>${esc(slide.title)}</h1><p>${esc(slide.body)}</p></section>
      <style>
        .photo-half{position:absolute;left:55px;top:70px;width:970px;height:700px;border-radius:46px;overflow:hidden;background:${c.yellow};box-shadow:0 24px 54px #2248732c;border:12px solid #fff}
        .photo-half .photo{object-position:center}
        .copy{position:absolute;left:55px;right:55px;bottom:130px;height:460px;background:${c.ink};color:#fff;border-radius:42px;padding:68px 60px;overflow:hidden}
        .copy h1{font-size:74px;max-width:820px;position:relative;z-index:2}.copy p{font-size:34px;margin-top:30px;max-width:710px;position:relative;z-index:2}
        .paint{position:absolute;border-radius:50%;filter:blur(1px);opacity:.92}.p1{width:220px;height:220px;background:${c.pink};right:-40px;top:-30px}.p2{width:150px;height:150px;background:${c.yellow};right:120px;bottom:-45px}.p3{width:90px;height:90px;background:${c.cyan};right:270px;top:70px}
      </style>`;
  } else if (slide.layout === "question") {
    body = `
      <div class="photo-bg"><img class="photo" src="${photoUrl}"></div><div class="wash"></div>
      <section class="paper copy"><div class="kicker">${esc(slide.title)}</div><h1>${esc(slide.body)}</h1><div class="pencil">✎</div></section>
      <style>
        .photo-bg{position:absolute;left:45px;right:45px;top:45px;height:650px;overflow:hidden;background:${c.cyan};border-radius:48px;border:12px solid #fff}.photo-bg .photo{object-position:center}
        .wash{position:absolute;left:0;right:0;top:600px;bottom:0;background:linear-gradient(135deg,${c.ink} 0 48%,${c.blue} 48% 70%,${c.pink} 70% 82%,${c.yellow} 82%)}
        .copy{position:absolute;left:70px;right:70px;bottom:140px;min-height:500px;border-radius:40px;padding:62px 58px;border:8px solid ${c.yellow}}
        .copy .kicker{color:${c.pink};margin-bottom:30px}.copy h1{font-family:Bubblegum,Fredoka,cursive;font-size:76px;line-height:1.08;max-width:780px}
        .pencil{position:absolute;right:48px;bottom:34px;color:${c.yellow};font-size:92px;transform:rotate(-14deg)}
      </style>`;
  } else {
    body = `
      <div class="top-photo"><img class="photo" src="${photoUrl}"></div>
      <section class="copy"><div class="mini">CADA CRIAÇÃO TEM SEU CAMINHO</div><h1>${esc(slide.title)}</h1><p>${esc(slide.body)}</p></section>
      <style>
        .top-photo{position:absolute;left:0;right:0;top:0;height:620px;overflow:hidden;background:${c.cyan};clip-path:polygon(0 0,100% 0,100% 88%,0 100%)}.top-photo .photo{object-position:center}
        .copy{position:absolute;left:0;right:0;top:560px;bottom:0;background:${c.sky};color:#fff;padding:105px 72px 80px}
        .mini{font-size:19px;letter-spacing:.13em;font-weight:700;color:${c.yellow};margin-bottom:28px}.copy h1{font-size:84px;max-width:900px}.copy p{font-size:34px;margin-top:32px}
      </style>`;
  }
  const standaloneCss = standalone ? "<style>.drag,.counter{display:none!important}</style>" : "";
  return `<!doctype html><html><head><meta charset="utf-8">${base}${standaloneCss}</head><body><main class="post">${body}${aviDecor(index)}<div class="logo-pill" style="background-image:url('${logoUrl}')"></div><div class="counter">${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</div></main></body></html>`;
}

function colibriSlide(brand, slide, image, index, total, logoUrl, standalone = false) {
  const c = brand.colors;
  const photoUrl = pathToFileURL(image).href;
  const base = `
  <style>
    ${commonCss()}
    .post{background:${c.paper};color:${c.navy}}
    h1{font-family:Baloo,Nunito,sans-serif;font-weight:800}
    .logo-pill{left:66px;bottom:54px}
    .counter{right:66px;bottom:73px;color:${c.blue}}
    .col-shape{position:absolute;z-index:15;pointer-events:none}
    .col-shape.bubble{border-radius:50%;border:8px solid #fff}
    .col-shape.bubble.a{width:106px;height:106px;background:${c.gold};right:58px;top:52px}
    .col-shape.bubble.b{width:72px;height:72px;background:${c.cyan};right:170px;top:92px}
    .col-shape.zig{left:46px;top:58px;font-family:Bubblegum;font-size:100px;color:${c.orange};transform:rotate(-9deg)}
    .col-shape.rainbow{left:40px;top:52px;width:220px;height:110px;overflow:hidden}
    .col-shape.rainbow i{position:absolute;border-radius:150px 150px 0 0;border-style:solid;border-bottom:0}
    .col-shape.rainbow i:nth-child(1){inset:0;border-width:28px;border-color:${c.orange}}
    .col-shape.rainbow i:nth-child(2){inset:27px;border-width:24px;border-color:${c.gold}}
    .col-shape.rainbow i:nth-child(3){inset:51px;border-width:20px;border-color:${c.cyan}}
    .col-shape.spark{right:58px;top:55px;color:${c.gold};font-size:112px;filter:drop-shadow(5px 7px 0 #fff)}
    .col-shape.blocks{right:48px;top:52px;display:flex;gap:12px;align-items:flex-end}
    .col-shape.blocks i{display:block;width:58px;border-radius:16px;border:7px solid #fff}
    .col-shape.blocks i:nth-child(1){height:70px;background:${c.cyan}}
    .col-shape.blocks i:nth-child(2){height:112px;background:${c.gold}}
    .col-shape.blocks i:nth-child(3){height:88px;background:${c.orange}}
    .col-shape.ring{left:48px;top:58px;width:108px;height:108px;border:22px solid ${c.coral};border-radius:50%;box-shadow:0 0 0 8px #fff}
    .col-shape.burst{right:56px;top:45px;color:${c.gold};font-size:120px;filter:drop-shadow(5px 7px 0 #fff)}
    .col-shape.beadline{left:44px;top:72px;color:${c.cyan};font-family:Fredoka;font-size:38px;word-spacing:18px;text-shadow:58px 0 ${c.gold},116px 0 ${c.orange}}
    .col-shape.drops{right:44px;top:48px;display:flex;gap:14px}
    .col-shape.drops i{display:block;width:58px;height:76px;border-radius:50% 50% 55% 55%;background:${c.cyan};transform:rotate(45deg);border:6px solid #fff}
    .col-shape.drops i:nth-child(2){background:${c.gold};margin-top:30px}.col-shape.drops i:nth-child(3){background:${c.orange};margin-top:4px}
    .col-shape.wave{left:42px;top:50px;font-family:Bubblegum;font-size:126px;color:${c.cyan};transform:rotate(-7deg)}
    .col-shape.confetti{left:42px;top:68px;color:${c.orange};font-family:Fredoka;font-size:34px;letter-spacing:15px}
    .col-shape.smile{right:52px;top:35px;color:${c.gold};font-family:Bubblegum;font-size:150px;transform:rotate(-8deg)}
  </style>`;
  let body = "";
  if (slide.layout === "cover") {
    body = `
      <div class="photo-block"><img class="photo" src="${photoUrl}"></div>
      <section class="copy"><div class="kicker">CORPO EM MOVIMENTO</div><h1>${esc(slide.title)}</h1><p>${esc(slide.body)}</p><div class="drag">DESLIZE PARA CONTINUAR ›</div></section>
      <style>
        .photo-block{position:absolute;left:0;right:0;top:0;height:720px;overflow:hidden;background:linear-gradient(135deg,${c.cyan},${c.gold})}.photo-block .photo{object-position:center;filter:saturate(1.08)}
        .copy{position:absolute;left:0;right:0;top:650px;bottom:0;background:${c.blue};color:#fff;padding:86px 74px 70px;border-radius:54px 54px 0 0}
        .copy .kicker{color:${c.gold};margin-bottom:24px}.copy h1{font-size:101px;max-width:800px}.copy p{font-size:33px;margin-top:30px;max-width:760px}
        .drag{font-size:18px;font-weight:700;letter-spacing:.12em;margin-top:40px;color:${c.gold}}
      </style>`;
  } else if (slide.layout === "split") {
    body = `
      <section class="copy"><div class="tag">EXPERIMENTAR</div><h1>${esc(slide.title)}</h1><p>${esc(slide.body)}</p></section>
      <div class="photo-block"><img class="photo" src="${photoUrl}"></div>
      <style>
        .post{background:${c.gold}}
        .copy{position:absolute;left:48px;top:130px;width:500px;min-height:650px;background:${c.navy};color:#fff;padding:96px 48px 80px;border-radius:48px;box-shadow:14px 18px 0 ${c.orange}}
        .tag{display:inline-block;background:${c.orange};padding:12px 19px;border-radius:9px;font-size:18px;font-weight:700;letter-spacing:.11em;margin-bottom:34px}
        .copy h1{font-size:78px;line-height:.98}.copy p{font-size:32px;margin-top:34px}
        .photo-block{position:absolute;right:44px;top:500px;width:590px;height:690px;overflow:hidden;background:${c.cyan};border-radius:48px;border:12px solid #fff;box-shadow:0 24px 50px #14255e35}.photo-block .photo{object-position:center}
        .logo-pill{background:#fff;left:54px}.counter{color:${c.navy};right:62px}
      </style>`;
  } else if (slide.layout === "steps") {
    body = `
      <div class="photo-block"><img class="photo" src="${photoUrl}"></div>
      <section class="copy"><h1>${esc(slide.title)}</h1><p>${esc(slide.body)}</p><div class="verbs"><b>PEGAR</b><b>DESPEJAR</b><b>OBSERVAR</b></div></section>
      <style>
        .post{background:linear-gradient(150deg,${c.paper} 0 65%,${c.cyan} 65%)}
        .photo-block{position:absolute;left:55px;right:55px;top:65px;height:640px;border-radius:38px;overflow:hidden;background:${c.coral};border:12px solid #fff}.photo-block .photo{object-position:center}
        .copy{position:absolute;left:55px;right:55px;top:650px;bottom:115px;background:#fff;border:7px solid ${c.blue};border-radius:34px;padding:68px 54px}
        .copy h1{font-size:70px;max-width:860px}.copy p{font-size:32px;margin-top:25px}.verbs{display:flex;gap:14px;margin-top:46px}
        .verbs b{background:${c.gold};padding:14px 20px;border-radius:14px;font-size:18px;letter-spacing:.08em}
      </style>`;
  } else if (slide.layout === "group") {
    body = `
      <div class="photo-block"><img class="photo" src="${photoUrl}"></div>
      <section class="copy"><div class="line"></div><h1>${esc(slide.title)}</h1><p>${esc(slide.body)}</p></section>
      <style>
        .photo-block{position:absolute;left:0;top:0;width:64%;height:100%;overflow:hidden;background:linear-gradient(180deg,${c.gold},${c.coral})}.photo-block .photo{object-position:center}
        .copy{position:absolute;right:0;top:0;width:43%;height:100%;background:${c.blue};color:#fff;padding:240px 50px 150px;border-radius:60px 0 0 60px}
        .line{width:90px;height:13px;background:${c.gold};border-radius:8px;margin-bottom:35px}.copy h1{font-size:69px}.copy p{font-size:28px;margin-top:36px}
        .logo-pill{left:auto;right:58px}.counter{right:auto;left:62px;color:#fff}
      </style>`;
  } else if (slide.layout === "question") {
    body = `
      <div class="photo-strip"><img class="photo" src="${photoUrl}"></div>
      <section class="copy"><div class="kicker">${esc(slide.title)}</div><h1>${esc(slide.body)}</h1><div class="drops"><i></i><i></i><i></i></div></section>
      <style>
        .post{background:linear-gradient(135deg,${c.gold} 0 32%,${c.paper} 32% 72%,${c.cyan} 72%)}
        .photo-strip{position:absolute;left:40px;right:40px;bottom:35px;height:510px;overflow:hidden;background:${c.coral};border-radius:44px;border:11px solid #fff}.photo-strip .photo{object-position:center}
        .copy{position:absolute;left:64px;right:64px;top:190px;min-height:610px;background:#fff;border-radius:44px;padding:66px 58px;box-shadow:0 24px 55px #14255e25}
        .copy .kicker{color:${c.orange};margin-bottom:28px}.copy h1{font-size:73px;line-height:1.02;max-width:840px}
        .drops{display:flex;gap:20px;margin-top:48px}.drops i{width:62px;height:76px;border-radius:50% 50% 55% 55%;background:${c.cyan};transform:rotate(45deg)}.drops i:nth-child(2){background:${c.gold}}.drops i:nth-child(3){background:${c.orange}}
      </style>`;
  } else {
    body = `
      <div class="photo-block"><img class="photo" src="${photoUrl}"></div>
      <section class="copy"><div class="kicker">ROTINA COLIBRI</div><h1>${esc(slide.title)}</h1><p>${esc(slide.body)}</p></section>
      <style>
        .post{background:linear-gradient(145deg,${c.paper} 0 58%,${c.gold} 58% 70%,${c.cyan} 70%)}
        .photo-block{position:absolute;left:60px;right:60px;top:70px;height:580px;border-radius:45px;overflow:hidden;background:${c.coral};border:12px solid #fff}.photo-block .photo{object-position:center}
        .copy{position:absolute;left:60px;right:60px;top:590px;bottom:125px;background:${c.navy};color:#fff;border-radius:42px;padding:78px 60px}
        .copy .kicker{color:${c.gold};margin-bottom:30px}.copy h1{font-size:72px;max-width:860px}.copy p{font-size:34px;margin-top:34px;color:${c.gold}}
      </style>`;
  }
  const standaloneCss = standalone ? "<style>.drag,.counter{display:none!important}</style>" : "";
  return `<!doctype html><html><head><meta charset="utf-8">${base}${standaloneCss}</head><body><main class="post">${body}${colibriDecor(index)}<div class="logo-pill" style="background-image:url('${logoUrl}')"></div><div class="counter">${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</div></main></body></html>`;
}

function aviStatic(brand, image, logoUrl) {
  const c = brand.colors;
  const photoUrl = pathToFileURL(image).href;
  const piece = brand.static;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    ${commonCss()}
    .post{background:linear-gradient(145deg,${c.paper} 0 45%,${c.yellow} 45% 58%,${c.cyan} 58% 82%,${c.pink} 82%);color:${c.ink}}
    h1{font-family:Fredoka,Nunito,sans-serif}
    .hero{position:absolute;left:46px;right:46px;top:500px;height:760px;overflow:hidden;background:${c.sky};border:13px solid #fff;border-radius:52px;box-shadow:0 26px 60px #243b702f}.hero .photo{object-position:center}
    .copy{position:absolute;left:66px;right:140px;top:68px;min-height:470px;background:${c.paper};border-radius:40px;padding:58px 50px 48px;box-shadow:14px 18px 0 ${c.green};z-index:8}
    .copy .kicker{color:${c.pink};margin-bottom:22px}.copy h1{font-size:76px;max-width:800px}.copy p{font-size:30px;margin-top:24px}
    .logo-pill{left:66px;bottom:54px}
    .rainbow{position:absolute;right:-50px;top:44px;width:260px;height:145px;border-radius:180px 180px 0 0;border:30px solid ${c.pink};border-bottom:0;z-index:10}
    .rainbow:before{content:"";position:absolute;inset:24px;border-radius:150px 150px 0 0;border:27px solid ${c.yellow};border-bottom:0}
    .rainbow:after{content:"";position:absolute;inset:49px;border-radius:120px 120px 0 0;border:24px solid ${c.cyan};border-bottom:0}
    .stars{position:absolute;z-index:12;right:55px;top:255px;color:${c.yellow};font-size:68px;letter-spacing:18px;transform:rotate(8deg);text-shadow:80px 18px ${c.green}}
  </style></head><body><main class="post"><div class="hero"><img class="photo" src="${photoUrl}"></div><section class="copy"><div class="kicker">PEQUENAS DESCOBERTAS</div><h1>${esc(piece.title)}</h1><p>${esc(piece.body)}</p></section><div class="rainbow"></div><div class="stars">★ ★</div><div class="logo-pill" style="background-image:url('${logoUrl}')"></div></main></body></html>`;
}

function colibriStatic(brand, image, logoUrl) {
  const c = brand.colors;
  const photoUrl = pathToFileURL(image).href;
  const piece = brand.static;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    ${commonCss()}
    .post{background:linear-gradient(135deg,${c.gold} 0 22%,${c.paper} 22% 66%,${c.cyan} 66% 78%,${c.orange} 78%);color:${c.navy}}
    h1{font-family:Baloo,Nunito,sans-serif;font-weight:800}
    .hero{position:absolute;left:48px;right:48px;top:54px;height:760px;overflow:hidden;background:${c.coral};border:13px solid #fff;border-radius:52px;box-shadow:0 26px 60px #14255e2e}.hero .photo{object-position:center}
    .copy{position:absolute;left:44px;right:44px;top:748px;bottom:40px;background:${c.blue};color:#fff;border-radius:54px;padding:88px 66px 70px;box-shadow:0 18px 0 ${c.gold}}
    .tag{display:inline-block;background:${c.orange};padding:12px 18px;border-radius:10px;font-size:19px;font-weight:700;letter-spacing:.11em;margin-bottom:28px}
    .copy h1{font-size:82px;max-width:900px}.copy p{font-size:31px;margin-top:28px;color:${c.paper}}
    .logo-pill{left:auto;right:66px;bottom:56px}
    .bubbles{position:absolute;z-index:12;right:52px;top:46px;display:flex;gap:14px;align-items:flex-end}.bubbles i{display:block;border-radius:50%;border:7px solid #fff}.bubbles i:nth-child(1){width:78px;height:78px;background:${c.cyan}}.bubbles i:nth-child(2){width:112px;height:112px;background:${c.gold}}.bubbles i:nth-child(3){width:66px;height:66px;background:${c.orange}}
    .scribble{position:absolute;z-index:13;left:55px;top:50px;font-family:Bubblegum;font-size:92px;color:${c.orange};transform:rotate(-9deg)}
  </style></head><body><main class="post"><div class="hero"><img class="photo" src="${photoUrl}"></div><div class="bubbles"><i></i><i></i><i></i></div><div class="scribble">〰</div><section class="copy"><div class="tag">CONQUISTA DO DIA</div><h1>${esc(piece.title)}</h1><p>${esc(piece.body)}</p></section><div class="logo-pill" style="background-image:url('${logoUrl}')"></div></main></body></html>`;
}

async function writeCopy(brand, piece, directory, type) {
  const slides =
    type === "carousel"
      ? `\n## Textos das telas\n\n${piece.slides.map((s, i) => `### Tela ${i + 1}\n\n**${s.title}**\n\n${s.body}`).join("\n\n")}\n`
      : `\n## Texto da arte\n\n**${piece.title}**\n\n${piece.body}\n`;
  const content = `# ${brand.name} | ${type === "carousel" ? "Carrossel" : "Estático"}\n${slides}\n## Legenda\n\n${piece.caption}\n`;
  await fs.writeFile(path.join(directory, "copy.md"), content, "utf8");
}

async function inlineLocalImages(html) {
  const urls = [...new Set([...html.matchAll(/src="(file:[^"]+)"/g)].map((match) => match[1]))];
  const backgroundUrls = [
    ...new Set([...html.matchAll(/url\(['"]?(file:[^'")]+)['"]?\)/g)].map((match) => match[1])),
  ];
  let result = html;

  for (const url of [...new Set([...urls, ...backgroundUrls])]) {
    const filePath = fileURLToPath(url);
    const extension = path.extname(filePath).toLowerCase();
    const mime =
      extension === ".png"
        ? "image/png"
        : extension === ".webp"
          ? "image/webp"
          : "image/jpeg";
    const buffer = await fs.readFile(filePath);
    const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;
    result = result.split(url).join(dataUrl);
  }

  return result.replaceAll("<img ", '<img loading="eager" decoding="sync" ');
}

async function renderHtml(html, target, sequence) {
  const htmlDir = path.join(OUT, "_html");
  await fs.mkdir(htmlDir, { recursive: true });
  const htmlPath = path.join(htmlDir, `render-${String(sequence).padStart(2, "0")}.html`);
  const selfContainedHtml = await inlineLocalImages(html);
  await fs.writeFile(htmlPath, selfContainedHtml, "utf8");
  await execFileAsync(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--allow-file-access-from-files",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=2500",
    "--force-device-scale-factor=1",
    "--window-size=1080,1350",
    `--screenshot=${target}`,
    pathToFileURL(htmlPath).href,
  ]);
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const allOutputs = [];
  const manifest = {};
  let renderSequence = 0;

  for (const [brandKey, brand] of Object.entries(CONTENT)) {
    const photos = await listImages(brand.photoDir);
    const logoPath = await prepareLogo(brandKey, brand);
    const logoUrl = pathToFileURL(logoPath).href;
    const brandRoot = path.join(OUT, brand.name);
    const carouselRoot = path.join(brandRoot, brand.carousel.slug);
    const carouselPng = path.join(carouselRoot, "png");
    const staticRoot = path.join(brandRoot, brand.static.slug);
    await fs.mkdir(carouselPng, { recursive: true });
    await fs.mkdir(staticRoot, { recursive: true });

    for (let i = 0; i < brand.carousel.slides.length; i++) {
      const slide = brand.carousel.slides[i];
      const image = photos[brand.carousel.photoIndices[i]];
      const html =
        brandKey === "aviaozinho"
          ? aviSlide(brand, slide, image, i, brand.carousel.slides.length, logoUrl)
          : colibriSlide(brand, slide, image, i, brand.carousel.slides.length, logoUrl);
      const target = path.join(carouselPng, `slide-${String(i + 1).padStart(2, "0")}.png`);
      await renderHtml(html, target, ++renderSequence);
      allOutputs.push(target);
    }
    await writeCopy(brand, brand.carousel, carouselRoot, "carousel");

    const staticImage = photos[brand.static.photoIndex];
    const staticHtml =
      brandKey === "aviaozinho"
        ? aviStatic(brand, staticImage, logoUrl)
        : colibriStatic(brand, staticImage, logoUrl);
    const staticTarget = path.join(staticRoot, "post-estatico.png");
    await renderHtml(staticHtml, staticTarget, ++renderSequence);
    allOutputs.push(staticTarget);
    await writeCopy(brand, brand.static, staticRoot, "static");

    manifest[brandKey] = {
      carousel: {
        slug: brand.carousel.slug,
        photos: brand.carousel.photoIndices.map((index) => photos[index]),
        slides: brand.carousel.slides,
      },
      static: {
        slug: brand.static.slug,
        photo: staticImage,
        title: brand.static.title,
        body: brand.static.body,
      },
    };
  }
  await fs.writeFile(path.join(OUT, "conteudo-usado.json"), JSON.stringify(manifest, null, 2), "utf8");
  console.log(JSON.stringify({ output: OUT, files: allOutputs.length }, null, 2));
}

function projectPath(value) {
  if (!value) return null;
  return path.isAbsolute(value) ? value : path.resolve(ROOT, value);
}

function normalizeSchool(value) {
  const normalized = String(value || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  if (normalized.includes("aviao")) return "aviaozinho";
  if (normalized.includes("colibri")) return "colibri";
  throw new Error(`Escola inválida: ${value}. Use "aviaozinho" ou "colibri".`);
}

function assertJob(job, brandKey) {
  const format = String(job.format || "").toLowerCase();
  if (!["carousel", "carrossel", "static", "estatico"].includes(format)) {
    throw new Error('Formato inválido. Use "carousel" ou "static".');
  }
  if (job.safe_photo_reviewed !== true) {
    throw new Error("O job precisa declarar safe_photo_reviewed=true após a revisão humana das pessoas.");
  }
  if (!job.title && format.startsWith("stat")) {
    throw new Error("O post estático precisa de title.");
  }
  if ((format === "carousel" || format === "carrossel") && (!Array.isArray(job.slides) || job.slides.length < 2)) {
    throw new Error("O carrossel precisa de pelo menos 2 slides.");
  }
  const allowed =
    brandKey === "aviaozinho"
      ? ["cover", "split", "polaroid", "color", "question", "cta"]
      : ["cover", "split", "steps", "group", "question", "cta"];
  for (const slide of job.slides || []) {
    if (!allowed.includes(slide.layout)) {
      throw new Error(`Layout "${slide.layout}" inválido para ${brandKey}. Permitidos: ${allowed.join(", ")}.`);
    }
    if (!slide.title) throw new Error("Todo slide precisa de title.");
  }
}

async function assertPhotos(photoPaths, expectedCount) {
  if (photoPaths.length < expectedCount) {
    throw new Error(`Fotos insuficientes. Recebidas: ${photoPaths.length}. Necessárias: ${expectedCount}.`);
  }
  for (const photo of photoPaths) {
    if (!/\.(jpe?g|png|webp)$/i.test(photo)) throw new Error(`Formato de foto inválido: ${photo}`);
    await fs.access(photo);
  }
}

async function buildJob(jobFile) {
  const resolvedJobFile = projectPath(jobFile);
  const job = JSON.parse(await fs.readFile(resolvedJobFile, "utf8"));
  const brandKey = normalizeSchool(job.school);
  const baseBrand = CONTENT[brandKey];
  const format = ["carousel", "carrossel"].includes(String(job.format).toLowerCase()) ? "carousel" : "static";
  assertJob(job, brandKey);

  const defaultFolder = `${new Date().toISOString().slice(0, 10)}-${job.slug || format}`;
  OUT = projectPath(job.output || path.join("outputs", baseBrand.name, defaultFolder));
  await fs.mkdir(OUT, { recursive: true });

  const logoPath = await prepareLogo(brandKey, baseBrand);
  const logoUrl = pathToFileURL(logoPath).href;
  const suppliedPhotos = (job.photos || (job.photo ? [job.photo] : [])).map(projectPath);
  const expectedPhotos = format === "carousel" ? job.slides.length : 1;
  await assertPhotos(suppliedPhotos, expectedPhotos);

  const runtimeBrand = {
    ...baseBrand,
    static: {
      title: job.title,
      body: job.body || "",
      caption: job.caption || "",
    },
  };
  const rendered = [];

  if (format === "carousel") {
    const pngDir = path.join(OUT, "png");
    await fs.mkdir(pngDir, { recursive: true });
    for (let i = 0; i < job.slides.length; i++) {
      const slide = job.slides[i];
      const html =
        brandKey === "aviaozinho"
          ? aviSlide(runtimeBrand, slide, suppliedPhotos[i], i, job.slides.length, logoUrl)
          : colibriSlide(runtimeBrand, slide, suppliedPhotos[i], i, job.slides.length, logoUrl);
      const target = path.join(pngDir, `slide-${String(i + 1).padStart(2, "0")}.png`);
      await renderHtml(html, target, i + 1);
      rendered.push(target);
    }
    await writeCopy(
      runtimeBrand,
      { slides: job.slides, caption: job.caption || "" },
      OUT,
      "carousel",
    );
  } else {
    const standaloneSlide = {
      title: job.title,
      body: job.body || "",
      layout: job.layout || "cover",
    };
    let html;
    if (job.layout === "poster") {
      html =
        brandKey === "aviaozinho"
          ? aviStatic(runtimeBrand, suppliedPhotos[0], logoUrl)
          : colibriStatic(runtimeBrand, suppliedPhotos[0], logoUrl);
    } else {
      html =
        brandKey === "aviaozinho"
          ? aviSlide(runtimeBrand, standaloneSlide, suppliedPhotos[0], 0, 1, logoUrl, true)
          : colibriSlide(runtimeBrand, standaloneSlide, suppliedPhotos[0], 0, 1, logoUrl, true);
    }
    const target = path.join(OUT, "post-estatico.png");
    await renderHtml(html, target, 1);
    rendered.push(target);
    await writeCopy(runtimeBrand, runtimeBrand.static, OUT, "static");
  }

  const manifest = {
    generator_version: "2.0.0",
    created_at: new Date().toISOString(),
    school: brandKey,
    format,
    slug: job.slug || defaultFolder,
    safe_photo_reviewed: true,
    photos: suppliedPhotos,
    files: rendered,
    source_job: resolvedJobFile,
  };
  await fs.writeFile(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  console.log(JSON.stringify({ output: OUT, files: rendered.length, manifest }, null, 2));
}

function printHelp() {
  console.log(`Uso:
  node tools/build_test_posts.mjs --job caminho/para/job.json
  node tools/build_test_posts.mjs --demo

O modo --job gera uma publicação arbitrária. O modo --demo reconstrói a safra de referência.`);
}

const args = process.argv.slice(2);
const jobIndex = args.indexOf("--job");
if (jobIndex >= 0) {
  if (!args[jobIndex + 1]) throw new Error("Informe o caminho do job após --job.");
  await buildJob(args[jobIndex + 1]);
} else if (args.includes("--help") || args.includes("-h")) {
  printHelp();
} else {
  await main();
}
