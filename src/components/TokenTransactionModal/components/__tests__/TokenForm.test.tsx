import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import TokenForm from "@/components/TokenTransactionModal/components/TokenForm";
import { useUserStore } from "@/store";
import { useTokenPricesStore } from "@/store/useTokenPricesStore";
import selectEvent from "react-select-event";
import { ITokenTransaction } from "@/store/useUserStore";

jest.mock("@/store/useUserStore", () => ({
  useUserStore: jest.fn(() => {
    const transaction: ITokenTransaction = {
      amount: "100",
      price: "32000",
      type: "buy",
      date: new Date().toISOString(),
    };
    return {
      tokenTransactions: {
        BTC: [transaction],
      },
    };
  }),
}));

jest.mock("@/store/useTokenPricesStore", () => ({
  useTokenPricesStore: jest.fn(() => ({
    tokenPrices: { BTC: 1 },
    setTokenPrice: jest.fn(),
    isLoading: false,
  })),
}));
describe("TokenForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      tokenTransactions: {
        BTC: [
          {
            amount: "100",
            price: "32000",
            type: "buy",
            date: new Date().toISOString(),
          },
        ],
      },
    });

    (useTokenPricesStore as unknown as jest.Mock).mockReturnValue({
      tokenPrices: { BTC: 1 },
      setTokenPrice: jest.fn(),
      isLoading: false,
    });
  });

  const renderComponent = (type: "buy" | "sell" = "buy") => {
    return render(
      <TokenForm onSubmit={mockOnSubmit} onClose={mockOnClose} type={type} />,
    );
  };

  xtest("renders correctly", () => {
    renderComponent();
    expect(screen.getByText("Token")).toBeInTheDocument();
    expect(screen.getByText("USDT ($)")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
  });

  xtest("calls onClose when close button is clicked", () => {
    renderComponent();
    const closeButton = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  xtest("calls handleSubmit when form is submitted", () => {
    renderComponent();
    const form = screen.getByRole("form");
    fireEvent.submit(form);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  test("handles valid decimal input", () => {
    renderComponent();
    const input = screen.getByLabelText("USDT ($)");
    fireEvent.change(input, { target: { value: "0.5" } });
    expect(input).toHaveAttribute("value", "0.5");
  });

  test("handles invalid input", () => {
    renderComponent();
    const input = screen.getByLabelText("USDT ($)");
    fireEvent.change(input, { target: { value: "abc" } });
    expect(input).toHaveAttribute("value", "");
  });

  test("prevents negative numbers", () => {
    renderComponent();
    const input = screen.getByLabelText("USDT ($)");
    fireEvent.change(input, { target: { value: "-5" } });
    expect(input).toHaveAttribute("value", "0");
  });

  test("calculates amount when USDT is entered (buy)", () => {
    renderComponent("buy");
    const usdtInputField = screen.getByLabelText("USDT ($)");
    const amountInputField = screen.getByLabelText("Amount");
    const priceInputField = screen.getByLabelText("Price");

    fireEvent.change(priceInputField, { target: { value: "2" } });
    fireEvent.change(usdtInputField, { target: { value: "10" } });

    expect(amountInputField).toHaveAttribute("value", "5");
  });

  test("calculates USDT when amount is entered (buy)", () => {
    renderComponent("buy");
    const usdtInputField = screen.getByLabelText("USDT ($)");
    const amountInputField = screen.getByLabelText("Amount");
    const priceInputField = screen.getByLabelText("Price");

    fireEvent.change(priceInputField, { target: { value: "2" } });
    fireEvent.change(amountInputField, { target: { value: "5" } });

    expect(usdtInputField).toHaveAttribute("value", "10");
  });

  test("limits amount when selling", async () => {
    const container = renderComponent("sell");
    const select = container.container.querySelector('[id="token"]');
    const amountInputField = screen.getByLabelText("Amount");

    await selectEvent.select(select as HTMLElement, "BTC");

    fireEvent.change(amountInputField, { target: { value: "150" } });

    expect(amountInputField).toHaveAttribute("value", "100");
  });

  test("calculates price when USDT and amount are entered", () => {
    renderComponent("buy");
    const usdtInputField = screen.getByLabelText("USDT ($)");
    const amountInputField = screen.getByLabelText("Amount");
    const priceInputField = screen.getByLabelText("Price");

    fireEvent.change(usdtInputField, { target: { value: "10" } });
    fireEvent.change(amountInputField, { target: { value: "5" } });

    expect(priceInputField).toHaveAttribute("value", "2");
  });
});
