import { create } from "zustand";
import WebApp from "@twa-dev/sdk";

interface UserStore {
  isTmaInfoLoading: boolean;
  isUserLoading: boolean;
  userTmaInfo?: typeof WebApp.initDataUnsafe;
  fetchUserAccount: (chatId: string) => Promise<void>;
  setUserTmaInfo: (userTmaInfo: typeof WebApp.initDataUnsafe) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userAccount: undefined,
  isUserLoading: true,
  isTmaInfoLoading: true,
  userTmaInfo: undefined,
  fetchUserAccount: async (chatId: string) => {},
  setUserTmaInfo: (userTmaInfo: typeof WebApp.initDataUnsafe) => {
    set({ userTmaInfo, isTmaInfoLoading: false });
  },
}));
