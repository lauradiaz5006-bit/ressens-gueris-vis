// Genesolia · fonction Supabase « flux-meta » : le catalogue de la boutique au format CSV pour Facebook / Instagram (Meta Commerce Manager).
// GET https://qsvzzkjtjsznfntahvvh.supabase.co/functions/v1/flux-meta → CSV relu chaque jour par Meta (« Flux de données planifié »).
// Lit boutique/catalogue.json (stockage public), mêmes filtres que la boutique du site (mugs sans belle photo retirés, coques iPhone 16 retirées).
// Lien de chaque produit : https://genesolia.fr/boutique.html#<slug>. Aucune donnée privée. verify_jwt désactivé.
const PUB = (Deno.env.get("SUPABASE_URL") ?? "https://qsvzzkjtjsznfntahvvh.supabase.co") + "/storage/v1/object/public/boutique/";
const MUGS = ["4f5360f2-ae10-4df0-958e-ad300231760b", "3ac4634b-f06d-4d42-9e11-0f0a88eba3f7", "19aa2d12-239a-4224-a937-29dfff0976e6"];
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
    const photos = [...new Set(((p.photos ?? []) as any[]).map((f) => url(f.src)).filter((u) => /\.(jpe?g|png)(\?|$)/i.test(u)))];
    if (!photos.length) continue;
    const phrase = texte(p.phrase || p.titre);
    const titre = (texte(p.nomType || p.type) + (phrase ? " « " + phrase + " »" : "") + (p.motif ? " · " + texte(p.motif) : "")).slice(0, 150);
    const desc = (texte(p.description) || (phrase ? "« " + phrase + " » · " : "") + "Genesolia, imprimé à la demande en Europe.").slice(0, 5000);
    lignes.push([p.id, titre, desc, "in stock", "new", Math.min(...prix).toFixed(2) + " EUR",
      "https://genesolia.fr/boutique.html#" + encodeURIComponent(p.slug || p.id), photos[0], photos.slice(1, 10).join(","), "Genesolia",
      p.famille === "vetements" ? "Apparel & Accessories > Clothing" : p.type === "coque" ? "Electronics > Communications > Telephony > Mobile Phone Accessories > Mobile Phone Cases" : p.type === "mug" ? "Home & Garden > Kitchen & Dining > Tableware > Drinkware > Mugs" : "Home & Garden > Decor > Artwork > Posters, Prints, & Visual Artwork",
    ].map(champ).join(","));
  }
  return new Response("﻿" + lignes.join("\n"), { headers: { "Content-Type": "text/csv; charset=utf-8", "Cache-Control": "public, max-age=3600", "Access-Control-Allow-Origin": "*" } });
});
