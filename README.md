# TALOX FrontDesk

Site mono-produit pour **FrontDesk** : qualification des demandes entrantes et prise de rendez-vous pour agences immobilières indépendantes (2 à 10 personnes) à Bruxelles et dans le Brabant wallon.

Base technique reprise de [talox-website-v2](https://github.com/Mathieuherbos/talox-website-v2) (audit complet dans l'historique de conversation du 2026-10-04) : design system, conventions SEO/accessibilité, structure de formulaire. Voir `CLAUDE.md` pour le détail des conventions à respecter.

## Stack

HTML/CSS/JS vanilla, zéro build step, zéro dépendance.

## Structure

```
/                       FR (langue par défaut)
  index.html
  mentions-legales.html
  confidentialite.html
  cookies.html
  404.html
en/                     EN
  index.html
  mentions-legales.html
  confidentialite.html
  cookies.html
nl/                     NL
  index.html
  mentions-legales.html
  confidentialite.html
  cookies.html
css/style.css
js/main.js              nav mobile, formulaire, smooth scroll
images/
sitemap.xml             trilingue
robots.txt
.env.example
docs/screenshots/        captures desktop/mobile x 3 langues (Phase 4)
```

## Formulaire

Branché sur Formspree (même prestataire que talox.be). L'ID de formulaire est public par nature (pas un secret), documenté dans `.env.example`. Honeypot anti-spam (`_gotcha`) inclus.

Bouton complémentaire "Prendre rendez-vous" vers Calendly : https://calendly.com/contact-talox/30min

## État du projet

Brouillon en développement. Pages légales avec champs `[À COMPLÉTER]` tant que la structure juridique de Talox n'est pas créée. Aucune publication sur le domaine de production sans validation explicite.
