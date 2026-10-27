c = open(r'D:/ai-code/karnyx/KARNYX-contrat.html','rb').read().decode('utf-8', errors='ignore')
ps = c.find('PHOTOS')
# find end
depth = 0
in_str = False
quote = None
i = c.find('{', ps)
n = len(c)
end = -1
while i < n:
    ch = c[i]
    if in_str:
        if ch == '\\':
            i += 2
            continue
        if quote and ch == quote:
            in_str = False
            quote = None
        i += 1
        continue
    else:
        if ch == '"' or ch == "'":
            in_str = True
            quote = ch
            i += 1
            continue
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                end = i
                break
        i += 1
pb = c[ps:end+1]
import re, json
photos = {}
# match key: value where value starts with data:
for m in re.finditer(r'"([^"]+)"\s*:\s*"([^"]+)"', pb):
    k = m.group(1)
    v = m.group(2)
    if v.startswith('data:'):
        photos[k] = v
# raw
rm = re.search(r'const RAW\s*=\s*(\[.*?\]);', c, re.S)
raw = json.loads(rm.group(1)) if rm else []
open(r'D:/ai-code/karnyx/extracted_contract.json','w',encoding='utf-8').write(json.dumps({'photos':photos,'raw':raw},ensure_ascii=False))
print(len(photos), len(raw))
