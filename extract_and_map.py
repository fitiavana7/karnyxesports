#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path

root = Path(r"D:\ai-code\karnyx")
html_path = root / "KARNYX-contrat.html"
players_path = root / "src" / "data" / "players.js"

# Read HTML
with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
    html = f.read()

# Extract PHOTOS
photos_start = html.find("const PHOTOS")
photos_end = html.find("\n  };", photos_start)
photos_block = html[photos_start:photos_end+5]
# Match keys and data URLs
photo_map = {}
for m in re.finditer(r'"([^"]+)"\s*:\s*"([^"]+)"', photos_block):
    key = m.group(1)
    val = m.group(2)
    if val.startswith("data:"):
        photo_map[key] = val

# Extract RAW
raw_match = re.search(r"const RAW\s*=\s*(\[.*?\]);", html, re.S)
raw = json.loads(raw_match.group(1)) if raw_match else []

# Read players.js
with open(players_path, "r", encoding="utf-8") as f:
    players_js = f.read()

# Try to find the players array
# Look for export const players = [ ... ] or const players = [ ... ]
m = re.search(r"(export\s+)?const\s+players\s*=\s*(\[.*\]);", players_js, re.S)
if not m:
    print("Could not find players array", file=sys.stderr)
    sys.exit(1)

players_str = m.group(2)
players = json.loads(players_str)

# Build mapping function
def norm(s):
    if not s:
        return ""
    s2 = str(s).lower()
    # remove diacritics roughly
    s2 = s2.replace("é", "e").replace("è", "e").replace("ê", "e").replace("à", "a").replace("ô", "o").replace("î", "i").replace("ï", "i").replace("ç", "c").replace("ù", "u").replace("û", "u").replace("ü", "u")
    return re.sub(r"[^a-z0-9]+", "", s2)

# Try to match
matched = 0
for p in players:
    # get candidate strings
    candidates = []
    if p.get("pseudo"):
        candidates.append(p["pseudo"])
    if p.get("tag"):
        candidates.append(p["tag"])
    if p.get("name"):
        candidates.append(p["name"])
    if p.get("displayName"):
        candidates.append(p["displayName"])
    # try to find in raw
    for r in raw:
        rpseudo = r.get("pseudo", "")
        rname = r.get("name", "")
        # normalize pseudo without KARNYX_ prefix
        rp_norm = norm(rpseudo.replace("KARNYX_", "").replace("KΔRNYX_", ""))
        for c in candidates:
            cn = norm(c)
            if rp_norm and cn and (rp_norm in cn or cn in rp_norm or rp_norm == cn):
                # try to find photo key
                # look for keys containing rp_norm
                for pk, pv in photo_map.items():
                    pkn = norm(pk)
                    if rp_norm and rp_norm in pkn:
                        p["photo"] = pv
                        matched += 1
                        break
                break
        else:
            continue
        break

print(f"Matched {matched} players")

# Write back players.js - preserve formatting style as much as possible
# Simple approach: reconstruct the array
new_players_str = json.dumps(players, ensure_ascii=False, indent=2)
# Replace
new_js = players_js[:m.start(2)] + new_players_str + players_js[m.end(2):]
with open(players_path, "w", encoding="utf-8") as f:
    f.write(new_js)

print("Updated players.js")
