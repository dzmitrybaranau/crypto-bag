import { useTokenPricesStore, useUserStore } from "@/store";
import { useEffect, useMemo } from "react";
import { getTokenInfoFromHistory } from "@/utils/getTokenInfoFromHistory";
import calculateProfitAndLoss from "@/utils/calculateProfitAndLoss";

export const useTotalBalance = () => {
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
    if (!isUserLoading && !isPricesLoading) {
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

  const { tokensPnl, tokensInfo, tokensSpentBalance } = useMemo(() => {
    const tokensPnl: Record<string, number> = {};
    const tokensInfo: Record<string, { amount: number; lastPrice: string }> =
      {};
    const tokensSpentBalance: Record<string, number> = {};

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
          tokensInfo[tokenKey] = currentTokenInfo;
          const { usdtGained, usdtSpent, usdtAmountInHold } =
            calculateProfitAndLoss(tokenTransactions, {
              amount: currentTokenInfo.amount,
              currentPrice: tokenPrice,
            });

          tokensSpentBalance[tokenKey] = usdtSpent;
          tokensPnl[tokenKey] = usdtGained - usdtSpent + usdtAmountInHold;
        }
      });
    }

    return { tokensPnl, tokensInfo, tokensSpentBalance };
  }, [userAccount, isUserLoading, isPricesLoading, tokenKeys, tokenPrices]);

  const totalPnl = Object.values(tokensPnl).reduce(
    (prev, current) => current + prev,
    0,
  );

  const tokensTotalBalance = Object.values(tokensInfo).reduce(
    (prev, current) => prev + current.amount * parseFloat(current.lastPrice),
    0,
  );

  const tokensSpentUsdt = Object.values(tokensSpentBalance).reduce(
    (prev, current) => prev + current,
    0,
  );
  return {
    isUserLoading,
    isPricesLoading,
    totalPnl,
    tokensTotalBalance,
    tokensSpentUsdt,
  };
};
