// 임시 user
export interface User {
  id: number;
  nickname: string;
  profileImageUrl: string | undefined;
  ftiType?: string | undefined;
  introduce?: string | undefined;
}

export type UserStore = {
  user: User | undefined;
  setUser: (newUser: User | undefined) => void;
};
