// 임시 user
export interface User {
  id: number;
  nickname: string;
  profileImageUrl: string | undefined;
  ftiType?: string | undefined;
  introduce?: string | undefined;
  spicy_preference?: number | null;
}

export interface UserStore {
  user: User | undefined;
  setUser: (newUser: User | undefined) => void;
}

export interface FoodsList {
  id: number;
  imageUrl: string;
  name: string;
}

export type FoodsListStore = {
  foodsList: FoodsList[];
  setFoodsList: (newFoodsList: FoodsList[]) => void;
};
