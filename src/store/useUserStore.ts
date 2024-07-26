import { create } from "zustand";
import WebApp from "@twa-dev/sdk";

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

interface IUserAccount {
  chatId?: string;
  tokenTransactions: {
    [tokenId: string]: ITokenTransaction[];
  };
}

interface UserStore {
  isTmaInfoLoading: boolean;
  isUserLoading: boolean;
  userTmaInfo?: typeof WebApp.initDataUnsafe;
  fetchUserAccount: (chatId: string) => Promise<void>;
  setUserTmaInfo: (userTmaInfo: typeof WebApp.initDataUnsafe) => void;
  userAccount?: IUserAccount;
  sellToken: ({
    amount,
    price,
    tokenId,
  }: {
    tokenId: string;
    price: string;
    amount: string;
  }) => void;
  buyToken: ({
    amount,
    price,
    tokenId,
  }: {
    tokenId: string;
    price: string;
    amount: string;
  }) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userAccount: {
    tokenTransactions: {},
    chatId: undefined,
  },
  isUserLoading: true,
  isTmaInfoLoading: true,
  userTmaInfo: undefined,
  sellToken: ({ tokenId, amount, price }) => {
    set((state) => {
      if (!state.userAccount) {
        return state;
      }
      const newTransaction: ITokenTransaction = {
        amount,
        price,
        date: new Date().toISOString(),
        type: "sell",
      };

      return {
        ...state,
        userAccount: {
          ...state.userAccount,
          tokenTransactions: {
            ...state.userAccount.tokenTransactions,
            [tokenId]: [
              ...(state.userAccount?.tokenTransactions?.[tokenId] ?? []),
              newTransaction,
            ],
          },
        },
      };
    });
  },
  buyToken: ({ tokenId, amount, price }) => {
    set((state) => {
      if (!state.userAccount) {
        return state;
      }
      const newTransaction: ITokenTransaction = {
        amount,
        price,
        date: new Date().toISOString(),
        type: "buy",
      };

      return {
        ...state,
        userAccount: {
          ...state.userAccount,
          tokenTransactions: {
            ...state.userAccount.tokenTransactions,
            [tokenId]: [
              ...(state.userAccount?.tokenTransactions?.tokenId ?? []),
              newTransaction,
            ],
          },
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
