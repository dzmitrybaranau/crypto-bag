import { StoreApi } from "zustand";
import {
  ITokenTransaction,
  UserStore,
} from "@/store/useUserStore/useUserStore";

export const buyToken = ({
  tokenId,
  amount,
  set,
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
};
