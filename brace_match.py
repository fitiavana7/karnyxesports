c = open(r'D:/ai-code/karnyx/KARNYX-contrat.html','rb').read().decode('utf-8', errors='ignore')
ps = c.find('PHOTOS')
# find end of object by brace matching
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
                # check for };
                end = i + 1
                break
        i += 1
pb = c[ps:end+1]
import re
m = re.findall(r'"([^"]+)"\s*:', pb)
print(len(m))
for k in m[:5]:
    print(k)
