import { create } from 'zustand';
import { FoodsList } from '../types/types';

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
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  foodsList: FoodsList[];
  setFoodsList: (foods: FoodsList[]) => void;
}

export const useFoodStore = create<FoodStore>((set) => ({
  foodName: '',
  setFoodName: (name) => set({ foodName: name }),
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),
  selectedRestaurant: '',
  setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  foodsList: [],
  setFoodsList: (foods) => set({ foodsList: foods }),
}));
