import {
  ITokenTransaction,
  UserStore,
} from "@/store/useUserStore/useUserStore";
import { StoreApi } from "zustand";

export const sellToken = ({
  set,
  tokenId,
  amount,
  price,
}: {
  tokenId: string;
  price: string;
  amount: string;
  set: StoreApi<UserStore>["setState"];
}) => {
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
};
