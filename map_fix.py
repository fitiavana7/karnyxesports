import json, re
from pathlib import Path

root = Path(r'D:\ai-code\karnyx')
data = json.loads((root / 'extracted_contract.json').read_text(encoding='utf-8'))
photos = data['photos']
raw = data['raw']

# build map
pseudo_to_photo = {}
for r in raw:
    p = r.get('pseudo') or ''
    pn = p
    for pref in ['KARNYX_', 'KRNYX_', 'KΔRNYX_']:
        if pn.startswith(pref):
            pn = pn[len(pref):]
            break
    pn_low = pn.lower()
    # find photo
    for k,v in photos.items():
        if pn_low and pn_low in k.lower():
            pseudo_to_photo[p] = v
            break

players_path = root / 'src' / 'data' / 'players.js'
players_js = players_path.read_text(encoding='utf-8')
updated = players_js
count = [0]
for tag, photo in pseudo_to_photo.items():
    pattern = r"(tag:\s*['\"]" + re.escape(tag) + r"['\"])(.*?)(\n  \},|\n\},)"
    def repl(m, photo=photo):
        body = m.group(2)
        if re.search(r"photo\s*:", body):
            return m.group(0)
        new_body = body.rstrip()
        if new_body and not new_body.endswith(','):
            new_body += ','
        # escape for js string
        photo_esc = photo.replace('\\', '\\\\').replace("'", "\\'")
        new_body += "\n    photo: '" + photo_esc + "',"
        count[0] += 1
        return m.group(1) + new_body + m.group(3)
    new_updated, n = re.subn(pattern, repl, updated, flags=re.S)
    if n:
        updated = new_updated

players_path.write_text(updated, encoding='utf-8')
print(count[0])
