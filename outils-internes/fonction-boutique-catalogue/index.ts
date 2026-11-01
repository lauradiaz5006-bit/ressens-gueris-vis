// Genesolia · fonction « boutique-catalogue » : copie la boutique Gelato (produits, variantes, photos) dans le stockage public « boutique ».
// Le site lit boutique/catalogue.json ; le paiement (boutique-paiement) y relit les prix. Rien n'est modifié chez Gelato.
// Appel : ?k=<clé>&part=0..N (4 produits par part, photos copiées), puis ?k=<clé>&fin=1 (assemble le catalogue et applique les prix).
// Au moment d'assembler, les posters de même type et de même phrase (créés en plusieurs fiches chez Gelato) sont réunis en une seule fiche ;
// chaque variante garde l'identifiant de sa fiche Gelato d'origine (pid).
import { createClient } from "npm:@supabase/supabase-js@2";
const K = "bout-cat-7m2q";
const env = Deno.env.toObject();
const CLE = (env.GELATO_API_KEY || (Object.keys(env).filter((n) => /gelato/i.test(n) && !/produit/i.test(n)).map((n) => env[n])[0]) || "").trim();
const STORE = "38331518-652b-41ec-a98f-16ac567cdf05";
const sb = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);
const PAR = 4;
/* Produits retirés de la boutique (01/11/2026, demande de Laura) : les 6 t-shirts unisexes « Performance », remplacés par un modèle en coton */
const RETIRES = new Set(["d34659f7-b860-4568-ac95-5781bbda0bdf", "80c01b03-9cfd-4c05-90d7-1f3e9ff0027a", "8133217c-9628-48e4-a328-dff2e58789a7", "0d837e54-a7ce-452a-b929-c3541e7700c1", "968377a5-cd2b-47d8-ae11-00776e3e54dc", "2320a9df-35e3-48d3-bd07-1a254ed31e9b"]);

/* Les tailles proposées et les prix (livraison comprise en France métropolitaine). Grand format 70 × 100 ajouté le 01/11/2026 ; pas de 75 × 100 ni de carré. */
const TAILLES: [RegExp, string, string][] = [[/^21x29\.7/, "a4", "A4 · 21 × 29,7 cm"], [/^A3 /, "a3", "A3 · 29,7 × 42 cm"], [/^30x40/, "30x40", "30 × 40 cm"], [/^50x70/, "50x70", "50 × 70 cm"], [/^70x100/, "70x100", "70 × 100 cm"]];
const NOM_TAILLE: Record<string, string> = Object.fromEntries(TAILLES.map((t) => [t[1], t[2]]));
/* quand le nom de la variante ne donne pas la taille (« Cadre en bois », « Toile »…), on la lit dans la référence Gelato */
function tailleUid(uid: string) {
  if (/(^|_)a4-8x12|210x297/.test(uid)) return "a4"; if (/(^|_)a3(_|-)/.test(uid)) return "a3";
  if (/300x400/.test(uid)) return "30x40"; if (/500x700/.test(uid)) return "50x70"; if (/700x1000/.test(uid)) return "70x100"; return "";
}
const PRIX_POSTER: Record<string, number> = { a4: 29, a3: 39, "30x40": 45, "50x70": 59, "70x100": 69 };
const PRIX_CADRE: Record<string, number> = { a4: 49, a3: 59, "30x40": 65, "50x70": 99 };
const PRIX_BAGUETTES: Record<string, number> = { a4: 44, a3: 54, "30x40": 59, "50x70": 79, "70x100": 99 };
const PRIX_TOILE: Record<string, number> = { "50x70|fin": 99, "50x70|epais": 109, "70x100|fin": 129, "70x100|epais": 139 };
function typeDe(t: string, uid: string) {
  if (/^Tableau en toile/i.test(t) || /^canvas_/.test(uid)) return "toile";
  if (/^Poster avec baguettes/i.test(t) || /^wall_hanging/.test(uid)) return "baguettes";
  if (/^Poster encadr/i.test(t) || /^framed_poster/.test(uid)) return "encadre";
  if (/^Poster/i.test(t) || /^flat_/.test(uid)) return "poster";
  if (/^Calendrier/i.test(t)) return "calendrier";
  if (/^Mug/i.test(t)) return "mug";
  if (/^Coque/i.test(t)) return "coque";
  if (/^Hoodie premium/i.test(t)) return "hoodie";
  if (/^Sweat à capuche/i.test(t)) return "capuche";
  if (/^Sweat/i.test(t)) return "sweat";
  if (/^T-shirt court femme/i.test(t)) return "tcourt";
  if (/^T-shirt femme/i.test(t)) return "tfemme";
  if (/^T-shirt/i.test(t)) return "tshirt";
  return "";
}
/* Prix fixes (validés par Laura le 31/10/2026 ; le 01/11/2026 : t-shirt femme 29 €, coque 27 €) ; vêtements en 2XL et 3XL : + 3 € */
const PRIX_FIXE: Record<string, number> = { calendrier: 25, mug: 24, coque: 27, hoodie: 65, capuche: 55, sweat: 49, tcourt: 39, tfemme: 29, tshirt: 34 };
const GRANDES = /^(2XL|3XL)$/;
const FAMILLE: Record<string, string> = { poster: "posters", encadre: "posters", baguettes: "posters", toile: "posters", calendrier: "maison", mug: "maison", coque: "maison", hoodie: "vetements", capuche: "vetements", sweat: "vetements", tcourt: "vetements", tfemme: "vetements", tshirt: "vetements" };
function prixFixe(ty: string, taille: string) { return PRIX_FIXE[ty] + (FAMILLE[ty] === "vetements" && GRANDES.test(taille || "") ? 3 : 0); }
const NOM_TYPE: Record<string, string> = { poster: "Poster", encadre: "Poster encadré", baguettes: "Poster avec baguettes", toile: "Tableau en toile", calendrier: "Calendrier 2027", mug: "Mug", coque: "Coque iPhone", hoodie: "Hoodie premium", capuche: "Sweat à capuche", sweat: "Sweat", tcourt: "T-shirt court femme", tfemme: "T-shirt femme", tshirt: "T-shirt" };
const ORDRE_T = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

