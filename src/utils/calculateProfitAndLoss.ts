import { ITokenTransaction } from "@/store/useUserStore/useUserStore";

function calculateProfitLoss(
  transactions: ITokenTransaction[],
  currentData: { amount: number; currentPrice: number },
) {
  let usdtSpent = 0;
  let usdtGained = 0;

  transactions.forEach((transaction) => {
    const amount = parseFloat(transaction.amount);
    const price = parseFloat(transaction.price);
    const usdt = amount * price;

    if (transaction.type === "buy") {
      usdtSpent += usdt;
    } else if (transaction.type === "sell") {
      usdtGained += usdt;
    }
  });

  return {
    usdtAmountInHold: currentData.amount * currentData.currentPrice,
    usdtSpent,
    usdtGained,
  };
}

export default calculateProfitLoss;
