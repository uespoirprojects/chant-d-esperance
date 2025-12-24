# Chant d'Espérance - Application Mobile

Application mobile React Native (Expo) pour afficher un recueil de cantiques chrétiens en créole et en français.

## 🚀 Démarrage

### Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn
- Expo CLI

### Installation

```bash
npm install
```

### Lancer l'application

```bash
npm start
```

Puis choisissez votre plateforme :
- Appuyez sur `a` pour Android
- Appuyez sur `i` pour iOS
- Appuyez sur `w` pour Web

## 📱 Structure de l'application

- **Écran d'accueil** : 3 cartes principales (Créole, Français, Autres)
- **Listes de chants** : Affichage avec recherche par titre ou numéro
- **Sous-catégories** : Recueils complémentaires
- **Détail des chants** : Affichage des paroles

## 🎨 Thème

L'application supporte le mode clair et sombre automatiquement selon les préférences système.

## 📚 Documentation Backend

Voir [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) pour la documentation complète sur l'intégration de l'API backend.

## 🛠️ Technologies

- React Native (Expo)
- TypeScript
- Expo Router (navigation)
- React Native Safe Area Context

## 📝 Notes

Actuellement, l'application utilise des données simulées. L'intégration de l'API backend est documentée dans `BACKEND_INTEGRATION.md`.
