import React from "react";
import styles from "./TotalBalance.module.scss";
import ProfitAndLoss from "@/components/TotalBalance/components/Profit/ProfitAndLoss";
import Spent from "@/components/TotalBalance/components/Spent/Spent";
import logoSrc from "./logo.png";
import Image from "next/image";

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
        <Image className={styles.logo} src={logoSrc} alt="Logo" />
      </div>
      <h2 className={styles.balanceText}>$112,564</h2>
      <div className={styles.profitWrapper}>
        <ProfitAndLoss />
      </div>
      <div className={styles.spentWrapper}>
        <Spent />
      </div>
    </div>
  );
}

export default TotalBalance;
