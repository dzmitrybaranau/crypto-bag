import React from "react";
import styles from "./TokenRow.module.scss";
import { IToken } from "@/store/useUserStore";

export interface ITokenRowProps {
  token: IToken;
}

/**
 * Token Row
 */
function TokenRow({ token }: ITokenRowProps) {
  const { symbol, price, transactionsHistory } = token;

  console.log({ transactionsHistory });
  const amount = transactionsHistory.reduce((p, c) => {
    if (c.type == "buy") {
      return p + parseFloat(c.amount);
    }
    return p;
  }, 0);

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
            <b>{symbol}</b>
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
