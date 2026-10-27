c = open(r'D:/ai-code/karnyx/KARNYX-contrat.html','rb').read().decode('utf-8', errors='ignore')
ps = c.find('PHOTOS')
# look for end
pe = c.find('\r\n  };', ps)
if pe == -1:
    pe = c.find('\n  };', ps)
pb = c[ps:pe+5]
import re
keys = []
for m in re.findall(r'"([^"]+)"\s*:', pb):
    if not m.startswith('data:'):
        keys.append(m)
print(len(keys))
for k in keys[:10]:
    print(k)
