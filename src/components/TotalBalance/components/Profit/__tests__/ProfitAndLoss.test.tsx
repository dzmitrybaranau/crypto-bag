import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import ProfitAndLoss from "@/components/TotalBalance/components/Profit/ProfitAndLoss";
import { useTokenPricesStore, useUserStore } from "@/store";

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

describe("ProfitAndLoss Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useUserStore.mockImplementation((selector) => selector(userStoreMock));
    useTokenPricesStore.mockImplementation((selector) =>
      selector(tokenPricesStoreMock),
    );
  });

  test("renders loading state when data is loading", () => {
    useUserStore.mockImplementation((selector) =>
      selector({ ...userStoreMock, isUserLoading: true }),
    );
    render(<ProfitAndLoss />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders PnL correctly with calculated values", async () => {
    await act(async () => {
      render(<ProfitAndLoss />);
    });

    await waitFor(() => {
      expect(mockSetTokenPrice).toHaveBeenCalledTimes(2);
    });

    const pnlElement = screen.getByText(/PnL \+\$.*\(\+.*%\)/);
    expect(pnlElement).toBeInTheDocument();

    const expectedPnL = "+$500.00 (+5.00%)"; // Adjust this based on actual calculations
    expect(pnlElement).toHaveTextContent(expectedPnL);
  });

  test("calls setTokenPrice for each token", async () => {
    await act(async () => {
      render(<ProfitAndLoss />);
    });

    await waitFor(() => {
      expect(mockSetTokenPrice).toHaveBeenCalledTimes(2);
    });

    expect(mockSetTokenPrice).toHaveBeenCalledWith({
      tokenId: "BTC",
      tokenTransactionHistory: [
        { amount: "1", price: "30000", type: "buy", date: "2023-08-01" },
        { amount: "0.5", price: "35000", type: "sell", date: "2023-08-02" },
      ],
    });

    expect(mockSetTokenPrice).toHaveBeenCalledWith({
      tokenId: "ETH",
      tokenTransactionHistory: [
        { amount: "2", price: "2000", type: "buy", date: "2023-08-01" },
        { amount: "1", price: "2500", type: "sell", date: "2023-08-02" },
      ],
    });
  });

  test("handles case with no transactions gracefully", async () => {
    useUserStore.mockImplementation((selector) =>
      selector({
        userAccount: { tokenTransactions: {} },
        isUserLoading: false,
      }),
    );

    await act(async () => {
      render(<ProfitAndLoss />);
    });

    expect(screen.getByText("PnL $0.00 (0.00%)")).toBeInTheDocument();
  });

  test("handles case when tokenPrices is empty", async () => {
    useTokenPricesStore.mockImplementation((selector) =>
      selector({
        tokenPrices: {},
        setTokenPrice: mockSetTokenPrice,
        isLoading: false,
      }),
    );

    await act(async () => {
      render(<ProfitAndLoss />);
    });

    expect(screen.getByText("PnL $0.00 (0.00%)")).toBeInTheDocument();
  });
});
