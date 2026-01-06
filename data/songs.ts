import { Song, SubCategory } from '@/types/song';
import songsData from './chantsdesperance.json';

// INTERFACES ET TYPES
//Interface pour la structure du JSON brut
//Le fichier JSON contient deux sections: C.E.F (français) et C.E.K (créole)
//Chaque section est un objet avec des numéros de chants comme clés
//et des tableaux de strophes comme valeurs
interface SongsDataJson {
  chants: {
    "C.E.F": Record<string, string[]>; // Chants en français
    "C.E.K": Record<string, string[]>; // Chants en créole
  };
}

//Cast du JSON importé vers notre interface
const data = songsData as SongsDataJson;
/**
 * Détecte si un slide (strophe) est un refrain
 * 
 * Un refrain est une strophe qui se répète plusieurs fois dans le même chant
 * 
 * @param slide - Le texte de la strophe à vérifier
 * @param allSlides - Toutes les strophes du chant
 * @param currentIndex - L'index de la strophe actuelle (non utilisé pour l'instant)
 * @returns true si c'est un refrain (apparaît 2 fois ou plus), false sinon
 * 
 * Exemple:
 * Si dans un chant, la strophe "Alléluia, gloire à Dieu" apparaît 3 fois,
 * cette fonction retournera true pour cette strophe et sera considreée comme un refrain
 */
const isRefrain = (slide: string, allSlides: string[], currentIndex: number): boolean => {
  //Étape 1: Normaliser le texte pour la comparaison
  //C'est à dire on enlève les espaces superflus pour comparer uniquement le contenu
  const normalizedSlide = slide.trim().replace(/\s+/g, ' ');
  
  // Étape 2: Compter combien de fois cette strophe apparaît dans le chant
  let occurrenceCount = 0;
  for (let i = 0; i < allSlides.length; i++) {
    // Normaliser chaque strophe pour la comparaison
    const normalizedOther = allSlides[i].trim().replace(/\s+/g, ' ');
    // Si les textes sont identiques, incrémenter le compteur
    if (normalizedSlide === normalizedOther) {
      occurrenceCount++;
    }
  }
  
  // Étape 3: Si la strophe apparaît 2 fois ou plus, c'est un refrain
  return occurrenceCount >= 2;
};

// FONCTION: EXTRACTION DU TITRE
/**
 * Extrait un titre intelligent depuis la première strophe d'un chant
 * 
 * Le titre est créé en prenant les premières lignes de la première strophe
 * Format final: "N° [numéro] - [Langue] - [Extrait du texte]"
 * 
 * @param slides - Toutes les strophes du chant
 * @param number - Le numéro du chant (ex: "1f", "43c")
 * @param language - La langue du chant ('french' ou 'creole')
 * @returns Le titre formaté du chant
 * 
 * Exemple:
 * Input: slides = ["Seigneur Jésus...", ...], number = "1f", language = "french"
 * Output: "N° 1 - Français - Seigneur Jésus..."
 */
const extractTitle = (slides: string[], number: string, language: 'french' | 'creole'): string => {
  // Cas 1: Si le chant n'a pas de strophes,on crée un titre par défaut
  if (!slides || slides.length === 0) {
    const numericPart = number.match(/\d+/)?.[0] || number;
    const langLabel = language === 'creole' ? 'Créole' : 'Français';
    return `N° ${numericPart} - ${langLabel}`;
  }
  // Cas 2:Extraire le titre depuis la première strophe
  const firstSlide = slides[0];
  
  // Étape 1: Découper le texte en lignes et enlever les lignes vides
  const lines = firstSlide
    .split('\n')                              // Séparer par saut de ligne
    .map(line => line.trim())                 // Enlever les espaces au début/fin
    .filter(line => line.length > 0);         // Garder seulement les lignes non vides

  // Si aucune ligne valide, retourner un titre par défaut
  if (lines.length === 0) {
    const numericPart = number.match(/\d+/)?.[0] || number;
    const langLabel = language === 'creole' ? 'Créole' : 'Français';
    return `N° ${numericPart} - ${langLabel}`;
  }

  // Étape 2:Prendre les 2-3 premières lignes comme titre
  const titleLines = lines.slice(0, 3);
  let title = titleLines.join(' ');

  // Étape 3:Nettoyer le titre
  title = title
    .replace(/\s+/g, ' ') // Remplacer les espaces multiples par un seul espace
    .replace(/\n/g, ' ')  // Remplacer les sauts de ligne par des espaces
    .trim();              // Enlever les espaces au début et à la fin

  // Étape 4:Limiter la longueur du titre à 45 caractères maximum
  if (title.length > 45) {
    title = title.substring(0, 42) + '...';
  }

  // Étape 5:Si le titre est trop court, ajouter plus de contexte
  if (title.length < 10 && lines.length > 3) {
    const moreTitleLines = lines.slice(0, 5);
    title = moreTitleLines.join(' ').substring(0, 45).trim();
    if (title.length > 42) {
      title = title.substring(0, 42) + '...';
    }
  }

  // Étape 6:Formater le titre final avec le numéro et la langue
  const numericPart = number.match(/\d+/)?.[0] || number;
  const langLabel = language === 'creole' ? 'Créole' : 'Français';
  
  return `N° ${numericPart} - ${langLabel} - ${title}`;
};


