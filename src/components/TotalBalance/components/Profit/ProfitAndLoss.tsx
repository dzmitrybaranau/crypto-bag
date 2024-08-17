"use client";
import React, { useEffect, useMemo } from "react";
import styles from "./Profit.module.scss";
import { useUserStore } from "@/store";
import { useTokenPricesStore } from "@/store/useTokenPricesStore/useTokenPricesStore";

export interface IProfitProps {}

/**
 * Whole profit
 */
function ProfitAndLoss(props: IProfitProps) {
  const userAccount = useUserStore((state) => state.userAccount);
  const isUserLoading = useUserStore((state) => state.isUserLoading);
  const tokenKeys = useMemo(
    () => Object.keys(userAccount?.tokenTransactions ?? {}),
    [userAccount],
  );
  const {
    tokenPrices,
    setTokenPrice,
    isLoading: isPricesLoading,
  } = useTokenPricesStore();

  console.log({ userAccount, isUserLoading, tokenKeys });
  // Fetch the latest prices for each token
  useEffect(() => {
    if (!isUserLoading) {
      tokenKeys.forEach((tokenId) => {
        setTokenPrice({
          tokenId,
          tokenTransactionHistory: userAccount?.tokenTransactions[tokenId],
        });
      });
    }
  }, [tokenKeys, setTokenPrice, userAccount?.tokenTransactions, isUserLoading]);

  const pnl = useMemo(() => {
    if (!userAccount || isUserLoading || isPricesLoading) return {};

    return tokenKeys.reduce((acc, tokenId) => {
      const transactions = userAccount.tokenTransactions[tokenId] || [];
      let totalBought = 0;
      let totalSold = 0;
      let amountLeft = 0;

      transactions.forEach((transaction) => {
        const { type, amount, price } = transaction;
        const amountNumber = parseFloat(amount);
        const priceNumber = parseFloat(price);

        if (type === "buy") {
          totalBought += amountNumber * priceNumber;
          amountLeft += amountNumber;
        } else if (type === "sell") {
          totalSold += amountNumber * priceNumber;
          amountLeft -= amountNumber;
        }
      });

      const currentPrice = tokenPrices[tokenId] || 0;
      const currentValue = amountLeft * currentPrice;
      const profitOrLoss = totalSold + currentValue - totalBought;
      const profitOrLossPercentage = (profitOrLoss / totalBought) * 100;

      // @ts-ignore
      acc[tokenId] = {
        usdt: profitOrLoss.toFixed(2),
        percentage: profitOrLossPercentage.toFixed(2),
      };

      return acc;
    }, {});
  }, [userAccount, isUserLoading, isPricesLoading, tokenKeys, tokenPrices]);

  if (isUserLoading || isPricesLoading) {
    return <div className={styles.root}>Loading...</div>;
  }

  // @ts-ignore
  const totalPnL: { usdt: number; percentage: number } = Object.values(
    pnl,
  ).reduce(
    // @ts-ignore
    (acc, { usdt, percentage }) => {
      // @ts-ignore
      acc.usdt += parseFloat(usdt);
      // @ts-ignore
      acc.percentage += parseFloat(percentage);
      return acc;
    },
    { usdt: 0, percentage: 0 },
  );

  // TODO:
  // Get all transactions for the token in the chosen time span
  // Calculate USDT spent on buying + calculate USDT gained selling + sum leftovers with current price
  // it should look like this {ETH: {usdt: <profit or loss number>, percentage: <profit or loss percentage>}}
  // Sum all tokens BUY/Sell/Rest to calculate overall portfolio Amount and profit and Loss

  return (
    <div className={styles.root}>
      PnL ${totalPnL.usdt.toFixed(2)} ({totalPnL.percentage.toFixed(2)}%)
    </div>
  );
}

export default ProfitAndLoss;
