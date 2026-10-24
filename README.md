# Snack Jannat

Menu responsive en HTML, CSS et JavaScript, sans compilation ni dépendances JavaScript externes.

Ouvrir `index.html` ou lancer `python -m http.server 8080`, puis ouvrir http://localhost:8080.

Renseigner le vrai numéro WhatsApp international dans `config.js` pour activer l’envoi. Sans numéro, le panier et le récapitulatif restent utilisables. Le client confirme son envoi depuis WhatsApp.

Les 74 entrées et leurs prix sont centralisés dans `data.js`, transcrits depuis la dernière carte `Snack (1).png`. Les boissons fraîches sont incluses et les tarifs des jus et du thé suivent cette carte. La carte complète est accessible en pied de page. Les horaires des plats du jour sont indiqués, sans blocage automatique de commande.

La présentation utilise deux colonnes de catégories sur PC et une colonne sur mobile. Le bouton vert de chaque produit ajoute immédiatement au panier. Une copie visible de la photo part du bouton, suit une courbe pendant 760 ms, rétrécit et arrive dans le panier. Le mode de mouvement réduit supprime cet effet. Les photos illustrent les catégories ; elles ne représentent pas individuellement chaque variante.

Le panier est enregistré localement dans le navigateur. L’URL peut être déployée comme site statique sur Vercel. Les polices Google nécessitent Internet ; des polices de remplacement sont prévues.

Photographies générées avec l’outil intégré ImageGen : assets/food-atlas-generated.png et assets/food-*.webp. Photos culinaires sur fond noir sans texte ni logo ; images illustratives.

Treize photos individuelles de jus sont affichées sous leur liste. Les noms et prix restent ceux du menu. Images en WebP 240 × 240 avec chargement différé ; détails et prompt dans assets/juice-images.md.

# SNACK-JANNAT-DIGITAL-MENU
