import re, json, sys
from pathlib import Path

root = Path(r'D:\ai-code\karnyx')
c = (root / 'KARNYX-contrat.html').read_text(encoding='utf-8', errors='ignore')
# photos
ps = c.find('const PHOTOS')
pe = c.find('\n  };', ps)
pb = c[ps:pe+5]
photos = {}
for m in re.finditer(r'"([^"]+)"\s*:\s*"([^"]+)"', pb):
    k = m.group(1)
    v = m.group(2)
    if v.startswith('data:'):
        photos[k] = v
# raw
rm = re.search(r'const RAW\s*=\s*(\[.*?\]);', c, re.S)
raw = json.loads(rm.group(1)) if rm else []
data = {'photos': photos, 'raw': raw}
(root / 'extracted_contract.json').write_text(json.dumps(data, ensure_ascii=False), encoding='utf-8')
print(len(photos), len(raw))
sys.stdout.flush()
