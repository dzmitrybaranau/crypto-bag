import React from "react";
import styles from "./TokenRow.module.scss";
export interface ITokenRowProps {}

/**
 * Token Row
 */
function TokenRow(props: ITokenRowProps) {
  const {} = props;
  return (
    <div className={styles.root}>
      <img className={styles.icon} alt="token icon" src="https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png" />
      <div className={styles.infoWrapper}>
        <div className={styles.infoRow}>
          <div>
            <b>BTC</b>
          </div>
          <div>$126,73</div>
        </div>
        <div className={styles.infoRow}>
          <div>$57041,66</div>
          <div>0.18</div>
        </div>
      </div>
    </div>
  );
}

export default TokenRow;
