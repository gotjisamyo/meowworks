from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, subprocess

root = Path(__file__).resolve().parents[1]
out_dir = root / 'public' / 'media'
frames_dir = out_dir / 'meowchat-demo-frames'
out_dir.mkdir(parents=True, exist_ok=True)
frames_dir.mkdir(parents=True, exist_ok=True)
for p in frames_dir.glob('frame_*.png'):
    p.unlink()

W, H = 1280, 720
FPS = 15
DURATION = 12
TOTAL = FPS * DURATION

font_regular = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font_bold = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

def font(size, bold=False):
    return ImageFont.truetype(font_bold if bold else font_regular, size)

bg = '#FFFDF9'
navy = '#0F172A'
slate = '#334155'
soft = '#64748B'
green = '#16A34A'
green_deep = '#15803D'
green_soft = '#DCFCE7'
coral = '#F9735B'
apricot = '#FDBA74'
white = '#FFFFFF'
panel = '#F8FAFC'
mist = '#E2E8F0'
dark_bg = '#101827'

headline_font = font(46, True)
body_font = font(22)
body_bold = font(22, True)
small_font = font(18)
label_font = font(16, True)
cta_font = font(20, True)
logo_font = font(24, True)
chat_font = font(20)

scenes = [
    {
        'title': 'LINE OA ตอบไวขึ้น',
        'subtitle': 'ตอบลูกค้าได้เร็วขึ้น แม้ไม่มีแอดมินเฝ้าตลอด',
        'tag': 'INTRO',
        'chips': ['ตอบแชตอัตโนมัติ', 'ไม่พลาดลูกค้านอกเวลา', 'คัดเคสพร้อมซื้อ'],
        'user': 'ขอเช็กราคาโปรวันนี้ได้ไหมคะ',
        'bot': 'ได้เลยค่ะ วันนี้มีโปรแพ็กเกจเริ่มต้น พร้อมสรุปรายละเอียดและเก็บข้อมูลส่งต่อให้ทีมได้ทันที',
        'result': 'ลูกค้าได้คำตอบเร็วขึ้น โดยร้านไม่ต้องรีบเพิ่มแอดมิน',
        'accent': green,
    },
    {
        'title': 'ตอบราคา / โปรโมชัน',
        'subtitle': 'ตอบคำถามซ้ำ ๆ ได้ทันที พร้อมสรุปเงื่อนไขให้ลูกค้าเข้าใจง่าย',
        'tag': 'USE CASE 01',
        'chips': ['ราคา', 'โปรโมชัน', 'เงื่อนไข'],
        'user': 'แพ็กโปรวันนี้เหลือถึงวันไหนคะ',
        'bot': 'โปรนี้ยังใช้ได้ถึงวันอาทิตย์ค่ะ หากต้องการล็อกสิทธิ์ไว้ แอนนาช่วยเก็บชื่อและเบอร์ให้ทีมติดต่อกลับได้เลย',
        'result': 'ลดเวลาตอบคำถามราคา และคัดลูกค้าพร้อมซื้อส่งต่อทีมต่อได้ทันที',
        'accent': coral,
    },
    {
        'title': 'จองคิว / รับออเดอร์',
        'subtitle': 'เก็บข้อมูลสำคัญก่อนส่งต่อ เพื่อให้ทีมทำงานต่อได้เร็วและครบ',
        'tag': 'USE CASE 02',
        'chips': ['จองคิว', 'รับออเดอร์', 'เก็บข้อมูล'],
        'user': 'พรุ่งนี้ยังมีคิวช่วงบ่ายไหมคะ',
        'bot': 'มีคิวว่าง 14:00 และ 16:30 ค่ะ แจ้งชื่อและเบอร์ไว้ได้เลย แล้วระบบจะสรุปส่งให้ทีมหน้าร้านทันที',
        'result': 'ช่วยเก็บ lead และข้อมูลก่อนส่งต่อ ทำให้ตอบงานหน้างานต่อได้ไวขึ้น',
        'accent': green_deep,
    },
    {
        'title': 'ส่งต่อแอดมินเมื่อเคสซับซ้อน',
        'subtitle': 'AI ช่วยคัดกรองคำถามพื้นฐาน แล้วส่งต่อเฉพาะจังหวะที่คนจริงควรเข้ามาปิดการขาย',
        'tag': 'USE CASE 03',
        'chips': ['handoff', 'พร้อมซื้อ', 'เจ้าของร้าน'],
        'user': 'อยากสั่งหลายสาขาและขอใบเสนอราคาได้ไหม',
        'bot': 'ได้เลยค่ะ เคสนี้ต้องให้ทีมช่วยจัดแพ็กและออกใบเสนอราคาให้ แอนนาสรุปรายละเอียดไว้แล้ว พร้อมส่งต่อแอดมินทันที',
        'result': 'ไม่ปล่อยลูกค้าซับซ้อนค้างไว้ และทีมเข้ามาปิดการขายต่อได้ตรงจังหวะ',
        'accent': apricot,
    },
]


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_multiline(draw, text, xy, fnt, fill, max_width, line_spacing=8):
    words = text.split()
    lines = []
    current = ''
    for word in words:
        test = (current + ' ' + word).strip()
        if draw.textlength(test, font=fnt) <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    x, y = xy
    bbox = fnt.getbbox('Ay')
    lh = bbox[3] - bbox[1]
    for line in lines:
        draw.text((x, y), line, font=fnt, fill=fill)
        y += lh + line_spacing
    return y


