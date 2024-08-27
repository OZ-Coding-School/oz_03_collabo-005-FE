import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { FoodsListStore, User, UserStore } from '../types/types';

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      user: undefined,
      setUser: (newUser: User | undefined) => set({ user: newUser }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

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
