import { create } from "zustand";
import WebApp from "@twa-dev/sdk";

interface Transaction {
  usdt: string;
  amount: string;
  price: string;
  date: string;
  type: "buy" | "sell";
}

export interface IToken {
  cmcId: string;
  price: string;
  id: string;
  symbol: string;
  name: string;
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
      [tokenId: string]: IToken;
    };
  };
  buyToken: ({
    usdt,
    amount,
    price,
    token,
  }: {
    usdt: string;
    amount: string;
    price: string;
    token: Omit<IToken, "transactionsHistory">;
  }) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userAccount: {
    tokens: {},
  },
  isUserLoading: true,
  isTmaInfoLoading: true,
  userTmaInfo: undefined,
  buyToken: ({ token, usdt, amount, price }) => {
    set((state) => {
      if (!state.userAccount) {
        return state;
      }

      const newTransaction: Transaction = {
        usdt,
        amount,
        price,
        date: new Date().toISOString(),
        type: "buy",
      };

      const updatedTokens = { ...state.userAccount.tokens };
      if (updatedTokens[token.id]) {
        updatedTokens[token.id].transactionsHistory.push(newTransaction);
      } else {
        updatedTokens[token.id] = {
          ...token,
          price,
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
