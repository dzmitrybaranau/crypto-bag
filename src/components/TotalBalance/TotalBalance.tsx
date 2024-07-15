import React from "react";
import styles from "./TotalBalance.module.scss";
import Profit from "@/components/TotalBalance/components/Profit/Profit";
import Spent from "@/components/TotalBalance/components/Spent/Spent";

export interface ITotalBalanceProps {}

/**
 * Total Balance, PnL
 */
function TotalBalance(props: ITotalBalanceProps) {
  const {} = props;
  return (
    <div className={styles.root}>
      <div className={styles.heading}>
        <h1 className={styles.text}>Total Balance</h1>{" "}
        <div className={styles.logo}></div>
      </div>
      <h2 className={styles.balanceText}>$112,564</h2>
      <div className={styles.profitWrapper}>
        <Profit />
      </div>
      <div className={styles.spentWrapper}>
        <Spent />
      </div>
    </div>
  );
}

export default TotalBalance;
