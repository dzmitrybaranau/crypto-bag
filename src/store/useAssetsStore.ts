import { create } from "zustand";

export interface ICoinAsset {
  name: string;
  history: { price: number; amount: number; timestamp: string }[];
  price: number;
  amount: number;
}

interface IAssetsStore {
  coinAssets: ICoinAsset[];
  addCoinAsset: (coin: ICoinAsset) => void;
  editCoinAsset: (coin: ICoinAsset) => void;
  deleteCoinAsset: (coin: ICoinAsset) => void;
}

export const useAssetsStore = create<IAssetsStore>((set) => ({
  coinAssets: [],
  addCoinAsset: (newCoin) => {
    set((state) => ({
      ...state,
      coinAssets: [...state.coinAssets, newCoin],
    }));
  },
  editCoinAsset: (editedCoin) => {
    set((state) => ({
      ...state,
      coinAssets: state.coinAssets.map((coin) =>
        coin.name === editedCoin.name
          ? { ...coin, price: editedCoin.price, amount: editedCoin.amount }
          : coin,
      ),
    }));
  },
  deleteCoinAsset: (coinToRemove) => {
    set((state) => ({
      ...state,
      coinAssets: state.coinAssets.filter(
        (coin) => coin.name !== coinToRemove.name,
      ),
    }));
  },
}));
