from __future__ import annotations

import json
import shutil
from pathlib import Path

from PIL import Image
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "raw" / "imagens-base-manual-de-marca"
TMP = ROOT / "tmp" / "brand-analysis"
OUT = ROOT / "manuais-de-marca"

W, H = A4
M = 44

FONT_REGULAR = ROOT / "assets" / "fonts" / "Nunito-600.ttf"
FONT_BOLD = ROOT / "assets" / "fonts" / "Nunito-800.ttf"
FONT_HAND = ROOT / "assets" / "fonts" / "BubblegumSans-400.ttf"
FONT_HAND_BOLD = ROOT / "assets" / "fonts" / "BubblegumSans-400.ttf"


BRANDS = {
    "aviaozinho": {
        "folder": "Aviãozinho de Papel",
        "title": "Aviãozinho de Papel",
        "subtitle": "Manual operacional de marca para Instagram",
        "version": "Versão 1.3 | 23 de julho de 2026",
        "logo_source": ROOT / "assets" / "logos" / "aviaozinho.png",
        "feed_source": RAW
        / "Aviãozinho de Papel"
        / "prints-instagram"
        / "Captura de tela 2026-07-23 165509.png",
        "feed_crop": (245, 0, 1658, 910),
        "photos_source": RAW / "Aviãozinho de Papel" / "fotos-criancas",
        "photo_sample_indices": [3, 5, 7, 14],
        "photo_count": 17,
        "colors": [
            ("Azul céu", "#3472B9", "base e fundos"),
            ("Azul nuvem", "#5E93CD", "áreas leves"),
            ("Índigo", "#2D2F91", "texto e contraste"),
            ("Amarelo avião", "#FFD025", "accent principal"),
            ("Ciano", "#60C6F0", "doodles e apoio"),
            ("Papel", "#FFFDF7", "respiro"),
            ("Magenta", "#D03588", "accent pontual"),
            ("Verde", "#68B93E", "accent pontual"),
        ],
        "ink": "#24235F",
        "paper": "#FFFDF7",
        "primary": "#3472B9",
        "accent": "#FFD025",
        "secondary": "#D03588",
        "essence": "Aprender é uma aventura que começa com curiosidade, afeto e liberdade para imaginar.",
        "axis": "Eixo criativo: cada descoberta ganha asas.",
        "promise": "Transformar o cotidiano escolar em experiências acolhedoras, curiosas e memoráveis.",
        "audience": "Famílias e responsáveis que procuram uma escola infantil próxima, alegre e atenta ao desenvolvimento integral da criança.",
        "personality": ["imaginativa", "afetiva", "alegre", "próxima", "espontânea"],
        "diagnosis": [
            "O avião de papel, a nuvem e a rota pontilhada formam um território proprietário e fácil de reconhecer.",
            "O feed já usa fotografias reais, recortes, papelaria, doodles e cores vivas. Esses códigos devem virar sistema.",
            "A maior oportunidade é reduzir a mistura de estilos e dar hierarquia: uma cor dominante, um herói e poucos enfeites por peça.",
        ],
        "logo_rules": [
            "Versão preferencial: marca completa sobre branco, papel ou azul céu com bom contraste.",
            "Área de proteção: mantenha ao redor da marca um espaço equivalente à altura da letra A do nome.",
            "Tamanho mínimo recomendado no feed 1080 px: 160 px de largura para a marca completa.",
            "Use o símbolo reduzido somente quando extraído do arquivo original. Não redesenhe avião, nuvem ou rota.",
        ],
        "logo_donts": [
            "Não esticar, inclinar ou aplicar sombra adicional.",
            "Não trocar as cores do avião, da nuvem ou do lettering.",
            "Não colocar sobre foto movimentada sem placa clara de proteção.",
            "Não competir com mais de três enfeites perto da marca.",
        ],
        "type": {
            "display": "Fredoka Bold ou Baloo 2 ExtraBold",
            "body": "Nunito Regular, SemiBold e ExtraBold",
            "accent": "Bubblegum Sans ou Patrick Hand",
            "rules": [
                "Headlines curtas, arredondadas e com variação de tamanho.",
                "Corpo sempre simples e muito legível. Evite fontes infantis em parágrafos.",
                "Fonte manuscrita serve para uma palavra, seta ou bilhete. Nunca para texto longo.",
                "A tipografia do logotipo é exclusiva da marca e não deve ser imitada em títulos.",
            ],
        },
        "photo": [
            "Portão absoluto: nenhuma cabeça de criança pode ser cortada, coberta ou encostada na borda.",
            "Rejeite na seleção qualquer arquivo em que a cabeça da criança já esteja cortada na foto original.",
            "Use object-fit contain como padrão. Cover só é permitido após ajuste manual e revisão pessoa por pessoa.",
            "Regra firme: todo post, carrossel ou reel inclui pelo menos uma foto real das crianças.",
            "Priorize cenas reais de atividade, vínculo, descoberta e expressão.",
            "Use uma foto herói por peça. Grafismos nunca cobrem rosto, mãos ou ação principal.",
            "Use apenas imagens autorizadas. Não use crianças geradas por IA.",
        ],
        "motifs": [
            "avião de papel e rota pontilhada",
            "nuvens, estrelas e arco de céu",
            "papel rasgado, caderno, fita e polaroide",
            "lápis, giz, rabiscos e desenhos infantis",
        ],
        "layout": [
            "Composição de colagem leve, com movimento diagonal de baixo para cima.",
            "Use de 3 a 5 cores da paleta por peça. Azul céu e índigo mantêm a unidade; amarelo, magenta, ciano e verde trazem energia infantil.",
            "Alterne entre arco-íris, nuvens, estrelas, rabiscos, formas de papel e manchas orgânicas. Não repita a mesma combinação em telas consecutivas.",
            "Fotos podem receber borda branca, fita ou recorte orgânico. Evite molduras rígidas demais.",
        ],
        "voice_core": "Conversa de escola para família: calorosa, curiosa, simples e verdadeira.",
        "voice_traits": [
            ("Afetiva", "acolhe sem exagerar no diminutivo"),
            ("Lúdica", "usa imagem e imaginação sem infantilizar o adulto"),
            ("Próxima", "fala de cenas reais do dia a dia"),
            ("Positiva", "celebra processo, descoberta e vínculo"),
        ],
        "voice_rules": [
            "Abra com uma cena, pergunta curiosa ou pequena descoberta.",
            "Use frases curtas e verbos concretos: brincar, descobrir, criar, explorar, cuidar.",
            "Explique o valor da atividade sem prometer resultados pedagógicos não comprovados.",
            "Fale com famílias como parceiras. Evite tom professoral e linguagem clínica.",
            "Emojis são pontuais: avião, estrela, coração, lápis. Máximo de três por legenda.",
        ],
        "prefer": [
            "descoberta",
            "imaginação",
            "curiosidade",
            "vínculo",
            "brincar",
            "criar",
            "explorar",
            "voar",
            "família",
            "acolhimento",
        ],
        "avoid": [
            "estimulação garantida",
            "gênio",
            "melhor escola",
            "perfeito",
            "resultado garantido",
            "mini adulto",
            "linguagem excessivamente técnica",
        ],
        "pillars": [
            ("Descobertas do dia", "atividades e aprendizados em cenas concretas"),
            ("Imaginação em movimento", "arte, histórias, faz de conta e criação"),
            ("Laços que acolhem", "vínculos, adaptação, convivência e pertencimento"),
            ("Família a bordo", "orientações simples e participação da família"),
            ("Bastidores da escola", "equipe, rotina, espaços e preparação"),
            ("Convites para voar", "matrículas, visitas, eventos e chamadas institucionais"),
        ],
        "headlines": [
            "Hoje a curiosidade levantou voo.",
            "Brincar também é descobrir.",
            "Uma tarde. Mil mundos inventados.",
            "Pequenas mãos, grandes criações.",
            "O que seu filho descobre quando brinca?",
            "Aqui, cada ideia encontra espaço para voar.",
        ],
        "ctas": ["Venha conhecer de perto", "Converse com a nossa equipe", "Salve para fazer em casa"],
        "caption": (
            "Hoje a sala virou ateliê, laboratório e pista de decolagem. Entre tintas, texturas e muita "
            "curiosidade, cada criança encontrou seu próprio jeito de explorar. O resultado mais bonito "
            "não cabe só no papel: está nas perguntas, nas tentativas e na alegria de descobrir junto. "
            "Quer conhecer de perto o cotidiano do Aviãozinho? Converse com a nossa equipe."
        ),
        "carousel": [
            "1. Capa: gancho de 3 a 8 palavras e uma imagem herói.",
            "2. Cena: o que aconteceu, sem texto genérico.",
            "3. Descoberta: o que a atividade convidou a criança a explorar.",
            "4. Processo: materiais, escolhas e interação.",
            "5. Ponte com a família: uma pergunta ou ideia simples para casa.",
            "6. Fechamento: frase memorável e um único CTA.",
        ],
        "dont_mix": "Não usar blocos corporativos rígidos, grandes áreas de azul-marinho ou laranja como assinatura. O território desta marca é céu, papel, imaginação e afeto.",
    },
    "colibri": {
        "folder": "Colibri",
        "title": "Colibri",
        "subtitle": "Manual operacional de marca para Instagram",
        "version": "Versão 1.3 | 23 de julho de 2026",
        "logo_source": ROOT / "assets" / "logos" / "colibri.png",
        "feed_source": RAW
        / "Colibri"
        / "prints-insta"
        / "Captura de tela 2026-07-23 170111.png",
        "feed_crop": (245, 120, 1658, 1030),
        "photos_source": RAW / "Colibri" / "fotos-de-crianças",
        "photo_sample_indices": [1, 6, 11, 23],
        "photo_count": 32,
        "colors": [
            ("Azul Colibri", "#283D9B", "base e autoridade"),
            ("Laranja vivo", "#F0391E", "accent da marca"),
            ("Azul noite", "#14255E", "texto e fundos"),
            ("Dourado", "#F6A90A", "energia e CTA"),
            ("Creme", "#FFF7E8", "respiro"),
            ("Branco", "#FFFFFF", "contraste"),
            ("Turquesa", "#20BFD0", "apoio pontual"),
            ("Coral", "#E85F66", "campanhas pontuais"),
        ],
        "ink": "#14255E",
        "paper": "#FFF7E8",
        "primary": "#283D9B",
        "accent": "#F0391E",
        "secondary": "#F6A90A",
        "essence": "Cuidado que dá segurança para cada criança explorar, aprender e ganhar autonomia.",
        "axis": "Eixo criativo: cuidado em movimento, desenvolvimento em foco.",
        "promise": "Mostrar um desenvolvimento infantil ativo, intencional e cercado de afeto.",
        "audience": "Famílias e responsáveis que valorizam cuidado, rotina, aprendizagem e clareza sobre o propósito de cada experiência.",
        "personality": ["confiável", "enérgica", "acolhedora", "educativa", "otimista"],
        "diagnosis": [
            "O pássaro, o azul profundo e o laranja criam uma assinatura institucional forte.",
            "O feed combina atividades reais com cards de leitura rápida, áreas de cor e títulos de alta energia.",
            "A maior oportunidade é organizar as cores secundárias e manter o azul Colibri como fio condutor do grid.",
        ],
        "logo_rules": [
            "Versão preferencial: marca azul e laranja sobre branco ou creme.",
            "Em fundos azuis, use a versão branca proveniente do arquivo original.",
            "Área de proteção: mantenha ao redor da marca um espaço equivalente à altura da letra C.",
            "Tamanho mínimo recomendado no feed 1080 px: 150 px de largura para a marca completa.",
        ],
        "logo_donts": [
            "Não separar o pássaro da gota para criar um símbolo novo.",
            "Não trocar azul e laranja por cores de campanha.",
            "Não aplicar contorno, bevel, brilho ou sombra.",
            "Não colocar a assinatura pequena sobre fotografia com pouco contraste.",
        ],
        "type": {
            "display": "Baloo 2 ExtraBold ou Fredoka Bold",
            "body": "Nunito Regular, SemiBold e ExtraBold",
            "accent": "Bubblegum Sans ou Patrick Hand",
            "rules": [
                "Headlines fortes, compactas e com uma ideia por bloco.",
                "Use caixa alta apenas em 1 ou 2 linhas. Não transforme a arte inteira em grito.",
                "Corpo com entrelinha generosa e largura curta.",
                "Fonte manuscrita aparece como anotação ou palavra afetiva, não como base do sistema.",
            ],
        },
        "photo": [
            "Portão absoluto: nenhuma cabeça de criança pode ser cortada, coberta ou encostada na borda.",
            "Rejeite na seleção qualquer arquivo em que a cabeça da criança já esteja cortada na foto original.",
            "Use object-fit contain como padrão. Cover só é permitido após ajuste manual e revisão pessoa por pessoa.",
            "Regra firme: todo post, carrossel ou reel inclui pelo menos uma foto real das crianças.",
            "Mostre a atividade em andamento, com material e objetivo visualmente claros.",
            "Alterne planos individuais e de grupo para comunicar autonomia e convivência.",
            "Em atividades com água, destaque experiência e interação, nunca exposição corporal.",
            "Use apenas imagens autorizadas. Não use crianças geradas por IA.",
        ],
        "motifs": [
            "pássaro em voo, asa e rastro de movimento",
            "gota, pétala e formas arredondadas",
            "peças de quebra-cabeça e módulos de construção",
            "blocos de cor, ondas e cantos orgânicos",
        ],
        "layout": [
            "Composição modular e enérgica, com blocos grandes e hierarquia clara.",
            "Use de 3 a 5 cores da paleta por peça. Azul profundo garante unidade; laranja, dourado, turquesa e coral criam energia infantil.",
            "Alterne entre bolhas, ondas, gotas, blocos, confetes e arcos. Não repita a mesma combinação em telas consecutivas.",
            "O logotipo pode fechar o post em barra ou canto de alto contraste.",
        ],
        "voice_core": "Escola que acolhe e explica: calor humano com clareza sobre desenvolvimento.",
        "voice_traits": [
            ("Clara", "explica o propósito sem jargão pedagógico"),
            ("Confiante", "mostra método sem superlativos"),
            ("Ativa", "valoriza ação, tentativa e autonomia"),
            ("Acolhedora", "fala com a família sem distância institucional"),
        ],
        "voice_rules": [
            "Abra com um benefício observável ou uma pergunta que os pais reconheçam.",
            "Mostre a relação entre atividade e experiência, sem transformar toda legenda em aula.",
            "Use verbos ativos: experimentar, construir, desenvolver, compartilhar, cuidar.",
            "Evite promessas de desempenho, diagnóstico ou comparação entre crianças.",
            "Só use referências religiosas após confirmar o posicionamento institucional da escola.",
            "Emojis são discretos: pássaro, coração, livro, bloco. Máximo de dois por legenda.",
        ],
        "prefer": [
            "autonomia",
            "descoberta",
            "desenvolvimento",
            "cuidado",
            "segurança",
            "convivência",
            "experiência",
            "aprender",
            "construir",
            "crescer",
        ],
        "avoid": [
            "criança à frente",
            "resultado superior",
            "estimulação garantida",
            "melhor método",
            "performance infantil",
            "aluno perfeito",
            "ganhar asas",
            "mundo mágico",
            "linguagem clínica sem contexto",
        ],
        "pillars": [
            ("Desenvolvimento em ação", "o propósito por trás de atividades reais"),
            ("Aprender fazendo", "arte, leitura, corpo, música e investigação"),
            ("Cuidado que dá confiança", "acolhimento, rotina e segurança emocional"),
            ("Convivência e autonomia", "cooperação, escolhas e pequenas conquistas"),
            ("Família bem informada", "orientações práticas e ponte casa-escola"),
            ("Quem faz o Colibri", "equipe, espaços, eventos, matrículas e visitas"),
        ],
        "headlines": [
            "Brincar é aprender em movimento.",
            "Pequenas escolhas constroem autonomia.",
            "O que existe por trás desta brincadeira?",
            "Cuidar também é dar espaço para tentar.",
            "Cada conquista merece ser vista.",
            "Uma rotina segura abre espaço para explorar.",
        ],
        "ctas": ["Agende uma visita", "Converse com o Colibri", "Salve esta ideia"],
        "caption": (
            "Hoje a brincadeira pediu equilíbrio, atenção e muitas tentativas. Cada criança encontrou seu "
            "ritmo, observou os colegas e comemorou pequenas conquistas. No Colibri, a atividade ganha "
            "sentido quando une movimento, convivência e autonomia. Quer conhecer a nossa rotina de perto? "
            "Agende uma visita e converse com a equipe."
        ),
        "carousel": [
            "1. Capa: benefício observável ou pergunta direta.",
            "2. Cena: foto da experiência em andamento.",
            "3. Intenção: o que a atividade convida a praticar.",
            "4. Sinais: três comportamentos que a família consegue reconhecer.",
            "5. Ponte com casa: orientação simples, sem receita rígida.",
            "6. Fechamento: síntese confiante e um único CTA.",
        ],
        "dont_mix": "Não usar avião de papel, nuvens, metáforas de voo, polaroides em excesso ou colagem de caderno como assinatura. O território desta marca é movimento, desenvolvimento, blocos de cor e clareza.",
    },
}


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("Space", str(FONT_REGULAR)))
    pdfmetrics.registerFont(TTFont("SpaceBold", str(FONT_BOLD)))
    pdfmetrics.registerFont(TTFont("Hand", str(FONT_HAND)))
    pdfmetrics.registerFont(TTFont("HandBold", str(FONT_HAND_BOLD)))


