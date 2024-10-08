import { create } from "zustand";
import WebApp from "@twa-dev/sdk";
import { tokenTransaction } from "@/store/useUserStore/tokenTransaction";
import { fetchUserAccount } from "@/store/useUserStore/fetchUserAccount";

export interface ITokenTransaction {
  amount: string;
  price: string;
  date: string;
  type: "buy" | "sell";
}

export interface IToken {
  id: string;
  cmcId: string;
  symbol: string;
  name: string;
  latestMarketPrice: number;
}

export interface IUserAccount {
  id?: string;
  tokenTransactions: {
    [tokenId: string]: ITokenTransaction[];
  };
}

export interface UserStore {
  isTmaInfoLoading: boolean;
  isUserLoading: boolean;
  userTmaInfo?: typeof WebApp.initDataUnsafe;
  fetchUserAccount: (userId: string) => Promise<void>;
  setUserTmaInfo: (userTmaInfo: typeof WebApp.initDataUnsafe) => void;
  userAccount?: IUserAccount;
  createTokenTransaction: ({
    amount,
    price,
    tokenId,
    userId,
    type,
    dateISO,
  }: {
    tokenId: string;
    price: string;
    amount: string;
    userId: string;
    type: "sell" | "buy";
    dateISO?: string;
  }) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userAccount: {
    tokenTransactions: {},
    id: undefined,
  },
  isUserLoading: true,
  isTmaInfoLoading: true,
  userTmaInfo: undefined,
  createTokenTransaction: ({ tokenId, amount, price, userId, type }) =>
    tokenTransaction({ set, tokenId, amount, price, type, userId }),
  fetchUserAccount: async (userId: string) => fetchUserAccount({ set, userId }),
  setUserTmaInfo: (userTmaInfo: typeof WebApp.initDataUnsafe) => {
    set({ userTmaInfo, isTmaInfoLoading: false });
  },
}));
