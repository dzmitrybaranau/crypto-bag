import { ITokenTransaction } from "@/store/useUserStore/useUserStore";
import calculateProfitAndLoss from "@/utils/calculateProfitAndLoss";

describe("calculateProfitLoss", () => {
  it("should calculate the correct profit/loss for a given set of transactions", () => {
    const transactions: ITokenTransaction[] = [
      { amount: "1", price: "10000", date: "2023-01-01", type: "buy" },
      { amount: "2", price: "15000", date: "2023-02-01", type: "buy" },
    ];

    const result = calculateProfitAndLoss(transactions);

    expect(result).toBeCloseTo(8000, 2); // The expected profit/loss is $8,000
  });
});
