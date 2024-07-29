import { create } from "zustand";
import { getTokenPriceFromBinance } from "@/utils/getTokenPriceFromBinance";

interface ITokenPricesStore {
  tokenPrices: {
    [tokenId: string]: number;
  };
  setTokenPrice: ({ tokenId }: { tokenId: string }) => void;
  isLoading: boolean;
}

export const useTokenPricesStore = create<ITokenPricesStore>((set) => ({
  tokenPrices: {},
  isLoading: false,
  setTokenPrice: async ({ tokenId }) => {
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
    } finally {
      set((state) => ({
        ...state,
        isLoading: false,
      }));
    }
  },
}));
