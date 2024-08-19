import React from "react";
import styles from "./Spent.module.scss";
export interface ISpentProps {
  amount: number;
}

/**
 * Spend overall
 */
function Spent({ amount }: ISpentProps) {
  return <div className={styles.root}>${amount.toFixed(3)} spent</div>;
}

export default Spent;
