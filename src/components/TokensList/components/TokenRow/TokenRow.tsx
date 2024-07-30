import React, { useEffect, useState } from "react";
import styles from "./TokenRow.module.scss";
import { ITokenTransaction } from "@/store/useUserStore";
import { getTokenById } from "@/utils/getTokenById";
import { getTokenInfoFromHistory } from "@/utils/getTokenInfoFromHistory";
import { useTokenPricesStore } from "@/store/useTokenPricesStore";
import { formatDecimals } from "@/utils/formatDecimals";

export interface ITokenRowProps {
  tokenId: string;
  tokenTransactions: ITokenTransaction[];
}

/**
 * Token Row
 */
function TokenRow({ tokenTransactions, tokenId }: ITokenRowProps) {
  const token = getTokenById(tokenId);
  const { amount, lastPrice } = getTokenInfoFromHistory(tokenTransactions);
  const {
    tokenPrices,
    setTokenPrice,
    isLoading: isLoadingTokenPrice,
  } = useTokenPricesStore((state) => ({
    ...state,
  }));

  useEffect(() => {
    const getPairPrice = () => {
      if (!tokenPrices[tokenId]) {
        return setTokenPrice({
          tokenId,
          tokenTransactionHistory: tokenTransactions,
        });
      }
    };
    getPairPrice();
  }, [tokenPrices, setTokenPrice, tokenId, tokenTransactions]);

  const price = tokenPrices?.[tokenId] ?? 0;

  return (
    <div className={styles.root}>
      <img
        className={styles.icon}
        alt="token icon"
        src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${token.cmcId}.png`}
      />
      <div className={styles.infoWrapper}>
        <div className={styles.infoRow}>
          <div>
            <b>{token.symbol}</b>
          </div>
          <div>${formatDecimals((price * amount).toFixed(0))}</div>
        </div>
        <div className={styles.infoRow}>
          <div>${formatDecimals(price)}</div>
          <div>{formatDecimals(amount)}</div>
        </div>
      </div>
    </div>
  );
}

export default TokenRow;
