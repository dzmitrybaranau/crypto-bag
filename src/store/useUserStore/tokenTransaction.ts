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
  try {
    const response = await axios.post("/api/tokenTransaction", {
      userId,
      tokenSymbol: tokenId,
      tokenName: tokenId,
      amount: parseFloat(amount),
      price: parseFloat(price),
      type,
    });

    const { transaction } = response.data;

    set((state) => {
      if (!state.userAccount) {
        return state;
      }

      const newTransaction: ITokenTransaction = {
        amount,
        price,
        date: new Date().toISOString(),
        type,
        id: transaction.id,
      };

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
  } catch (error) {
    console.error("Error buying token:", error);
  }
};