// FONCTION: NUMÉROTATION DES STROPHES
/**
 * Numérote les strophes d'un chant avec détection automatique des refrains
 * 
 * Règles de numérotation:
 * - Les strophes normales sont numérotées: 1., 2., 3., etc.
 * - Les refrains sont marqués "Refrain" (français) ou "Refren" (créole)
 * - Les refrains ne sont PAS comptés dans la numérotation
 * 
 * @param slides - Toutes les strophes du chant
 * @param language - La langue du chant ('french' ou 'creole')
 * @returns Le texte complet du chant avec numérotation
 * 
 * Exemple avec le chant "Près de la croix":
 * Input: ["Jésus, garde-moi...", "Près de la croix...", "Près de la croix...", ...]
 * Output:
 *   1.
 *   Jésus, garde-moi...
 *   
 *   Refrain
 *   Près de la croix...
 *   
 *   2.
 *   Près de la croix...
 */
const numberSlides = (slides: string[], language: 'french' | 'creole'): string => {
  // Étape 1:Définir l'étiquette pour les refrains selon la langue
  const refrainLabel = language === 'creole' ? 'Refren' : 'Refrain';
  
  // Étape 2:Initialiser le compteur de strophes
  // Ce compteur n'est incrémenté QUE pour les strophes normales, pas les refrains
  let stropheNumber = 0;
  
  // Étape 3: Parcourir toutes les strophes et les numéroter
  return slides
    .map((slide, index) => {
      // Vérifier si cette strophe est un refrain
      if (isRefrain(slide, slides, index)) {
        // C'est un refrain: afficher "Refrain" ou "Refren"
        return `${refrainLabel}\n\n${slide}`;
      } else {
        // C'est une strophe normale: incrémenter le compteur et numéroter
        stropheNumber++;
        return `${stropheNumber}.\n\n${slide}`;
      }
    })
    .join('\n\n'); // Séparer chaque strophe par deux sauts de ligne
};


// FONCTION: TRANSFORMATION DES CHANTS
/**
 * Transforme les données brutes du JSON en objets Song utilisables
 * 
 * Cette fonction prend les chants du JSON et les convertit en objets
 * avec un format standardisé pour l'application
 * 
 * @param songsObject - L'objet contenant tous les chants (ex: data.chants["C.E.F"])
 * @param prefix - Le préfixe pour les IDs (ex: "cef" ou "cek")
 * @param language - La langue des chants ('french' ou 'creole')
 * @returns Un tableau d'objets Song prêts à être utilisés
 */
const transformSongs = (
  songsObject: Record<string, string[]>,
  prefix: string,
  language: 'french' | 'creole'
): Song[] => {
  return Object.entries(songsObject)
    .sort(([a], [b]) => {
      // Étape 1:On trie les chants par numéro dans l'ordre croissant
      // Extraire la partie numérique du numéro (ex: "43c" → 43)
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    })
    // Étape 2:Transformer chaque chant en objet Song
    .map(([number, slides], index) => {
      return {
        id: `${prefix}-${number}-${index}`,            // ID unique pour le chant
        number: "",                                    // Numéro vide (déjà dans le titre)
        title: extractTitle(slides, number, language), // Titre extrait intelligemment
        lyrics: numberSlides(slides, language),        // Paroles numérotées avec refrains
      };
    });
};

// CHARGER LES CHANTS DEPUIS LE FICHIER JSON
//Tous les chants en français (C.E.F)
export const frenchSongs: Song[] = transformSongs(data.chants["C.E.F"], "cef", "french");

//Tous les chants en créole (C.E.K)
export const creoleSongs: Song[] = transformSongs(data.chants["C.E.K"], "cek", "creole");



export const subCategories: SubCategory[] = [
  {
    id: 'category-french',
    name: 'Chants d\'Espérance - Français',
    creoleSongs: [],                         // Pas de chants créoles dans cette catégorie
    frenchSongs: frenchSongs,                // Tous les chants français
  },
  {
    id: 'category-creole',
    name: 'Chants d\'Espérance - Créole',
    creoleSongs: creoleSongs,                // Tous les chants créoles
    frenchSongs: [],                         // Pas de chants français dans cette catégorie
  },
];

// INFORMATIONS SUR LES CHANTS
// Exporter des statistiques utiles sur la collection de chants
export const stats = {
  totalSections: 2,                                      // Nombre de sections (français + créole)
  totalSongs: frenchSongs.length + creoleSongs.length,   // Nombre total de chants
  frenchSongsCount: frenchSongs.length,                  // Nombre de chants français
  creoleSongsCount: creoleSongs.length,                  // Nombre de chants créoles
  subCategoriesCount: subCategories.length,              // Nombre de sous-catégories
};