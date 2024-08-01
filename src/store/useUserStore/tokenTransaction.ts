import { StoreApi } from "zustand";
import {
  ITokenTransaction,
  UserStore,
} from "@/store/useUserStore/useUserStore";
import axios from "axios";

export const tokenTransaction = async ({
  tokenId,
  amount,
  set,
  price,
  userId,
  type,
}: {
  userId: string;
  tokenId: string;
  price: string;
  amount: string;
  set: StoreApi<UserStore>["setState"];
  type: "buy" | "sell";
}) => {
  const newTransaction: ITokenTransaction = {
    amount,
    price,
    date: new Date().toISOString(),
    type,
  };

  set((state) => {
    if (!state.userAccount) {
      return state;
    }

    return {
      ...state,
      userAccount: {
        ...state.userAccount,
        tokenTransactions: {
          ...state.userAccount.tokenTransactions,
          [tokenId]: [
            ...(state.userAccount.tokenTransactions[tokenId] || []),
            newTransaction,
          ],
        },
      },
    };
  });

  try {
    await axios.post("/api/tokenTransaction", {
      userId,
      tokenSymbol: tokenId,
      tokenName: tokenId,
      amount: parseFloat(amount),
      price: parseFloat(price),
      type,
    });
  } catch (error) {
    set((state) => {
      if (!state.userAccount) {
        return state;
      }

      return {
        ...state,
        userAccount: {
          ...state.userAccount,
          tokenTransactions: {
            ...state.userAccount.tokenTransactions,
            [tokenId]: [
              ...(state.userAccount.tokenTransactions[tokenId] || []).filter(
                (transaction) => transaction.date === newTransaction.date,
              ),
            ],
          },
        },
      };
    });
    console.error("Error buying token:", error);
  }
};
