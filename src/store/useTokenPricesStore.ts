import { create } from "zustand";
import { getTokenPriceFromBinance } from "@/utils/getTokenPriceFromBinance";
import { getTokenInfoFromHistory } from "@/utils/getTokenInfoFromHistory";
import { ITokenTransaction } from "@/store/useUserStore";

interface ITokenPricesStore {
  tokenPrices: {
    [tokenId: string]: number;
  };
  setTokenPrice: ({
    tokenId,
  }: {
    tokenId: string;
    tokenTransactionHistory?: ITokenTransaction[];
  }) => void;
  isLoading: boolean;
}

export const useTokenPricesStore = create<ITokenPricesStore>((set) => ({
  tokenPrices: {},
  isLoading: false,
  setTokenPrice: async ({ tokenId, tokenTransactionHistory }) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const price = await getTokenPriceFromBinance({
        tokenSymbol: tokenId,
      });
      set((state) => ({
        ...state,
        tokenPrices: {
          ...state.tokenPrices,
          [tokenId]: price,
        },
      }));
    } catch (e) {
      if (
        tokenTransactionHistory?.length &&
        tokenTransactionHistory?.length > 0
      ) {
        const { lastPrice } = getTokenInfoFromHistory(tokenTransactionHistory);
        set((state) => ({
          ...state,
          tokenPrices: {
            ...state.tokenPrices,
            [tokenId]: parseFloat(lastPrice),
          },
        }));
      }
    } finally {
      set((state) => ({
        ...state,
        isLoading: false,
      }));
    }
  },
}));