function phraseDe(t: string) {
  const g = t.match(/«\s*([^»]+?)\s*»/); if (g) return g[1].trim();
  return t.replace(/^Poster (avec baguettes |encadré brillant |encadré )?/i, "").replace(/\s*·\s*Genesolia\s*$/i, "").replace(/\s*\|\s*Genesolia\s*$/i, "").trim();
}
function motifDe(t: string) { const m = t.match(/»\s*[–-]\s*([^,]+),/); return m ? m[1].trim() : ""; }
function slug(t: string) { return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60); }

async function gelato(path: string) { const r = await fetch("https://ecommerce.gelatoapis.com/v1/stores/" + STORE + path, { headers: { "X-API-KEY": CLE } }); return r.json(); }

async function copier(url: string, chemin: string) {
  try {
    const r = await fetch(url); if (!r.ok) return "";
    const ct = r.headers.get("content-type") || "image/jpeg", ext = /png/.test(ct) ? "png" : /webp/.test(ct) ? "webp" : "jpg";
    const nom = chemin + "." + ext, b = new Uint8Array(await r.arrayBuffer());
    const { error } = await sb.storage.from("boutique").upload(nom, b, { contentType: ct, upsert: true, cacheControl: "604800" });
    return error ? "" : nom;
  } catch (_e) { return ""; }
}

async function produit(id: string) {
  if (RETIRES.has(id)) return null;
  const p = await gelato("/products/" + id);
  const titre = String(p.title || ""), uid0 = (p.variants || [])[0]?.productUid || "", ty = typeDe(titre, uid0);
  if (!ty || /papier mat encadré en métal$/i.test(titre)) return null;
  const variantes: any[] = [];
  for (const v of p.variants || []) {
    if (v.isHidden) continue;
    const uid = String(v.productUid || "");
    const morceaux = String(v.title || "").split(" - ").map((s: string) => s.trim());
    let prix = 0, taille = "", tailleNom = "", option = "";
    if (FAMILLE[ty] === "posters") {
      if (/750x1000/.test(uid)) continue;
      const T = TAILLES.find((x) => x[0].test(morceaux[0]));
      if (T) { taille = T[1]; option = morceaux[1] || ""; }
      else { taille = tailleUid(uid); option = ty === "encadre" ? morceaux.join(" ") : ""; }
      if (!taille) continue;
      tailleNom = NOM_TAILLE[taille];
      if (ty === "toile") { const ep = /thick/.test(uid) ? "epais" : "fin"; option = ep === "epais" ? "Châssis épais" : "Châssis fin"; prix = PRIX_TOILE[taille + "|" + ep]; }
      else prix = ty === "encadre" ? PRIX_CADRE[taille] : ty === "baguettes" ? PRIX_BAGUETTES[taille] : PRIX_POSTER[taille];
      if (!prix) continue;
    } else {
      if (ty === "coque") { tailleNom = morceaux[0]; }
      else if (FAMILLE[ty] === "vetements") { const tt = morceaux.find((m: string) => ORDRE_T.includes(m)) || ""; tailleNom = tt; option = morceaux.filter((m: string) => m !== tt).join(" "); }
      else tailleNom = "";
      prix = prixFixe(ty, tailleNom);
    }
    variantes.push({ id: v.id, pid: id, taille: tailleNom, cle: taille, option: option.replace(/^Baguettes de suspension /, "Baguettes ").replace(/^Cadre /, "Cadre "), prix });
  }
  if (!variantes.length) return null;
  /* les photos : la photo générale, puis une par variante (taille + couleur) pour les posters, une par couleur sinon */
  const imgs = p.productImages || [], choisies: any[] = [], vus = new Set<string>(), poster = FAMILLE[ty] === "posters";
  imgs.filter((i: any) => !(i.productVariantIds || i.variantIds || []).length).slice(0, poster ? 1 : 3).forEach((i: any) => choisies.push({ i, option: "", cle: "" }));
  for (const i of imgs) {
    if (choisies.length >= (poster ? 24 : 8)) break;
    const vs = (i.productVariantIds || i.variantIds || []) as string[]; if (!vs.length) continue;
    const va = variantes.find((x) => vs.includes(x.id)); if (!va) continue;
    const k = poster ? va.cle + "|" + va.option : va.option; if (vus.has(k)) continue;
    vus.add(k); choisies.push({ i, option: va.option, cle: poster ? va.cle : "" });
  }
  if (!choisies.length && imgs[0]) choisies.push({ i: imgs[0], option: "", cle: "" });
  const faits = await Promise.all(choisies.map((c, k) => copier(c.i.fileUrl, "img/" + id + "-" + k)));
  const photos: any[] = [];
  faits.forEach((ch, k) => { if (ch) photos.push({ src: ch, option: choisies[k].option, cle: choisies[k].cle }); });
  const phrase = phraseDe(titre);
  return { id, type: ty, famille: FAMILLE[ty], nomType: NOM_TYPE[ty], phrase, motif: motifDe(titre), slug: slug(NOM_TYPE[ty] + " " + phrase), titre,
    description: String(p.description || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 900), photos,
    variantes: variantes.sort((a, b) => a.prix - b.prix || ORDRE_T.indexOf(a.taille) - ORDRE_T.indexOf(b.taille)), prixMin: Math.min(...variantes.map((x) => x.prix)) };
}