def crop_reference(brand: dict, assets_dir: Path) -> Path:
    target = assets_dir / "referencia-feed.jpg"
    with Image.open(brand["feed_source"]) as im:
        crop = im.crop(brand["feed_crop"]).convert("RGB")
        crop.thumbnail((1600, 1000))
        crop.save(target, quality=92)
    return target


def build_photo_reference(brand: dict, assets_dir: Path) -> Path:
    target = assets_dir / "referencia-fotos-reais.jpg"
    files = sorted(
        p
        for p in brand["photos_source"].rglob("*")
        if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
    )
    selected = [files[i] for i in brand["photo_sample_indices"] if i < len(files)]
    board = Image.new("RGB", (1200, 760), (255, 255, 255))
    positions = [(20, 20), (610, 20), (20, 390), (610, 390)]
    for path, (x, y) in zip(selected, positions):
        with Image.open(path) as source:
            image = source.convert("RGB")
            scale = max(570 / image.width, 350 / image.height)
            resized = image.resize(
                (round(image.width * scale), round(image.height * scale)),
                Image.Resampling.LANCZOS,
            )
            left = max(0, (resized.width - 570) // 2)
            top = max(0, (resized.height - 350) // 2)
            crop = resized.crop((left, top, left + 570, top + 350))
            board.paste(crop, (x, y))
    board.save(target, quality=92)
    return target


def setup_assets(brand: dict, brand_dir: Path) -> tuple[Path, Path, Path]:
    assets = brand_dir / "assets"
    assets.mkdir(parents=True, exist_ok=True)
    logo = assets / "logo.png"
    shutil.copy2(brand["logo_source"], logo)
    feed = crop_reference(brand, assets)
    photos = build_photo_reference(brand, assets)
    return logo, feed, photos


def pstyle(
    name: str,
    font: str,
    size: float,
    color: str,
    leading: float | None = None,
    align=TA_LEFT,
) -> ParagraphStyle:
    return ParagraphStyle(
        name,
        fontName=font,
        fontSize=size,
        leading=leading or size * 1.25,
        textColor=HexColor(color),
        alignment=align,
        spaceAfter=0,
        spaceBefore=0,
    )


def para(
    c: canvas.Canvas,
    text: str,
    x: float,
    y_top: float,
    width: float,
    style: ParagraphStyle,
    max_height: float = 500,
) -> float:
    p = Paragraph(text, style)
    _, h = p.wrap(width, max_height)
    p.drawOn(c, x, y_top - h)
    return h


def fit_image(c: canvas.Canvas, path: Path, x: float, y: float, w: float, h: float) -> None:
    with Image.open(path) as im:
        iw, ih = im.size
    scale = min(w / iw, h / ih)
    rw, rh = iw * scale, ih * scale
    c.drawImage(
        ImageReader(str(path)),
        x + (w - rw) / 2,
        y + (h - rh) / 2,
        width=rw,
        height=rh,
        mask="auto",
    )


def page_bg(c: canvas.Canvas, brand: dict, page_no: int) -> None:
    c.setFillColor(HexColor(brand["paper"]))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(HexColor(brand["primary"]))
    if brand["title"].startswith("Avi"):
        c.circle(W - 18, H - 30, 72, fill=1, stroke=0)
        c.setFillColor(HexColor(brand["accent"]))
        c.circle(W - 58, H - 18, 13, fill=1, stroke=0)
        c.setStrokeColor(HexColor("#60C6F0"))
        c.setLineWidth(2)
        c.setDash(5, 4)
        c.arc(W - 132, H - 100, W + 10, H + 20, 205, 135)
        c.setDash()
    else:
        c.roundRect(W - 108, H - 76, 132, 56, 18, fill=1, stroke=0)
        c.setFillColor(HexColor(brand["secondary"]))
        c.circle(W - 96, H - 28, 20, fill=1, stroke=0)
    c.setFillColor(HexColor(brand["ink"]))
    c.setFont("Space", 8)
    c.drawString(M, 24, f"{brand['title']} | Manual de marca")
    c.drawRightString(W - M, 24, f"{page_no:02d}")


def page_title(c: canvas.Canvas, brand: dict, number: str, title: str, kicker: str) -> float:
    c.setFillColor(HexColor(brand["secondary"]))
    c.setFont("SpaceBold", 9)
    c.drawString(M, H - 54, number)
    c.setFillColor(HexColor(brand["ink"]))
    c.setFont("SpaceBold", 26)
    c.drawString(M, H - 86, title)
    para(c, kicker, M, H - 102, W - 2 * M - 80, pstyle("kick", "Space", 9.5, brand["primary"], 13))
    return H - 132


def card(
    c: canvas.Canvas,
    x: float,
    y: float,
    w: float,
    h: float,
    fill: str,
    radius: float = 14,
    stroke: str | None = None,
) -> None:
    c.setFillColor(HexColor(fill))
    if stroke:
        c.setStrokeColor(HexColor(stroke))
        c.setLineWidth(0.8)
    else:
        c.setStrokeColor(Color(0, 0, 0, alpha=0))
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1 if stroke else 0)


def bullet_block(
    c: canvas.Canvas,
    items: list[str],
    x: float,
    y_top: float,
    width: float,
    brand: dict,
    size: float = 10,
    gap: float = 11,
) -> float:
    y = y_top
    style = pstyle("bullet", "Space", size, brand["ink"], size * 1.34)
    for item in items:
        c.setFillColor(HexColor(brand["accent"]))
        c.circle(x + 4, y - 6, 3.4, fill=1, stroke=0)
        h = para(c, item, x + 16, y, width - 16, style, 110)
        y -= h + gap
    return y


def cover(c: canvas.Canvas, brand: dict, logo: Path) -> None:
    c.setFillColor(HexColor(brand["paper"]))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(HexColor(brand["primary"]))
    if brand["title"].startswith("Avi"):
        c.circle(W - 40, H - 72, 158, fill=1, stroke=0)
        c.setFillColor(HexColor(brand["accent"]))
        c.setStrokeColor(HexColor(brand["accent"]))
        c.setLineWidth(4)
        c.line(80, 164, W - 88, H - 128)
        c.line(W - 88, H - 128, W - 208, H - 122)
        c.line(W - 88, H - 128, W - 156, H - 224)
    else:
        c.roundRect(W - 160, H - 170, 220, 125, 34, fill=1, stroke=0)
        c.setFillColor(HexColor(brand["secondary"]))
        c.circle(70, H - 120, 74, fill=1, stroke=0)
        c.setFillColor(HexColor(brand["accent"]))
        c.circle(W - 85, 98, 110, fill=1, stroke=0)
    card(c, M, H - 360, W - 2 * M, 188, "#FFFFFF", 22)
    fit_image(c, logo, M + 24, H - 332, W - 2 * M - 48, 128)
    c.setFillColor(HexColor(brand["secondary"]))
    c.setFont("SpaceBold", 10)
    c.drawString(M, 134, "IDENTIDADE VISUAL + VOZ + SISTEMA DE CONTEÚDO")
    c.setFillColor(HexColor(brand["ink"]))
    c.setFont("SpaceBold", 25)
    c.drawString(M, 98, "Manual operacional")
    c.setFont("Space", 12)
    c.drawString(M, 76, "para produção de Instagram")
    c.setFont("Space", 8)
    c.drawRightString(W - M, 38, brand["version"])
    c.showPage()


def visual_diagnosis(c: canvas.Canvas, brand: dict, feed: Path) -> None:
    page_bg(c, brand, 2)
    y = page_title(
        c,
        brand,
        "01",
        "Diagnóstico visual",
        "O que o material existente já comunica e o que precisa virar regra.",
    )
    card(c, M, 388, W - 2 * M, 230, "#FFFFFF", 16)
    fit_image(c, feed, M + 10, 398, W - 2 * M - 20, 210)
    y = 366
    for i, text in enumerate(brand["diagnosis"], 1):
        card(c, M, y - 76, W - 2 * M, 64, "#FFFFFF", 12)
        c.setFillColor(HexColor(brand["secondary"]))
        c.setFont("SpaceBold", 16)
        c.drawString(M + 16, y - 38, f"{i:02d}")
        para(c, text, M + 54, y - 17, W - 2 * M - 70, pstyle(f"d{i}", "Space", 9.6, brand["ink"], 13), 60)
        y -= 78
    c.showPage()


def essence_page(c: canvas.Canvas, brand: dict) -> None:
    page_bg(c, brand, 3)
    y = page_title(c, brand, "02", "Essência da marca", "A base para decidir o que parece ou não parece com a escola.")
    card(c, M, y - 132, W - 2 * M, 118, brand["primary"], 18)
    para(
        c,
        f"<b>{brand['essence']}</b>",
        M + 22,
        y - 34,
        W - 2 * M - 44,
        pstyle("ess", "SpaceBold", 18, "#FFFFFF", 23),
        90,
    )
    c.setFillColor(HexColor(brand["accent"]))
    c.setFont("HandBold", 12)
    c.drawString(M + 22, y - 105, brand["axis"])
    y -= 160
    half = (W - 2 * M - 14) / 2
    for x, title, text in [
        (M, "Promessa percebida", brand["promise"]),
        (M + half + 14, "Para quem falamos", brand["audience"]),
    ]:
        card(c, x, y - 132, half, 132, "#FFFFFF", 14)
        c.setFillColor(HexColor(brand["secondary"]))
        c.setFont("SpaceBold", 10)
        c.drawString(x + 16, y - 24, title.upper())
        para(c, text, x + 16, y - 44, half - 32, pstyle(title, "Space", 10, brand["ink"], 14), 78)
    y -= 165
    c.setFillColor(HexColor(brand["ink"]))
    c.setFont("SpaceBold", 14)
    c.drawString(M, y, "Personalidade")
    x = M
    for word in brand["personality"]:
        width = pdfmetrics.stringWidth(word.upper(), "SpaceBold", 9) + 26
        card(c, x, y - 42, width, 28, brand["accent"], 14)
        c.setFillColor(HexColor(brand["ink"]))
        c.setFont("SpaceBold", 9)
        c.drawCentredString(x + width / 2, y - 33, word.upper())
        x += width + 8
    card(c, M, 72, W - 2 * M, 88, "#FFFFFF", 14)
    para(
        c,
        "<b>Regra central:</b> todo post precisa parecer uma extensão da experiência escolar. "
        "A estética chama atenção, mas a cena real, o cuidado e a clareza sustentam confiança.",
        M + 18,
        140,
        W - 2 * M - 36,
        pstyle("rule", "Space", 10.5, brand["ink"], 15),
        65,
    )
    c.showPage()


def logo_page(c: canvas.Canvas, brand: dict, logo: Path) -> None:
    page_bg(c, brand, 4)
    y = page_title(c, brand, "03", "Logotipo", "Preservar reconhecimento vale mais do que adaptar a marca a cada post.")
    card(c, M, 430, W - 2 * M, 210, "#FFFFFF", 16)
    fit_image(c, logo, M + 30, 450, W - 2 * M - 60, 170)
    half = (W - 2 * M - 16) / 2
    card(c, M, 168, half, 236, "#FFFFFF", 14)
    card(c, M + half + 16, 168, half, 236, "#FFFFFF", 14)
    c.setFillColor(HexColor(brand["primary"]))
    c.setFont("SpaceBold", 11)
    c.drawString(M + 16, 380, "USO CORRETO")
    bullet_block(c, brand["logo_rules"], M + 16, 355, half - 32, brand, 8.8, 8)
    c.setFillColor(HexColor(brand["secondary"]))
    c.setFont("SpaceBold", 11)
    c.drawString(M + half + 32, 380, "NÃO FAZER")
    bullet_block(c, brand["logo_donts"], M + half + 32, 355, half - 32, brand, 8.8, 8)
    card(c, M, 70, W - 2 * M, 72, brand["primary"], 14)
    para(
        c,
        "Arquivo-mestre: use sempre o PDF fornecido. PNG serve para redes sociais, mas novas versões "
        "e recortes devem nascer do vetor original.",
        M + 18,
        124,
        W - 2 * M - 36,
        pstyle("master", "Space", 9.5, "#FFFFFF", 13),
        50,
    )
    c.showPage()


def colors_page(c: canvas.Canvas, brand: dict) -> None:
    page_bg(c, brand, 5)
    page_title(c, brand, "04", "Sistema de cores", "A paleta nasce do logotipo e ganha papéis claros na produção.")
    cols = 2
    sw = (W - 2 * M - 14) / cols
    sh = 86
    start_y = 640
    for i, (name, value, role) in enumerate(brand["colors"]):
        col = i % cols
        row = i // cols
        x = M + col * (sw + 14)
        y = start_y - row * (sh + 10)
        card(c, x, y - sh, sw, sh, "#FFFFFF", 12)
        c.setFillColor(HexColor(value))
        c.roundRect(x + 10, y - sh + 10, 62, sh - 20, 10, fill=1, stroke=0)
        c.setFillColor(HexColor(brand["ink"]))
        c.setFont("SpaceBold", 10)
        c.drawString(x + 84, y - 28, name)
        c.setFont("Space", 8.5)
        c.drawString(x + 84, y - 46, value.upper())
        c.setFillColor(HexColor(brand["primary"]))
        c.drawString(x + 84, y - 64, role)
    card(c, M, 120, W - 2 * M, 104, "#FFFFFF", 14)
    para(
        c,
        "<b>Proporção recomendada:</b> 40% fundo ou respiro, 35% cores-base e 25% accents infantis. "
        "Cada peça usa de 3 a 5 cores da paleta, sempre com contraste para leitura.",
        M + 18,
        200,
        W - 2 * M - 36,
        pstyle("ratio", "Space", 10.5, brand["ink"], 15),
        48,
    )
    para(
        c,
        "<b>Acessibilidade:</b> texto pequeno deve usar azul escuro ou índigo sobre fundo claro. "
        "Amarelo, laranja e ciano funcionam melhor como preenchimento, destaque e decoração.",
        M + 18,
        158,
        W - 2 * M - 36,
        pstyle("a11y", "Space", 9.2, brand["ink"], 13),
        38,
    )
    c.showPage()


def typography_page(c: canvas.Canvas, brand: dict) -> None:
    page_bg(c, brand, 6)
    y = page_title(c, brand, "05", "Tipografia", "Um sistema simples: presença na capa, clareza no corpo e afeto no detalhe.")
    card(c, M, y - 132, W - 2 * M, 118, brand["primary"], 16)
    c.setFillColor(white)
    c.setFont("SpaceBold", 31)
    display_word = "APRENDER" if brand["title"].startswith("Avi") else "DESENVOLVER"
    accent_line = (
        "começa pela curiosidade"
        if brand["title"].startswith("Avi")
        else "acontece em movimento"
    )
    c.drawString(M + 20, y - 55, display_word)
    c.setFillColor(HexColor(brand["accent"]))
    c.setFont("HandBold", 19)
    c.drawString(M + 236, y - 86, accent_line)
    y -= 160
    rows = [
        ("DISPLAY", brand["type"]["display"], "Capas, números, chamadas e frases-âncora."),
        ("CORPO", brand["type"]["body"], "Legendas internas, cards e informação prática."),
        ("ACENTO", brand["type"]["accent"], "Bilhetes, setas, palavras afetivas e pequenos detalhes."),
    ]
    for label, font_name, use in rows:
        card(c, M, y - 78, W - 2 * M, 68, "#FFFFFF", 12)
        c.setFillColor(HexColor(brand["secondary"]))
        c.setFont("SpaceBold", 9)
        c.drawString(M + 16, y - 30, label)
        c.setFillColor(HexColor(brand["ink"]))
        c.setFont("SpaceBold", 12)
        c.drawString(M + 98, y - 28, font_name)
        para(c, use, M + 98, y - 42, W - M - (M + 98) - 16, pstyle(label, "Space", 8.8, brand["primary"], 12), 28)
        y -= 84
    c.setFillColor(HexColor(brand["ink"]))
    c.setFont("SpaceBold", 12)
    c.drawString(M, 210, "Regras de hierarquia")
    bullet_block(c, brand["type"]["rules"], M, 188, W - 2 * M, brand, 9.2, 7)
    c.showPage()


def visual_language_page(c: canvas.Canvas, brand: dict, photos: Path) -> None:
    page_bg(c, brand, 7)
    page_title(c, brand, "06", "Linguagem visual", "Fotografia real primeiro. Elementos gráficos entram para organizar e dar assinatura.")
    half = (W - 2 * M - 16) / 2
    card(c, M, 390, half, 246, "#FFFFFF", 14)
    fit_image(c, photos, M + 10, 400, half - 20, 226)
    card(c, M + half + 16, 390, half, 246, "#FFFFFF", 14)
    c.setFillColor(HexColor(brand["primary"]))
    c.setFont("SpaceBold", 11)
    c.drawString(M + half + 32, 610, "FOTOGRAFIA")
    bullet_block(c, brand["photo"], M + half + 32, 584, half - 32, brand, 8.2, 5)
    c.setFillColor(HexColor(brand["ink"]))
    c.setFont("SpaceBold", 12)
    c.drawString(M, 356, "Motivos gráficos da marca")
    y = 328
    for i, motif in enumerate(brand["motifs"], 1):
        card(c, M, y - 48, W - 2 * M, 40, "#FFFFFF", 11)
        c.setFillColor(HexColor(brand["accent"] if i % 2 else brand["secondary"]))
        c.circle(M + 22, y - 28, 8, fill=1, stroke=0)
        para(c, motif, M + 42, y - 17, W - 2 * M - 58, pstyle(f"m{i}", "Space", 9.7, brand["ink"], 13), 30)
        y -= 54
    card(c, M, 74, W - 2 * M, 58, brand["primary"], 12)
    para(
        c,
        "<b>A criança real é o elemento herói.</b> A atividade, a headline e os grafismos organizam a "
        "leitura sem disputar atenção com o rosto, as mãos ou a ação.",
        M + 16,
        118,
        W - 2 * M - 32,
        pstyle("hero", "Space", 9.6, "#FFFFFF", 13),
        42,
    )
    c.showPage()


def composition_page(c: canvas.Canvas, brand: dict) -> None:
    page_bg(c, brand, 8)
    page_title(c, brand, "07", "Composição e formatos", "Variedade de layout com os mesmos códigos de reconhecimento.")
    half = (W - 2 * M - 16) / 2
    card(c, M, 410, half, 230, "#FFFFFF", 14)
    c.setFillColor(HexColor(brand["primary"]))
    c.roundRect(M + 24, 438, 148, 176, 12, fill=1, stroke=0)
    c.setFillColor(HexColor(brand["paper"]))
    c.roundRect(M + 38, 526, 120, 66, 9, fill=1, stroke=0)
    c.setFillColor(HexColor(brand["accent"]))
    c.circle(M + 150, 448, 22, fill=1, stroke=0)
    c.setFillColor(HexColor(brand["ink"]))
    c.setFont("SpaceBold", 9)
    c.drawCentredString(M + half / 2, 420, "POST 1080 x 1350")
    card(c, M + half + 16, 410, half, 230, "#FFFFFF", 14)
    x2 = M + half + 40
    c.setFillColor(HexColor(brand["primary"]))
    c.roundRect(x2, 428, 106, 194, 12, fill=1, stroke=0)
    c.setFillColor(HexColor(brand["paper"]))
    c.roundRect(x2 + 12, 500, 82, 78, 8, fill=1, stroke=0)
    c.setFillColor(HexColor(brand["secondary"]))
    c.roundRect(x2 + 12, 458, 64, 24, 8, fill=1, stroke=0)
    c.setFillColor(HexColor(brand["ink"]))
    c.setFont("SpaceBold", 9)
    c.drawCentredString(M + half + 16 + half / 2, 420, "STORY / REEL 1080 x 1920")
    y = 382
    bullet_block(c, brand["layout"], M, y, W - 2 * M, brand, 9.5, 9)
    card(c, M, 126, W - 2 * M, 96, "#FFFFFF", 14)
    para(
        c,
        "<b>Zonas seguras:</b> no feed, mantenha textos a 80 px das laterais e a 100 px do topo e do "
        "rodapé. Em reels, deixe 80 px nas laterais, 250 px no topo e 350 px no rodapé.",
        M + 18,
        202,
        W - 2 * M - 36,
        pstyle("safe", "Space", 9.4, brand["ink"], 13),
        50,
    )
    para(
        c,
        "<b>Capa:</b> 3 a 8 palavras. <b>Subheadline:</b> até 16 palavras. <b>Slides internos:</b> uma ideia "
        "por tela. <b>Legenda:</b> em geral, 80 a 150 palavras.",
        M + 18,
        158,
        W - 2 * M - 36,
        pstyle("copylimits", "Space", 9.1, brand["primary"], 12),
        32,
    )
    c.showPage()


def voice_page(c: canvas.Canvas, brand: dict) -> None:
    page_bg(c, brand, 9)
    y = page_title(c, brand, "08", "Tom de voz", brand["voice_core"])
    trait_w = (W - 2 * M - 12) / 2
    for i, (name, desc) in enumerate(brand["voice_traits"]):
        x = M + (i % 2) * (trait_w + 12)
        row = i // 2
        yy = y - row * 84
        card(c, x, yy - 70, trait_w, 66, "#FFFFFF", 12)
        c.setFillColor(HexColor(brand["secondary"]))
        c.setFont("SpaceBold", 10)
        c.drawString(x + 14, yy - 24, name.upper())
        para(c, desc, x + 14, yy - 36, trait_w - 28, pstyle(name, "Space", 8.8, brand["ink"], 12), 28)
    y -= 184
    card(c, M, 268, W - 2 * M, 214, "#FFFFFF", 14)
    c.setFillColor(HexColor(brand["primary"]))
    c.setFont("SpaceBold", 11)
    c.drawString(M + 16, 456, "REGRAS DE ESCRITA")
    bullet_block(c, brand["voice_rules"], M + 16, 431, W - 2 * M - 32, brand, 9.0, 7)
    half = (W - 2 * M - 14) / 2
    card(c, M, 82, half, 158, brand["primary"], 14)
    card(c, M + half + 14, 82, half, 158, "#FFFFFF", 14)
    c.setFillColor(white)
    c.setFont("SpaceBold", 10)
    c.drawString(M + 16, 216, "PREFERIR")
    para(
        c,
        " · ".join(brand["prefer"]),
        M + 16,
        194,
        half - 32,
        pstyle("prefer", "Space", 9.2, "#FFFFFF", 13),
        98,
    )
    c.setFillColor(HexColor(brand["secondary"]))
    c.setFont("SpaceBold", 10)
    c.drawString(M + half + 30, 216, "EVITAR")
    para(
        c,
        " · ".join(brand["avoid"]),
        M + half + 30,
        194,
        half - 32,
        pstyle("avoid", "Space", 9.2, brand["ink"], 13),
        98,
    )
    c.showPage()


def pillars_page(c: canvas.Canvas, brand: dict) -> None:
    page_bg(c, brand, 10)
    page_title(c, brand, "09", "Pilares editoriais", "Seis territórios para dar variedade sem perder a identidade.")
    col_w = (W - 2 * M - 14) / 2
    start_y = 636
    for i, (title, desc) in enumerate(brand["pillars"], 1):
        x = M + ((i - 1) % 2) * (col_w + 14)
        row = (i - 1) // 2
        y = start_y - row * 146
        card(c, x, y - 128, col_w, 118, "#FFFFFF", 14)
        c.setFillColor(HexColor(brand["accent"] if i % 2 else brand["secondary"]))
        c.circle(x + 24, y - 34, 13, fill=1, stroke=0)
        c.setFillColor(HexColor(brand["ink"]))
        c.setFont("SpaceBold", 10)
        c.drawCentredString(x + 24, y - 38, str(i))
        c.setFont("SpaceBold", 11)
        c.drawString(x + 48, y - 38, title)
        para(c, desc, x + 18, y - 60, col_w - 36, pstyle(f"p{i}", "Space", 9.1, brand["ink"], 13), 52)
    card(c, M, 116, W - 2 * M, 72, brand["primary"], 14)
    para(
        c,
        "<b>Ritmo mensal sugerido:</b> 40% cotidiano real, 20% educação para famílias, 15% bastidores e "
        "equipe, 15% institucional e 10% datas ou campanhas. Ajuste conforme calendário e autorização de imagem.",
        M + 18,
        170,
        W - 2 * M - 36,
        pstyle("rhythm", "Space", 9.2, "#FFFFFF", 13),
        48,
    )
    c.showPage()


def toolkit_page(c: canvas.Canvas, brand: dict) -> None:
    page_bg(c, brand, 11)
    page_title(c, brand, "10", "Kit de conteúdo", "Modelos verbais e estrutura de carrossel para acelerar produção.")
    half = (W - 2 * M - 16) / 2
    card(c, M, 388, half, 252, "#FFFFFF", 14)
    c.setFillColor(HexColor(brand["primary"]))
    c.setFont("SpaceBold", 11)
    c.drawString(M + 16, 614, "HEADLINES MODELO")
    y = 590
    for hline in brand["headlines"]:
        c.setFillColor(HexColor(brand["accent"]))
        c.circle(M + 20, y - 6, 3, fill=1, stroke=0)
        used = para(c, hline, M + 34, y, half - 50, pstyle(hline, "SpaceBold", 9.1, brand["ink"], 12), 34)
        y -= used + 10
    card(c, M + half + 16, 388, half, 252, "#FFFFFF", 14)
    c.setFillColor(HexColor(brand["secondary"]))
    c.setFont("SpaceBold", 11)
    c.drawString(M + half + 32, 614, "CARROSSEL EM 6 TELAS")
    bullet_block(c, brand["carousel"], M + half + 32, 590, half - 32, brand, 8.6, 6)
    card(c, M, 198, W - 2 * M, 164, brand["primary"], 14)
    c.setFillColor(white)
    c.setFont("SpaceBold", 10)
    c.drawString(M + 16, 338, "LEGENDA DE EXEMPLO")
    para(
        c,
        brand["caption"],
        M + 16,
        316,
        W - 2 * M - 32,
        pstyle("caption", "Space", 9.4, "#FFFFFF", 13.5),
        102,
    )
    c.setFillColor(HexColor(brand["ink"]))
    c.setFont("SpaceBold", 10)
    c.drawString(M, 166, "CTAs")
    x = M
    for cta in brand["ctas"]:
        width = pdfmetrics.stringWidth(cta, "SpaceBold", 8.8) + 24
        card(c, x, 122, width, 28, brand["accent"], 14)
        c.setFillColor(HexColor(brand["ink"]))
        c.setFont("SpaceBold", 8.8)
        c.drawCentredString(x + width / 2, 131, cta)
        x += width + 8
    c.showPage()


def checklist_page(c: canvas.Canvas, brand: dict) -> None:
    page_bg(c, brand, 12)
    page_title(c, brand, "11", "Checklist de produção", "O portão final antes de aprovar qualquer postagem.")
    checks = [
        "A peça tem uma única ideia principal?",
        "Há pelo menos uma foto real das crianças nesta peça?",
        "A foto ou o elemento herói aparece antes dos enfeites?",
        "As cores seguem a proporção e os papéis do manual?",
        "O texto está legível no celular e dentro da zona segura?",
        "O logotipo veio do arquivo original e tem proteção?",
        "A legenda mostra uma cena real e evita promessas sem prova?",
        "Há autorização de imagem e nenhuma informação sensível da criança?",
        "Existe um único CTA e ele combina com o objetivo do post?",
        "A peça parece claramente desta escola, não da outra?",
    ]
    y = 646
    for i, check in enumerate(checks):
        fill = "#FFFFFF" if i % 2 == 0 else brand["paper"]
        card(c, M, y - 43, W - 2 * M, 37, fill, 10, "#E8E5DE")
        c.setStrokeColor(HexColor(brand["primary"]))
        c.setLineWidth(1.4)
        c.rect(M + 14, y - 31, 13, 13, fill=0, stroke=1)
        para(c, check, M + 40, y - 14, W - 2 * M - 54, pstyle(f"check{i}", "Space", 8.8, brand["ink"], 11.5), 24)
        y -= 45
    card(c, M, 112, W - 2 * M, 78, brand["primary"], 14)
    para(
        c,
        f"<b>Não misturar:</b> {brand['dont_mix']}",
        M + 16,
        170,
        W - 2 * M - 32,
        pstyle("mix", "Space", 9.3, "#FFFFFF", 13),
        52,
    )
    para(
        c,
        "Status: autorização de uso das imagens e informações pedagógicas e institucionais confirmadas "
        "pelo Sr. Davi em 23/07/2026. Manual aprovado para produção.",
        M,
        90,
        W - 2 * M,
        pstyle("note", "Space", 7.8, brand["primary"], 10.5, TA_CENTER),
        42,
    )
    c.showPage()


def build_pdf(brand: dict, brand_dir: Path, logo: Path, feed: Path, photos: Path) -> Path:
    pdf_path = brand_dir / f"MANUAL-DE-MARCA-{brand['folder'].replace(' ', '-')}.pdf"
    c = canvas.Canvas(str(pdf_path), pagesize=A4)
    c.setTitle(f"Manual de Marca - {brand['title']}")
    c.setAuthor("Orna | Sistema de Produção Criativa")
    cover(c, brand, logo)
    visual_diagnosis(c, brand, feed)
    essence_page(c, brand)
    logo_page(c, brand, logo)
    colors_page(c, brand)
    typography_page(c, brand)
    visual_language_page(c, brand, photos)
    composition_page(c, brand)
    voice_page(c, brand)
    pillars_page(c, brand)
    toolkit_page(c, brand)
    checklist_page(c, brand)
    c.save()
    return pdf_path


def build_tokens(brand: dict, brand_dir: Path) -> Path:
    tokens = {
        "brand": brand["title"],
        "version": "1.3",
        "status": "approved-for-production",
        "approvals": {
            "confirmed_by": "Sr. Davi",
            "confirmed_at": "2026-07-23",
            "image_use_authorized": True,
            "pedagogical_and_institutional_information_validated": True,
        },
        "colors": {
            name.lower().replace(" ", "_"): {"hex": value, "role": role}
            for name, value, role in brand["colors"]
        },
        "typography": brand["type"],
        "formats": {
            "feed": {"width": 1080, "height": 1350, "safe_x": 80, "safe_y": 100},
            "story_reel": {
                "width": 1080,
                "height": 1920,
                "safe_x": 80,
                "safe_top": 250,
                "safe_bottom": 350,
            },
        },
        "photography": {
            "real_children_required": True,
            "minimum_photos_per_piece": 1,
            "source_folder": str(brand["photos_source"]),
            "available_photos_at_version": brand["photo_count"],
            "generated_children_allowed": False,
            "child_head_crop_allowed": False,
            "source_with_preexisting_head_crop_allowed": False,
            "default_fit": "contain",
            "review": "person-by-person at 100% size",
            "selection_rules": brand["photo"],
        },
        "voice": {
            "core": brand["voice_core"],
            "traits": [name for name, _ in brand["voice_traits"]],
            "prefer": brand["prefer"],
            "avoid": brand["avoid"],
        },
        "editorial_pillars": [{"name": x, "purpose": y} for x, y in brand["pillars"]],
        "carousel_structure": brand["carousel"],
        "content_limits": {
            "cover_words": "3-8",
            "subheadline_words": "até 16",
            "caption_words": "80-150",
            "hero_elements_per_piece": 1,
        },
    }
    path = brand_dir / "brand-tokens.json"
    path.write_text(json.dumps(tokens, ensure_ascii=False, indent=2), encoding="utf-8")
    return path


def build_markdown(brand: dict, brand_dir: Path) -> Path:
    lines: list[str] = [
        f"# Manual de Marca - {brand['title']}",
        "",
        f"> {brand['subtitle']}  ",
        f"> {brand['version']}",
        "",
        "## Status e método",
        "",
        "Manual operacional inferido a partir do logotipo, das capturas do Instagram e do acervo fotográfico fornecido. "
        "Autorização de uso das imagens e informações pedagógicas e institucionais confirmadas pelo Sr. Davi "
        "em 23/07/2026. Status: aprovado para produção.",
        "",
        "## Essência",
        "",
        f"**Ideia central:** {brand['essence']}",
        "",
        f"**{brand['axis']}**",
        "",
        f"**Promessa percebida:** {brand['promise']}",
        "",
        f"**Público:** {brand['audience']}",
        "",
        f"**Personalidade:** {', '.join(brand['personality'])}.",
        "",
        "## Diagnóstico visual",
        "",
    ]
    lines += [f"- {item}" for item in brand["diagnosis"]]
    lines += ["", "## Logotipo", "", "### Uso correto", ""]
    lines += [f"- {item}" for item in brand["logo_rules"]]
    lines += ["", "### Não fazer", ""]
    lines += [f"- {item}" for item in brand["logo_donts"]]
    lines += ["", "## Cores", "", "| Cor | HEX | Papel |", "|---|---|---|"]
    lines += [f"| {name} | `{value}` | {role} |" for name, value, role in brand["colors"]]
    lines += [
        "",
        "**Proporção:** 40% fundo ou respiro, 35% cores-base e 25% accents infantis. Use de 3 a 5 cores da paleta por peça.",
        "",
        "## Tipografia",
        "",
        f"- Display: {brand['type']['display']}",
        f"- Corpo: {brand['type']['body']}",
        f"- Acento: {brand['type']['accent']}",
        "",
    ]
    lines += [f"- {item}" for item in brand["type"]["rules"]]
    lines += ["", "## Fotografia", ""]
    lines += [
        "**Regra firme:** toda peça de feed, carrossel ou reel deve incluir pelo menos uma foto real das crianças.",
        "",
        f"**Acervo disponível nesta versão:** {brand['photo_count']} fotos.",
        "",
    ]
    lines += [f"- {item}" for item in brand["photo"]]
    lines += ["", "## Motivos gráficos", ""]
    lines += [f"- {item}" for item in brand["motifs"]]
    lines += ["", "## Composição", ""]
    lines += [f"- {item}" for item in brand["layout"]]
    lines += [
        "",
        "## Formatos",
        "",
        "- Feed: 1080 x 1350 px. Área segura de 80 px nas laterais e 100 px no topo e rodapé.",
        "- Stories e reels: 1080 x 1920 px. Área segura de 80 px nas laterais, 250 px no topo e 350 px no rodapé.",
        "- Capa: 3 a 8 palavras. Subheadline: até 16 palavras. Legenda: em geral, 80 a 150 palavras.",
        "",
        "## Tom de voz",
        "",
        brand["voice_core"],
        "",
    ]
    lines += [f"- **{name}:** {desc}" for name, desc in brand["voice_traits"]]
    lines += ["", "### Regras de escrita", ""]
    lines += [f"- {item}" for item in brand["voice_rules"]]
    lines += [
        "",
        f"**Preferir:** {', '.join(brand['prefer'])}.",
        "",
        f"**Evitar:** {', '.join(brand['avoid'])}.",
        "",
        "## Pilares editoriais",
        "",
    ]
    lines += [f"- **{title}:** {desc}." for title, desc in brand["pillars"]]
    lines += ["", "## Headlines modelo", ""]
    lines += [f"- {item}" for item in brand["headlines"]]
    lines += ["", "## Estrutura de carrossel", ""]
    lines += [f"- {item}" for item in brand["carousel"]]
    lines += [
        "",
        "## CTAs",
        "",
        *[f"- {item}" for item in brand["ctas"]],
        "",
        "## Legenda de exemplo",
        "",
        brand["caption"],
        "",
        "## Checklist de aprovação",
        "",
        "- [ ] Uma única ideia principal.",
        "- [ ] Pelo menos uma foto real das crianças.",
        "- [ ] Todas as pessoas foram revisadas individualmente em tamanho real.",
        "- [ ] Nenhuma cabeça de criança está cortada, coberta ou encostada na borda.",
        "- [ ] A foto original também preserva a cabeça inteira.",
        "- [ ] Um elemento herói antes dos enfeites.",
        "- [ ] Cores e tipografia dentro do sistema.",
        "- [ ] A composição usa de 3 a 5 cores e não repete o mesmo conjunto de motivos da tela anterior.",
        "- [ ] Texto legível no celular e dentro da zona segura.",
        "- [ ] Logotipo vindo do arquivo original.",
        "- [ ] Legenda baseada em cena real e sem promessas sem prova.",
        "- [ ] Autorização de imagem e nenhuma informação sensível da criança.",
        "- [ ] Um único CTA.",
        "- [ ] A peça parece claramente desta escola.",
        "",
        "## Fronteira com a outra escola",
        "",
        brand["dont_mix"],
        "",
    ]
    path = brand_dir / f"MANUAL-DE-MARCA-{brand['folder'].replace(' ', '-')}.md"
    path.write_text("\n".join(lines), encoding="utf-8")
    return path


def main() -> None:
    register_fonts()
    OUT.mkdir(parents=True, exist_ok=True)
    results = []
    for brand in BRANDS.values():
        brand_dir = OUT / brand["folder"]
        brand_dir.mkdir(parents=True, exist_ok=True)
        logo, feed, photos = setup_assets(brand, brand_dir)
        pdf = build_pdf(brand, brand_dir, logo, feed, photos)
        md = build_markdown(brand, brand_dir)
        tokens = build_tokens(brand, brand_dir)
        results.append({"brand": brand["title"], "pdf": str(pdf), "markdown": str(md), "tokens": str(tokens)})
    print(json.dumps(results, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
