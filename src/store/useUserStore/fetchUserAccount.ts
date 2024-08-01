import { StoreApi } from "zustand";
import { IUserAccount, UserStore } from "@/store/useUserStore/useUserStore";
import axios from "axios";
import { Database } from "@/types/database.types";

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

export const fetchUserAccount = async ({
  set,
  userId,
}: {
  userId: string;
  set: StoreApi<UserStore>["setState"];
}) => {
  try {
    set((state) => ({ ...state, isUserLoading: true }));
    const data = await axios.get<{
      id: string;
      transactions: Database["public"]["Tables"]["transactions"]["Row"][];
    }>(`/api/getUser?userId=${userId}`);
    const transactions = transformTransactions(data.data.transactions);
    set((state) => ({
      ...state,
      userAccount: {
        id: data.data.id,
        tokenTransactions: transactions,
      },
      isUserLoading: false,
    }));
  } catch (err) {
    console.log("ERROR", err);
    set((state) => ({ ...state, isUserLoading: false }));
  } finally {
    set((state) => ({ ...state, isUserLoading: false }));
  }
};
