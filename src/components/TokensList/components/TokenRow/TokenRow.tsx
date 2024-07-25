import React from "react";
import styles from "./TokenRow.module.scss";
import { ITokenTransaction } from "@/store/useUserStore";
import { getTokenById } from "@/utils/getTokenById";
import { getTokenAmountFromHistory } from "@/utils/getTokenAmountFromHistory";

export interface ITokenRowProps {
  tokenId: string;
  tokenTransactions: ITokenTransaction[];
}

/**
 * Token Row
 */
function TokenRow({ tokenTransactions, tokenId }: ITokenRowProps) {
  const token = getTokenById(tokenId);
  const amount = getTokenAmountFromHistory(tokenTransactions);
  const price = tokenTransactions[tokenTransactions.length - 1].price;

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
          <div>${(parseFloat(price) * amount).toFixed(0)}</div>
        </div>
        <div className={styles.infoRow}>
          <div>${price}</div>
          <div>{amount}</div>
        </div>
      </div>
    </div>
  );
}

export default TokenRow;
