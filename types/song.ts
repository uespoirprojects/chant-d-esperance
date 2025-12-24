// Types pour les chants
export interface Song {
  id: string;
  title: string;
  number?: string;
  lyrics?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  creoleSongs: Song[];
  frenchSongs: Song[];
}

