"use client";
import React, { useEffect, useMemo } from "react";
import styles from "./Profit.module.scss";
import { useUserStore, useTokenPricesStore } from "@/store";
import { getTokenInfoFromHistory } from "@/utils/getTokenInfoFromHistory";
import calculateProfitAndLoss from "@/utils/calculateProfitAndLoss";

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

  // Fetch the latest prices for each token
  useEffect(() => {
    if (!isUserLoading) {
      tokenKeys.forEach((tokenId) => {
        if (!tokenPrices[tokenId]) {
          setTokenPrice({
            tokenId,
            tokenTransactionHistory: userAccount?.tokenTransactions[tokenId],
          });
        }
      });
    }
  }, [
    tokenKeys,
    tokenPrices,
    setTokenPrice,
    userAccount?.tokenTransactions,
    isUserLoading,
  ]);

  const tokensPnl = useMemo(() => {
    const tokensPnl: Record<string, number> = {};
    if (
      !isUserLoading &&
      !isPricesLoading &&
      Object.keys(tokenPrices).length !== 0
    ) {
      tokenKeys.forEach((tokenKey) => {
        const tokenTransactions = userAccount?.tokenTransactions[tokenKey];
        if (tokenTransactions) {
          const tokenPrice = tokenPrices[tokenKey];
          const currentTokenInfo = getTokenInfoFromHistory(tokenTransactions);
          const { usdtGained, usdtSpent, usdtAmountInHold } =
            calculateProfitAndLoss(tokenTransactions, {
              amount: currentTokenInfo.amount,
              currentPrice: tokenPrice,
            });

          tokensPnl[tokenKey] = usdtGained - usdtSpent + usdtAmountInHold;
        }
      });
    }

    return tokensPnl;
  }, [userAccount, isUserLoading, isPricesLoading, tokenKeys, tokenPrices]);

  if (isUserLoading || isPricesLoading) {
    return <div className={styles.root}>Loading...</div>;
  }

  const totalPnl = Object.values(tokensPnl).reduce(
    (prev, current) => current + prev,
    0,
  );

  return <div className={styles.root}>PnL ${totalPnl.toFixed(2)}</div>;
}

export default ProfitAndLoss;
