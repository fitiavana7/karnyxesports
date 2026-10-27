import json, re
d = json.load(open(r'D:/ai-code/karnyx/extracted_contract.json', encoding='utf-8'))
photos = d['photos']
raw = d['raw']
pseudo_to_photo = {}
for r in raw:
    p = r.get('pseudo') or ''
    pn = p
    for pref in ['KARNYX_', 'KRNYX_', 'KΔRNYX_']:
        if pn.startswith(pref):
            pn = pn[len(pref):]
            break
    pn_low = pn.lower()
    for k, v in photos.items():
        if pn_low in k.lower():
            pseudo_to_photo[p] = v
            break
pjs = open(r'D:/ai-code/karnyx/src/data/players.js', encoding='utf-8').read()
tags = re.findall(r"tag:\s*['\"]([^'\"]+)['\"]", pjs)
for t in tags:
    if t in pseudo_to_photo:
        print('match')
        break
else:
    print('no')