def ease(t):
    t = max(0.0, min(1.0, t))
    return 0.5 - 0.5 * math.cos(math.pi * t)


def scene_index(frame):
    seg = TOTAL // len(scenes)
    idx = min(frame // seg, len(scenes) - 1)
    local_start = idx * seg
    local_t = (frame - local_start) / seg
    return idx, ease(local_t)


for i in range(TOTAL):
    img = Image.new('RGB', (W, H), bg)
    draw = ImageDraw.Draw(img)

    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((850, -40, 1250, 360), fill=(22, 163, 74, 28))
    gd.ellipse((40, 40, 280, 280), fill=(249, 115, 91, 18))
    glow = glow.filter(ImageFilter.GaussianBlur(40))
    img = Image.alpha_composite(img.convert('RGBA'), glow).convert('RGB')
    draw = ImageDraw.Draw(img)

    idx, t = scene_index(i)
    scene = scenes[idx]

    draw.text((90, 44), 'MeowChat', font=logo_font, fill=navy)
    draw.text((985, 46), 'LINE OA Demo', font=small_font, fill=soft)

    x_left = 90
    title_y = 120
    draw.text((x_left, title_y), 'วิดีโอตัวอย่างการทำงานจริงของ MeowChat', font=label_font, fill=green_deep)
    y = draw_multiline(draw, scene['title'], (x_left, title_y + 34), headline_font, navy, 520, 10)
    y = draw_multiline(draw, scene['subtitle'], (x_left, y + 18), body_font, slate, 500, 10)

    chip_y = y + 22
    cx = x_left
    for chip in scene['chips']:
        tw = draw.textlength(chip, font=small_font)
        rounded(draw, (cx, chip_y, cx + tw + 36, chip_y + 42), 21, white, mist)
        draw.text((cx + 18, chip_y + 10), chip, font=small_font, fill=navy)
        cx += tw + 52

    result_y = chip_y + 82
    rounded(draw, (x_left, result_y, x_left + 500, result_y + 128), 26, panel, mist)
    draw.text((x_left + 24, result_y + 22), 'ผลลัพธ์ที่ร้านได้', font=label_font, fill=green_deep)
    draw_multiline(draw, scene['result'], (x_left + 24, result_y + 54), body_bold, navy, 450, 8)

    cta_y = result_y + 170
    rounded(draw, (x_left, cta_y, x_left + 230, cta_y + 56), 28, green)
    draw.text((x_left + 34, cta_y + 16), 'เริ่มใช้ฟรี 14 วัน', font=cta_font, fill=white)
    rounded(draw, (x_left + 248, cta_y, x_left + 470, cta_y + 56), 28, white, mist)
    draw.text((x_left + 282, cta_y + 16), 'คุยกับทีมทาง LINE', font=cta_font, fill=navy)

    phone_x, phone_y = 770, 80
    phone_w, phone_h = 420, 560
    shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((phone_x + 12, phone_y + 18, phone_x + phone_w + 12, phone_y + phone_h + 18), 40, fill=(15, 23, 42, 35))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    img = Image.alpha_composite(img.convert('RGBA'), shadow).convert('RGB')
    draw = ImageDraw.Draw(img)
    rounded(draw, (phone_x, phone_y, phone_x + phone_w, phone_y + phone_h), 40, dark_bg)
    rounded(draw, (phone_x + 16, phone_y + 18, phone_x + phone_w - 16, phone_y + phone_h - 18), 30, '#F7FAFC')
    rounded(draw, (phone_x + 145, phone_y + 8, phone_x + 275, phone_y + 24), 8, '#273244')

    draw.text((phone_x + 40, phone_y + 42), 'LINE OA Demo', font=label_font, fill=navy)
    draw.text((phone_x + phone_w - 110, phone_y + 42), scene['tag'], font=small_font, fill=soft)

    accent_rgb = tuple(int(scene['accent'][j:j+2], 16) for j in (1, 3, 5))
    band = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    bd = ImageDraw.Draw(band)
    bd.rounded_rectangle((phone_x + 28, phone_y + 74, phone_x + phone_w - 28, phone_y + 154), 22, fill=accent_rgb + (34,))
    img = Image.alpha_composite(img.convert('RGBA'), band).convert('RGB')
    draw = ImageDraw.Draw(img)
    draw.text((phone_x + 50, phone_y + 94), scene['title'], font=body_bold, fill=navy)
    draw.text((phone_x + 50, phone_y + 128), 'ตัวอย่างบทสนทนาที่ใช้บน LINE OA', font=small_font, fill=slate)

    shift = int(12 * (1 - t))
    user_box = (phone_x + 130, phone_y + 194 + shift, phone_x + phone_w - 36, phone_y + 278 + shift)
    bot_box = (phone_x + 34, phone_y + 306 - shift, phone_x + phone_w - 34, phone_y + 432 - shift)
    next_box = (phone_x + 34, phone_y + 454, phone_x + phone_w - 34, phone_y + 536)

    rounded(draw, user_box, 24, white)
    draw.text((user_box[0] + 22, user_box[1] + 18), 'ลูกค้า', font=label_font, fill=soft)
    draw_multiline(draw, scene['user'], (user_box[0] + 22, user_box[1] + 42), chat_font, navy, user_box[2] - user_box[0] - 44, 6)

    rounded(draw, bot_box, 24, green_soft)
    draw.text((bot_box[0] + 22, bot_box[1] + 18), 'MeowChat', font=label_font, fill=green_deep)
    draw_multiline(draw, scene['bot'], (bot_box[0] + 22, bot_box[1] + 42), chat_font, navy, bot_box[2] - bot_box[0] - 44, 6)

    rounded(draw, next_box, 24, panel, mist)
    draw.text((next_box[0] + 22, next_box[1] + 18), 'Next step', font=label_font, fill=green_deep)
    draw_multiline(draw, 'สรุปข้อมูลและส่งต่อให้ทีมเมื่อถึงจังหวะที่คนจริงควรเข้ามาปิดการขาย', (next_box[0] + 22, next_box[1] + 42), small_font, slate, next_box[2] - next_box[0] - 44, 5)

    prog = (i + 1) / TOTAL
    bar_x, bar_y = 90, 676
    rounded(draw, (bar_x, bar_y, bar_x + 1100, bar_y + 12), 6, mist)
    rounded(draw, (bar_x, bar_y, bar_x + int(1100 * prog), bar_y + 12), 6, green)
    draw.text((1090, 648), 'meowchat.store', font=small_font, fill=soft)

    img.save(frames_dir / f'frame_{i:04d}.png')

poster_src = frames_dir / 'frame_0015.png'
poster_dst = out_dir / 'meowchat-demo-poster.png'
Image.open(poster_src).save(poster_dst)

video_path = out_dir / 'meowchat-demo.mp4'
cmd = [
    'ffmpeg', '-y', '-framerate', str(FPS), '-i', str(frames_dir / 'frame_%04d.png'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-crf', '20', str(video_path)
]
subprocess.run(cmd, check=True)
print(video_path)
print(poster_dst)
