import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { FoodsListStore } from '../types/types';

export const useFoodsListStore = create(
  persist<FoodsListStore>(
    (set) => ({
      foodsList: [],
      setFoodsList: (newFoodsList) => set({ foodsList: newFoodsList }),
    }),
    {
      name: 'foodsList-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
