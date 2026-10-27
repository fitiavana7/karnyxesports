import re, json

p = open(r'D:/ai-code/karnyx/src/data/players.js', encoding='utf-8').read()
start = p.find('export const players = [')
# find matching bracket
# simple: look for \n]; 
end = p.find('\n];', start)
arr_str = p[start + len('export const players = '):end+2]
# try to parse as js-like - but has comments? maybe not much; use json5 not available, try ast
try:
    import ast
    # not valid json, skip
except:
    pass
# use node via subprocess alternative - just do with regex to find objects roughly
# easier: write temp mjs and run node
pass
