import { useTokenPricesStore, useUserStore } from "@/store";
import { renderHook } from "@testing-library/react";
import { useTotalBalance } from "@/components/TotalBalance/hooks/useTotalBalance";

const mockSetTokenPrice = jest.fn();

const tokenPricesStoreMock = {
  tokenPrices: { BTC: 34000, ETH: 2400 },
  setTokenPrice: mockSetTokenPrice,
  isLoading: false,
};

const userStoreMock = {
  userAccount: {
    tokenTransactions: {
      BTC: [
        { amount: "1", price: "30000", type: "buy", date: "2023-08-01" },
        { amount: "0.5", price: "35000", type: "sell", date: "2023-08-02" },
      ],
      ETH: [
        { amount: "2", price: "2000", type: "buy", date: "2023-08-01" },
        { amount: "1", price: "2500", type: "sell", date: "2023-08-02" },
      ],
    },
  },
  isUserLoading: false,
};

jest.mock("@/store", () => ({
  useUserStore: jest.fn(),
  useTokenPricesStore: jest.fn(),
}));

describe("useTotalBalance", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useUserStore.mockImplementation((selector) => selector(userStoreMock));
    useTokenPricesStore.mockReturnValue(tokenPricesStoreMock);
  });

  test("it should return", () => {
    // BTC balance = -30000 + 17500 + 0.5 * 34000 = 4500
    // ETH balance = -4000 + 2500 + 1*2400 = 900
    const { result } = renderHook(useTotalBalance);
    console.log({ t: result.current.tokensPnl });
    expect(result.current.totalPnl).toBe(5400);
  });
});
