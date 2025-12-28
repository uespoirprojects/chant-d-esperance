import { Song, SubCategory } from '@/types/song';
import songsData from './chantsdesperance.json';

// Interface pour la structure du JSON brut
interface SongsDataJson {
  Sections: Array<[number, string, number]>;
  Chants: Array<[number, number, string, string]>;
}

// Cast du JSON importé
const data = songsData as SongsDataJson;

// Fonction pour transformer les données brutes en format utilisable
const transformSongs = (rawSongs: Array<[number, number, string, string]>, sectionId: number): Song[] => {
  return rawSongs
    .map((song, index) => ({ song, originalIndex: index })) // Garder l'index original
    .filter(({ song }) => song[0] === sectionId)
    .map(({ song, originalIndex }) => ({
      id: `song-${song[0]}-${song[1]}-${originalIndex}`, // Utiliser l'index original pour l'unicité
      number: String(song[1]),
      title: song[2],
      lyrics: song[3],
    }));
};

// Extraire les sections et chants
const sections = data.Sections;
const rawSongs = data.Chants;

// Section 1: Chant D'Espérance Français
export const frenchSongs: Song[] = transformSongs(rawSongs, 1);

// Section 2: Chant D'Espérance Créole
export const creoleSongs: Song[] = transformSongs(rawSongs, 2);

// Créer les sous-catégories (sections 3-14)
export const subCategories: SubCategory[] = sections
  .slice(2) // Ignorer les 2 premières sections (Français et Créole)
  .map((section) => {
    const sectionId = section[0];
    const sectionName = section[1];
    
    // Tous les chants de cette section
    const allSongsInSection = transformSongs(rawSongs, sectionId);
    
    // Déterminer si c'est une section avec langue spécifique
    const isCreoleSection = sectionName.toLowerCase().includes('créole') || 
                           sectionName.toLowerCase().includes('creole');
    const isFrenchSection = sectionName.toLowerCase().includes('français') || 
                           sectionName.toLowerCase().includes('francais');
    
    let creoleSongs: Song[] = [];
    let frenchSongs: Song[] = [];
    
    if (isCreoleSection) {
      // Section uniquement créole
      creoleSongs = allSongsInSection;
      frenchSongs = [];
    } else if (isFrenchSection) {
      // Section uniquement français
      creoleSongs = [];
      frenchSongs = allSongsInSection;
    } else {
      // Section mixte - tous les chants vont dans français par défaut
      creoleSongs = [];
      frenchSongs = allSongsInSection;
    }
    
    return {
      id: `category-${sectionId}`,
      name: sectionName,
      creoleSongs,
      frenchSongs,
    };
  });

// Export des statistiques
export const stats = {
  totalSections: sections.length,
  totalSongs: rawSongs.length,
  frenchSongsCount: frenchSongs.length,
  creoleSongsCount: creoleSongs.length,
  subCategoriesCount: subCategories.length,
};