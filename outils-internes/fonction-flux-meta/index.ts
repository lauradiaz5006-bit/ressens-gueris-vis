// Genesolia · fonction Supabase « flux-meta » : le catalogue de la boutique au format CSV pour Facebook / Instagram (Meta Commerce Manager).
// GET https://qsvzzkjtjsznfntahvvh.supabase.co/functions/v1/flux-meta → CSV relu chaque jour par Meta (« Flux de données planifié »).
// Lit boutique/catalogue.json (stockage public), mêmes filtres que la boutique du site (mugs sans belle photo retirés, coques iPhone 16 retirées).
// Lien de chaque produit : https://genesolia.fr/boutique.html#<slug>. Aucune donnée privée. verify_jwt désactivé.
const PUB = (Deno.env.get("SUPABASE_URL") ?? "https://qsvzzkjtjsznfntahvvh.supabase.co") + "/storage/v1/object/public/boutique/";
const MUGS = ["4f5360f2-ae10-4df0-958e-ad300231760b", "3ac4634b-f06d-4d42-9e11-0f0a88eba3f7", "19aa2d12-239a-4224-a937-29dfff0976e6"];
// Photos de Laura (mises en scène), placées en premier comme sur le site : copies JPG dans assets/boutique/jpg/
const PORTE: Record<string, string[]> = {
  "80c01b03-9cfd-4c05-90d7-1f3e9ff0027a": ["tshirt-ancetres"], "d3224375-7071-40b0-a452-f8472195bc20": ["capuche-entiere", "capuche-entiere-2"],
  "8133217c-9628-48e4-a328-dff2e58789a7": ["tshirt-entiere"], "b3fc1393-8799-4211-a316-4bb11a3b2db2": ["court-entiere"],
  "afa57379-cd46-4269-bc1b-aa19fbac1a54": ["capuche-excuse-rose"], "7b51a4ee-c89f-4fb7-84e9-ce07c12b0e47": ["sweat-excuse-rose"],
  "29b62026-25e3-493a-b800-2321e6facb8b": ["court-excuse"], "2320a9df-35e3-48d3-bd07-1a254ed31e9b": ["tshirt-excuse"],
  "89e92248-1cad-4a5b-9ea9-0fe2684a5f27": ["coque-celles", "coque-celles-2"], "8621d0ba-1782-4b6a-a37e-ae30ce229165": ["coque-aimer"],
  "19aa2d12-239a-4224-a937-29dfff0976e6": ["mug-aimer", "mug-aimer-2"], "4f5360f2-ae10-4df0-958e-ad300231760b": ["mug-ancetres"], "3ac4634b-f06d-4d42-9e11-0f0a88eba3f7": ["mug-entiere"],
  "7f4e7d40-7898-4192-987d-8c3ca8de4327": ["calendrier", "calendrier-12", "calendrier-3", "calendrier-1", "calendrier-2"],
  "bc031ac8-1c75-4368-9e4a-1d658debb3ac": ["baguettes-racines-50x70"], "ace53bb4-8152-4725-b1e7-f6fccddf2307": ["tfemme-entiere"],
  "0b9a43f9-be05-4b37-8b11-7d3e1a44209e": ["coque-repeter"], "ac58138b-a02c-4bba-a981-896179c59aac": ["court-meriter"],
  "f8d4cb8a-310d-49a8-97f9-ed8904ba5b18": ["capuche-celles", "capuche-celles-2", "capuche-celles-3"],
};
// Matière des vêtements (modèles Gelato vérifiés le 01/11/2026) : ajoutée à la description
const MATIERE: Record<string, string> = {
  capuche: "Gildan Heavy Blend 18500 : 50 % coton, 50 % polyester, molleton d'environ 270 g/m², capuche doublée, poche kangourou.",
  sweat: "Gildan Heavy Blend 18000 : 50 % coton, 50 % polyester, molleton d'environ 270 g/m².",
  hoodie: "Lane Seven LS13001 : 80 % coton peigné, 20 % polyester, French terry 250 g/m².",
  tfemme: "Gildan Softstyle 64000L : 100 % coton peigné, 153 g/m², coupe semi-ajustée.",
  tcourt: "Champion T453W : 100 % coton, environ 237 g/m², coupe courte, petit logo Champion sur la manche.",
};
const url = (s: string) => /^https?:/.test(s) ? s : /^assets\//.test(s) ? "https://genesolia.fr/" + s : PUB + s;
const texte = (s: unknown) => String(s ?? "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const champ = (s: unknown) => { const t = String(s ?? ""); return /[",\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t; };

Deno.serve(async () => {
  const r = await fetch(PUB + "catalogue.json", { cache: "no-store" });
  if (!r.ok) return new Response("catalogue indisponible", { status: 502 });
  const c = await r.json();
  const lignes = [["id", "title", "description", "availability", "condition", "price", "link", "image_link", "additional_image_link", "brand", "google_product_category"].join(",")];
  for (const p of (c.produits ?? []) as any[]) {
    if (p.type === "mug" && !MUGS.includes(p.id)) continue;
    let v = (p.variantes ?? []) as any[];
    if (p.type === "coque") v = v.filter((x) => !/iPhone 16/i.test(x.taille ?? ""));
    const prix = v.map((x) => Number(x.prix)).filter((n) => n > 0);
    if (!prix.length) continue;
    // photos en JPG uniquement (Meta n'accepte pas toujours le WebP)
    const photos = [...new Set((PORTE[p.id] ?? []).map((n) => "https://genesolia.fr/assets/boutique/jpg/" + n + ".jpg").concat(((p.photos ?? []) as any[]).map((f) => url(f.src))).filter((u) => /\.(jpe?g|png)(\?|$)/i.test(u)))];
    if (!photos.length) continue;
    const phrase = texte(p.phrase || p.titre);
    const titre = (texte(p.nomType || p.type) + (phrase ? " « " + phrase + " »" : "") + (p.motif ? " · " + texte(p.motif) : "")).slice(0, 150);
    const desc = [texte(p.description) || (phrase ? "« " + phrase + " »." : ""), MATIERE[p.type] ?? "", "Imprimé à la demande. Livraison offerte en France métropolitaine."].filter(Boolean).join(" ").slice(0, 5000);
    lignes.push([p.id, titre, desc, "in stock", "new", Math.min(...prix).toFixed(2) + " EUR",
      "https://genesolia.fr/boutique.html#" + encodeURIComponent(p.slug || p.id), photos[0], photos.slice(1, 10).join(","), "Genesolia",
      p.famille === "vetements" ? "Apparel & Accessories > Clothing" : p.type === "coque" ? "Electronics > Communications > Telephony > Mobile Phone Accessories > Mobile Phone Cases" : p.type === "mug" ? "Home & Garden > Kitchen & Dining > Tableware > Drinkware > Mugs" : "Home & Garden > Decor > Artwork > Posters, Prints, & Visual Artwork",
    ].map(champ).join(","));
  }
  return new Response("﻿" + lignes.join("\n"), { headers: { "Content-Type": "text/csv; charset=utf-8", "Cache-Control": "public, max-age=3600", "Access-Control-Allow-Origin": "*" } });
});
