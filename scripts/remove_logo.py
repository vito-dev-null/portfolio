#!/usr/bin/env python3
from PIL import Image, ImageFilter
import os, shutil

src = 'assets/web-dev.jpg'
backup = 'assets/web-dev-orig.jpg'

if not os.path.exists(backup):
    raise FileNotFoundError('Backup non trovato: ' + backup)

# restore original before repair
shutil.copy2(backup, src)
print('Restore original from backup:', backup)

im = Image.open(src).convert('RGB')
w, h = im.size

# target bottom-right logo area
box_w = int(w * 0.18)
box_h = int(h * 0.12)
margin = int(min(w, h) * 0.03)
tx1 = w - box_w - margin
ty1 = h - box_h - margin
tx2 = w - margin
ty2 = h - margin

# choose source patch from above or left area
src_y1 = max(margin, ty1 - box_h - margin)
src_x1 = max(margin, tx1 - box_w - margin)
src_x1 = min(src_x1, tx1)

src_box = (src_x1, src_y1, src_x1 + box_w, src_y1 + box_h)
patch = im.crop(src_box)
patch = patch.filter(ImageFilter.GaussianBlur(1))

# blend patch into target softly
target = im.crop((tx1, ty1, tx2, ty2))
blended = Image.blend(target, patch, alpha=0.8)

# paste and blur slightly
im.paste(blended, (tx1, ty1, tx2, ty2))
region = im.crop((tx1, ty1, tx2, ty2)).filter(ImageFilter.GaussianBlur(1))
im.paste(region, (tx1, ty1))

im.save(src, quality=90)
print('Saved repaired image to', src)
