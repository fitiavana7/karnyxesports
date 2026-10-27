c=open(r'D:/ai-code/karnyx/KARNYX-contrat.html','rb').read().decode('utf-8',errors='ignore')
ps=c.find('PHOTOS')
pe=c.find('\n  };', ps)
pb=c[ps:pe+5]
import re
cnt=len(re.findall(r'"[^"]+"\s*:', pb))
print(cnt)
