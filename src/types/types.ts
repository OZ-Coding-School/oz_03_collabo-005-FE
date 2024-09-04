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
  image_url: string | null;
  food_name: string;
  cost_preference: number;
  cost_weight: number;
  flour_rice_preference: number;
  intensity_preference: number;
  is_date: boolean;
  is_diet: boolean;
  is_dinner: boolean;
  is_lunch: boolean;
  is_party: boolean;
  is_snack: boolean;
  oily_preference: number;
  rank: number;
  spicy_preference: number;
  spicy_weight: number;
  food_id: number;
}

export type FoodsListStore = {
  foodsList: FoodsList[] | null;
  setFoodsList: (newFoodsList: FoodsList[] | null) => void;
};
