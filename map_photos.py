import json, re
from pathlib import Path

root = Path(r'D:\ai-code\karnyx')
data = json.loads((root / 'extracted_contract.json').read_text(encoding='utf-8'))
photos = data['photos']
raw = data['raw']

players_path = root / 'src' / 'data' / 'players.js'
players_js = players_path.read_text(encoding='utf-8')

# Parse players array
start = players_js.find('export const players = [')
# find end of array
# simple: look for \n];
end = players_js.find('\n];', start)
arr_str = players_js[start + len('export const players = '):end+2]

# Use node to parse? easier to do regex-based replacement by id/tag
# Build maps
# map by tag without prefix
tag_to_photo = {}
for r in raw:
    pseudo = r.get('pseudo','') or ''
    # extract name part
    name_part = pseudo.replace('KARNYX_','').replace('KRNYX_','').replace('KΔRNYX_','').lower()
    # find photo key containing name_part or matching
    for k,v in photos.items():
        k_low = k.lower()
        if name_part and name_part in k_low:
            tag_to_photo[pseudo] = v
            break
# also try by raw name
for r in raw:
    name = (r.get('name') or '').lower()
    for k,v in photos.items():
        k_low = k.lower()
        if name and name in k_low and r.get('pseudo') not in tag_to_photo:
            tag_to_photo[r.get('pseudo')] = v
            break

# Update players.js - add photo field if missing
updated = players_js
count = 0
for tag, photo in tag_to_photo.items():
    # find player object with this tag
    # look for tag: '...'
    pattern = r"(tag:\s*['\"]" + re.escape(tag) + r"['\"])(.*?)(\n  \},|\n\},)"
    def repl(m):
        nonlocal count
        body = m.group(2)
        # if photo already exists, skip adding
        if re.search(r"photo\s*:", body):
            return m.group(0)
        # add photo before closing of this object - insert before the comma/brace
        # add as property
        new_body = body.rstrip()
        if new_body and not new_body.endswith(','):
            new_body += ','
        new_body += "\n    photo: '" + photo.replace("'", "\\'") + "',"
        count += 1
        return m.group(1) + new_body + m.group(3)
    new_updated, n = re.subn(pattern, repl, updated, flags=re.S)
    if n:
        updated = new_updated

players_path.write_text(updated, encoding='utf-8')
print('updated', count)
