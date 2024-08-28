import create from 'zustand';

export interface SearchResult {
  id: string;
  name: string;
  number: string;
  address: string;
  distance: string;
  url: string;
  x: string;
  y: string;
}

interface FoodStore {
  foodName: string;
  setFoodName: (name: string) => void;
  searchResults: SearchResult[];
  setSearchResults: (results: SearchResult[]) => void;
  selectedRestaurant: string;
  setSelectedRestaurant: (restaurant: string) => void;
}

export const useFoodStore = create<FoodStore>((set) => ({
  foodName: '',
  setFoodName: (name) => set({ foodName: name }),
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),
  selectedRestaurant: '',
  setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),
}));
