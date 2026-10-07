#!/usr/bin/env python3
"""Ajoute des fiches prénoms (fichier JSON : liste d'objets) à assets/prenoms.js, après contrôles,
et les retire de outils-internes/prenoms-a-venir.json. Usage : python3 outils-internes/ajouter-prenoms.py nouvelles-fiches.json"""
import json, sys, re, os, unicodedata
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
CLES = {'prenom', 'variantes', 'genre', 'origine', 'sens', 'histoire', 'fete'}
INTERDIT = re.compile(r"\b(santé|guéri\w*|soign\w*|soins?|maladi\w*|malade\w*|thérap\w*|médic\w*|médecin\w*|patient\w*|symptôm\w*|vibr\w*)\b|→|—", re.I)
def slug(s): return ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if unicodedata.category(c) != 'Mn').replace(' ', '-')
src = os.path.join(R, 'assets', 'prenoms.js')
base = json.loads(open(src, encoding='utf-8').read().split('window.PRENOMS = ', 1)[1].rstrip().rstrip(';'))
deja = {x['slug'] for x in base}
nouv = json.load(open(sys.argv[1], encoding='utf-8'))
ok, refus = [], []
for x in nouv:
    pb = []
    if set(x) - {'slug'} != CLES: pb.append('clés ' + str(sorted(set(x) ^ CLES)))
    if x.get('genre') not in ('f', 'm', 'mixte'): pb.append('genre')
    if not x.get('sens') or not x.get('histoire'): pb.append('texte vide')
    if INTERDIT.search(json.dumps(x, ensure_ascii=False)): pb.append('mot interdit')
    x['slug'] = slug(x.get('prenom', ''))
    if x['slug'] in deja: pb.append('déjà présent')
    if pb: refus.append((x.get('prenom'), pb))
    else: ok.append(x); deja.add(x['slug'])
base = sorted(base + ok, key=lambda x: x['slug'])
open(src, 'w', encoding='utf-8').write('/* Genesolia · fiches prénoms (origine, sens, histoire, fête) */\nwindow.PRENOMS = ' + json.dumps(base, ensure_ascii=False, separators=(',', ':')) + ';\n')
q = os.path.join(R, 'outils-internes', 'prenoms-a-venir.json')
if os.path.exists(q):
    file = json.load(open(q, encoding='utf-8'))
    for g in file: file[g] = [p for p in file[g] if slug(p['prenom']) not in deja]
    json.dump(file, open(q, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ajoutées :', len(ok), '| refusées :', refus, '| total :', len(base))
