# CLAUDE.md — talox-frontdesk

Ce fichier guide Claude Code (ou tout développeur) travaillant sur ce dépôt. Il documente les conventions héritées de talox-website-v2 (audit du 2026-10-04) et les règles spécifiques à ce projet.

## Qu'est-ce que c'est

Site mono-produit pour **FrontDesk** (nom produit, marque mère Talox) : qualification des demandes entrantes et prise de rendez-vous pour agences immobilières indépendantes (2 à 10 personnes) à Bruxelles et dans le Brabant wallon. V1 limitée à ces deux fonctions. Rien d'autre (pas de chatbot, pas d'automatisations génériques) ne doit apparaître sur ce site.

## Stack

100% statique, zéro build step, zéro dépendance npm. HTML/CSS/JS vanilla. Pas de `package.json`. Les fichiers du dépôt sont servis tels quels par l'hébergeur, sans transformation.

## Design system (valeurs exactes, ne pas deviner, voir `css/style.css`)

- Accent marque : `#7c3aed` (violet), `#a586f2` (clair)
- Fond : `#0b0a10` (page), `#131019` (cartes), `#17131f` (hover)
- Texte : `#f4f1fb` (blanc), `#a79fc2` (clair), `#847bab` (muted — contraste vérifié WCAG AA : 4.84:1 sur `--dark-card`, 5.07:1 sur `--dark`. Ne jamais redescendre en dessous de 4.5:1 pour du texte normal)
- Rayons : 6px / 10px / 14px (modérés, jamais de pilule à 100px partout)
- Ombres : toujours teintées violet, jamais de noir plat
- Police titres : Space Grotesk (500/600/700)
- Police texte : Manrope (400/500/600/700)
- Icônes : Phosphor (filled, inline SVG), jamais Lucide/Feather (considéré comme le choix par défaut de l'IA)
- Largeur conteneur : 1200px

## Internationalisation — IMPORTANT, différent de talox-website-v2

talox-website-v2 gérait FR/EN/NL via un mécanisme JS côté client (une seule URL, `data-i18n` + `window.TALOX_I18N`, bascule par JS). **Ce dépôt utilise une architecture différente** : une vraie URL par langue (`/`, `/en/`, `/nl/`), avec contenu HTML natif par langue (pas de JS requis pour le texte) et balises `hreflang` + `x-default` sur chaque page. Raison : seule une vraie URL par langue permet une indexation correcte par Google (le mécanisme JS ne faisait indexer que le FR).

Ne pas réintroduire le moteur `data-i18n`/`window.TALOX_I18N` sans raison : il a été abandonné volontairement pour ce projet.

## Conventions reprises de talox-website-v2

- Sémantique HTML stricte : `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- Skip-link + `:focus-visible` sur tous les éléments interactifs
- Formulaire : `required`, `type="email"`, honeypot `name="_gotcha"` (convention Formspree, aucune config supplémentaire)
- Aucune balise `<img>` sauf nécessité réelle (le site utilise SVG inline et vidéo externe) — si des photos sont ajoutées, `alt` obligatoire et non vide
- Meta title/description/OG/Twitter sur chaque page, JSON-LD (FAQPage, LocalBusiness) où pertinent
- Favicon en SVG inline (data URI), pas de fichier externe
- Pages légales séparées avec `[À COMPLÉTER]` explicite pour toute donnée juridique réelle non fournie (forme juridique, numéro BCE, adresse), et `<meta name="robots" content="noindex, nofollow">` tant que la page contient des placeholders
- Commits : Conventional Commits (`feat:`, `fix:`, `docs:`)
- Jamais de secret en dur dans le code. L'ID Formspree n'est pas un secret (il est public par design, comme un ID Google Analytics) et reste codé en dur dans le HTML ; documenté dans `.env.example` à titre indicatif

## Ce qui ne doit jamais apparaître

- Tout contenu sur les autres services Talox (chatbots, automatisations sur-mesure, autres secteurs que l'immobilier)
- Témoignages, logos clients, chiffres ou résultats non fournis explicitement par Mathieu
- Promesses chiffrées non confirmées
- Données d'entreprise réelles tant qu'elles ne sont pas fournies (Talox n'est pas encore constituée juridiquement)

## Déploiement

Dépôt privé. Ne jamais passer en public sans accord explicite. Aperçu via GitHub Pages (nécessite un dépôt public pour l'hébergement gratuit — à ARRÊTER et redemander confirmation avant de changer la visibilité). Aucun DNS touché, aucune publication sur le domaine de production sans validation explicite.