/* posters : une seule fiche par type et par phrase (les tailles et options des autres fiches Gelato y sont ajoutées) */
function reunir(l: any[]) {
  const norm = (s: string) => String(s || "").toLowerCase().replace(/[.!?…\s]+$/, "").trim();
  const groupes = new Map<string, any[]>(), out: any[] = [];
  for (const p of l) {
    if (p.famille !== "posters") { out.push(p); continue; }
    const k = p.type + "|" + norm(p.phrase) + "|" + norm(p.motif) + "|" + (/brillant/i.test(p.titre) ? "b" : "");
    if (!groupes.has(k)) { groupes.set(k, []); out.push(k); }
    groupes.get(k)!.push(p);
  }
  return out.map((x) => {
    if (typeof x !== "string") return x;
    const g = groupes.get(x)!.sort((a, b) => b.variantes.length - a.variantes.length);
    const m = { ...g[0], ids: g.map((p) => p.id), variantes: [...g[0].variantes], photos: [...g[0].photos] };
    for (const p of g.slice(1)) {
      for (const v of p.variantes) if (!m.variantes.some((w: any) => w.cle === v.cle && (w.option || "") === (v.option || ""))) m.variantes.push(v);
      for (const f of p.photos) if (m.photos.length < 30) m.photos.push(f);
      if (!m.description && p.description) m.description = p.description;
    }
    m.variantes.forEach((v: any) => { if (!v.pid) v.pid = g.find((p) => p.variantes.includes(v))?.id; });
    m.variantes.sort((a: any, b: any) => a.prix - b.prix);
    m.prixMin = Math.min(...m.variantes.map((v: any) => v.prix));
    return m;
  });
}

Deno.serve(async (req) => {
  const u = new URL(req.url);
  if (u.searchParams.get("k") !== K) return new Response("non", { status: 403 });
  if (u.searchParams.get("fin")) {
    let l: any[] = []; let n = 0;
    for (;;) { const { data } = await sb.storage.from("boutique").download("parts/" + n + ".json"); if (!data) break; l.push(...JSON.parse(await data.text())); n++; }
    l = l.filter((p: any) => !RETIRES.has(p.id));
    /* les prix fixes du jour, appliqués à l'assemblage (sans recopier les photos) */
    for (const p of l) if (PRIX_FIXE[p.type]) {
      p.variantes.forEach((v: any) => { v.prix = prixFixe(p.type, v.taille); });
      p.variantes.sort((a: any, b: any) => a.prix - b.prix || ORDRE_T.indexOf(a.taille) - ORDRE_T.indexOf(b.taille));
      p.prixMin = Math.min(...p.variantes.map((x: any) => x.prix));
    }
    l = reunir(l);
    const cat = { maj: new Date().toISOString(), produits: l };
    await sb.storage.from("boutique").upload("catalogue.json", new Blob([JSON.stringify(cat)], { type: "application/json" }), { upsert: true, contentType: "application/json", cacheControl: "300" });
    return new Response(JSON.stringify({ parts: n, produits: l.length }));
  }
  const liste = await gelato("/products?limit=100");
  const ids = (liste.products || []).map((p: any) => p.id);
  const part = +(u.searchParams.get("part") || 0), mes = ids.slice(part * PAR, part * PAR + PAR), out: any[] = [], err: string[] = [];
  for (const id of mes) { try { const x = await produit(id); if (x) out.push(x); } catch (e) { err.push(id + " " + String(e).slice(0, 120)); } }
  await sb.storage.from("boutique").upload("parts/" + part + ".json", new Blob([JSON.stringify(out)], { type: "application/json" }), { upsert: true, contentType: "application/json" });
  return new Response(JSON.stringify({ total: ids.length, part, faits: out.length, photos: out.reduce((s, x) => s + x.photos.length, 0), err }));
});
