# Documentation Front-End - Chant d'Espérance

## Vue d'ensemble

Cette application mobile React Native (Expo) affiche un recueil de cantiques chrétiens en créole et en français. Le front-end est prêt et utilise actuellement des données simulées. Ce document explique la structure du front-end et comment intégrer l'API backend.

## Structure du projet

```
chant-d-esperance/
├── app/                    # Écrans (Expo Router - file-based routing)
│   ├── _layout.tsx        # Layout racine avec navigation Stack
│   ├── index.tsx          # Écran d'accueil (Home)
│   ├── creole.tsx         # Liste des chants créoles
│   ├── french.tsx         # Liste des chants français
│   ├── others.tsx         # Liste des sous-catégories
│   ├── subcategory/[id].tsx  # Détail d'une sous-catégorie
│   └── song/[id].tsx       # Détail d'un chant (paroles)
├── components/            # Composants réutilisables
│   └── SearchBar.tsx      # Barre de recherche
├── constants/             # Constantes et thème
│   └── theme.ts           # Couleurs, espacements, typographie
├── data/                  # Données simulées (à remplacer par API)
│   └── songs.ts           # Données mockées
├── types/                 # Types TypeScript
│   └── song.ts            # Interfaces Song et SubCategory
└── hooks/                 # Hooks personnalisés
    └── use-color-scheme.ts # Détection du thème clair/sombre
```

## Types de données

### Song (Chant)

```typescript
interface Song {
  id: string;           // Identifiant unique du chant
  title: string;         // Titre du chant
  number?: string;       // Numéro du cantique (optionnel)
  lyrics?: string;       // Paroles du chant (optionnel)
}
```

### SubCategory (Sous-catégorie)

```typescript
interface SubCategory {
  id: string;            // Identifiant unique de la catégorie
  name: string;          // Nom de la catégorie
  creoleSongs: Song[];   // Liste des chants en créole
  frenchSongs: Song[];   // Liste des chants en français
}
```

## Structure de navigation

L'application utilise Expo Router avec une navigation Stack :

1. **Home** (`/`) → 3 cartes :
   - Chant d'Espérance – Créole → `/creole`
   - Chant d'Espérance – Français → `/french`
   - Autres → `/others`

2. **Liste Créole** (`/creole`) → Liste de chants → `/song/[id]`

3. **Liste Français** (`/french`) → Liste de chants → `/song/[id]`

4. **Autres** (`/others`) → Liste de sous-catégories → `/subcategory/[id]`

5. **Sous-catégorie** (`/subcategory/[id]`) → Sections Créole/Français → `/song/[id]`

6. **Détail Chant** (`/song/[id]`) → Affiche les paroles

## Endpoints API attendus

### 1. Récupérer tous les chants créoles

```
GET /api/songs/creole
Response: Song[]
```

### 2. Récupérer tous les chants français

```
GET /api/songs/french
Response: Song[]
```

### 3. Récupérer toutes les sous-catégories

```
GET /api/categories
Response: SubCategory[]
```

### 4. Récupérer une sous-catégorie par ID

```
GET /api/categories/:id
Response: SubCategory
```

### 5. Récupérer un chant par ID

```
GET /api/songs/:id
Response: Song
```

### 6. Rechercher des chants (optionnel)

```
GET /api/songs/search?q=query&lang=creole|french
Response: Song[]
```

## Intégration API

### Étape 1 : Créer un service API

Créez un fichier `services/api.ts` :

```typescript
import { Song, SubCategory } from '@/types/song';

const API_BASE_URL = 'https://votre-api.com/api'; // À configurer

export const api = {
  // Récupérer tous les chants créoles
  getCreoleSongs: async (): Promise<Song[]> => {
    const response = await fetch(`${API_BASE_URL}/songs/creole`);
    if (!response.ok) throw new Error('Failed to fetch creole songs');
    return response.json();
  },

  // Récupérer tous les chants français
  getFrenchSongs: async (): Promise<Song[]> => {
    const response = await fetch(`${API_BASE_URL}/songs/french`);
    if (!response.ok) throw new Error('Failed to fetch french songs');
    return response.json();
  },

  // Récupérer toutes les sous-catégories
  getCategories: async (): Promise<SubCategory[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  // Récupérer une sous-catégorie par ID
  getCategory: async (id: string): Promise<SubCategory> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    if (!response.ok) throw new Error('Failed to fetch category');
    return response.json();
  },

  // Récupérer un chant par ID
  getSong: async (id: string): Promise<Song> => {
    const response = await fetch(`${API_BASE_URL}/songs/${id}`);
    if (!response.ok) throw new Error('Failed to fetch song');
    return response.json();
  },
};
```

### Étape 2 : Remplacer les imports de données

Dans chaque écran, remplacez :

```typescript
// Avant
import { creoleSongs } from '@/data/songs';

// Après
import { api } from '@/services/api';
const [songs, setSongs] = useState<Song[]>([]);

useEffect(() => {
  api.getCreoleSongs().then(setSongs);
}, []);
```

### Étape 3 : Gérer le chargement et les erreurs

Ajoutez des états de chargement et de gestion d'erreurs :

```typescript
const [songs, setSongs] = useState<Song[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  setLoading(true);
  api.getCreoleSongs()
    .then(setSongs)
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));
}, []);
```

## Fonctionnalités front-end

### Recherche

- La recherche fonctionne côté client (filtrage local)
- Recherche par titre ou numéro de cantique
- Peut être déplacée côté serveur pour de meilleures performances

### Thème clair/sombre

- Support automatique du thème système
- Utilise `useColorScheme()` hook
- Couleurs définies dans `constants/theme.ts`

### Navigation

- Navigation Stack avec Expo Router
- Bouton retour sur chaque écran
- Paramètres passés via URL (`/song/[id]`, `/subcategory/[id]`)

## Configuration requise

### Variables d'environnement

Créez un fichier `.env` :

```
API_BASE_URL=https://votre-api.com/api
```

Puis installez `expo-constants` si nécessaire et configurez :

```typescript
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';
```

## Points d'attention

1. **Format des IDs** : Les IDs doivent être des strings uniques
2. **Gestion des erreurs** : Implémentez une gestion d'erreurs robuste
3. **Cache** : Considérez la mise en cache des données pour améliorer les performances
4. **Pagination** : Si beaucoup de chants, implémentez la pagination
5. **Offline** : Considérez le stockage local pour un mode hors ligne

## Structure des données actuelle (mock)

### Chants d'Espérance
- **Créole** : 10 chants (c1 à c10)
- **Français** : 10 chants (f1 à f10)

### Sous-catégories
- Haiti Chante avec Radio Lumière
- Réveillons-nous
- Réveillons-nous Chrétien
- Écho des élus
- Mélodies Joyeuses
- L'Ombre du Réveil
- Gloire à l'Agneau

Chaque sous-catégorie contient des chants créoles et français.

## Contact

Pour toute question sur le front-end, consultez la structure du code dans les fichiers `app/` et `types/song.ts`.

