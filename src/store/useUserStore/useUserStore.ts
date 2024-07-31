import { create } from "zustand";
import WebApp from "@twa-dev/sdk";
import { sellToken } from "@/store/useUserStore/sellToken";
import { buyToken } from "@/store/useUserStore/buyToken";
import axios from "axios";
import { Database } from "@/types/database.types";

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

export interface UserStore {
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

type TransactionRow = Database["public"]["Tables"]["transactions"]["Row"];

const transformTransactions = (
  transactions: TransactionRow[],
): IUserAccount["tokenTransactions"] => {
  return transactions.reduce(
    (acc, transaction) => {
      const { token_symbol, amount, date, id, price, type } = transaction;
      if (!token_symbol) return acc;

      if (!acc[token_symbol]) {
        acc[token_symbol] = [];
      }

      acc[token_symbol].push({
        amount: amount.toString(),
        date,
        price: price.toString(),
        type: type as "buy" | "sell",
      });

      return acc;
    },
    {} as IUserAccount["tokenTransactions"],
  );
};

export const useUserStore = create<UserStore>((set) => ({
  userAccount: {
    tokenTransactions: {},
    chatId: undefined,
  },
  isUserLoading: true,
  isTmaInfoLoading: true,
  userTmaInfo: undefined,
  sellToken: ({ tokenId, amount, price }) =>
    sellToken({
      amount,
      price,
      tokenId,
      set,
    }),
  buyToken: ({ tokenId, amount, price }) =>
    buyToken({ set, tokenId, amount, price }),
  fetchUserAccount: async (chatId: string) => {
    try {
      console.log("Fetch user!", chatId);
      set((state) => ({ ...state, isUserLoading: true }));
      const data = await axios.get<{
        id: string;
        transactions: Database["public"]["Tables"]["transactions"]["Row"][];
      }>(`/api/getUser?chatId=${chatId}`);
      const transactions = transformTransactions(data.data.transactions);
      set((state) => ({
        ...state,
        userAccount: {
          chatId: data.data.id,
          tokenTransactions: transactions,
        },
        isUserLoading: false,
      }));
    } catch (err) {
      console.log("ERROR", err);
    } finally {
      set((state) => ({ ...state, isUserLoading: false }));
    }
  },
  setUserTmaInfo: (userTmaInfo: typeof WebApp.initDataUnsafe) => {
    set({ userTmaInfo, isTmaInfoLoading: false });
  },
}));
