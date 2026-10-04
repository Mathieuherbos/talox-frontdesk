# Captures d'écran — non générées

Je n'ai pas d'outil de capture de navigateur dans cet environnement (pas de Lighthouse, pas de screenshot). Je ne peux donc pas produire les captures desktop/mobile x 3 langues demandées en Phase 4, ni un vrai rapport Lighthouse.

Ce que j'ai fait à la place pour la qualité :
- Validation structurelle automatisée sur les 16 pages (balises équilibrées, un seul H1, hreflang cohérent, JSON-LD valide)
- Vérification HTTP 200 sur toutes les pages et tous les assets via un serveur local
- Calcul réel des ratios de contraste WCAG (pas à l'œil) sur les paires de couleurs du design system
- Audit manuel du HTML généré (meta tags, sémantique, formulaire, liens)

**À faire par toi (ou demande-moi d'utiliser un outil de capture si tu en as un disponible) avant la mise en ligne finale** : ouvrir les 3 langues dans un vrai navigateur, desktop et mobile, et vérifier visuellement que tout s'affiche comme attendu. Je recommande aussi de lancer un vrai audit Lighthouse (Chrome DevTools, onglet Lighthouse) une fois le site déployé en preview.
