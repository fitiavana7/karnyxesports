import json, re
from pathlib import Path

root = Path(r'D:\ai-code\karnyx')
data = json.loads((root / 'extracted_contract.json').read_text(encoding='utf-8'))
photos = data['photos']
raw = data['raw']

players_path = root / 'src' / 'data' / 'players.js'
players_js = players_path.read_text(encoding='utf-8')

# Build maps
tag_to_photo = {}
for r in raw:
    pseudo = r.get('pseudo','') or ''
    name_part = pseudo.replace('KARNYX_','').replace('KRNYX_','').replace('KΔRNYX_','').lower()
    for k,v in photos.items():
        k_low = k.lower()
        if name_part and name_part in k_low:
            tag_to_photo[pseudo] = v
            break
for r in raw:
    name = (r.get('name') or '').lower()
    for k,v in photos.items():
        k_low = k.lower()
        if name and name in k_low and r.get('pseudo') not in tag_to_photo:
            tag_to_photo[r.get('pseudo')] = v
            break

updated = players_js
count = [0]
for tag, photo in tag_to_photo.items():
    pattern = r"(tag:\s*['\"]" + re.escape(tag) + r"['\"])(.*?)(\n  \},|\n\},)"
    def repl(m, tag=tag, photo=photo):
        body = m.group(2)
        if re.search(r"photo\s*:", body):
            return m.group(0)
        new_body = body.rstrip()
        if new_body and not new_body.endswith(','):
            new_body += ','
        new_body += "\n    photo: '" + photo.replace("\\", "\\\\").replace("'", "\\'") + "',"
        count[0] += 1
        return m.group(1) + new_body + m.group(3)
    new_updated, n = re.subn(pattern, repl, updated, flags=re.S)
    if n:
        updated = new_updated

players_path.write_text(updated, encoding='utf-8')
print('updated', count[0])
