import { create } from "zustand";
import WebApp from "@twa-dev/sdk";

interface Transaction {
  usdt: string;
  amount: string;
  price: string;
  date: string;
  type: "buy" | "sell";
}

interface Token {
  transactionsHistory: Transaction[];
}

interface UserStore {
  isTmaInfoLoading: boolean;
  isUserLoading: boolean;
  userTmaInfo?: typeof WebApp.initDataUnsafe;
  fetchUserAccount: (chatId: string) => Promise<void>;
  setUserTmaInfo: (userTmaInfo: typeof WebApp.initDataUnsafe) => void;
  userAccount?: {
    tokens: {
      [tokenId: string]: Token;
    };
  };
  buyToken: ({
    tokenId,
    date,
    usdt,
    amount,
    price,
  }: {
    tokenId: string;
    usdt: string;
    amount: string;
    price: string;
    date: string;
  }) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userAccount: {
    tokens: {},
  },
  isUserLoading: true,
  isTmaInfoLoading: true,
  userTmaInfo: undefined,
  buyToken: ({ tokenId, date, usdt, amount, price }) => {
    set((state) => {
      if (!state.userAccount) {
        return state;
      }

      const newTransaction: Transaction = {
        usdt,
        amount,
        price,
        date,
        type: "buy",
      };

      const updatedTokens = { ...state.userAccount.tokens };
      if (updatedTokens[tokenId]) {
        updatedTokens[tokenId].transactionsHistory.push(newTransaction);
      } else {
        updatedTokens[tokenId] = {
          transactionsHistory: [newTransaction],
        };
      }

      return {
        ...state,
        userAccount: {
          ...state.userAccount,
          tokens: updatedTokens,
        },
      };
    });
  },
  fetchUserAccount: async (chatId: string) => {
    // Implementation for fetching user account
  },
  setUserTmaInfo: (userTmaInfo: typeof WebApp.initDataUnsafe) => {
    set({ userTmaInfo, isTmaInfoLoading: false });
  },
}));
