"use client";
import React from "react";
import styles from "./TotalBalance.module.scss";
import ProfitAndLoss from "@/components/TotalBalance/components/Profit/ProfitAndLoss";
import Spent from "@/components/TotalBalance/components/Spent/Spent";
import logoSrc from "./logo.png";
import Image from "next/image";
import { useTotalBalance } from "@/components/TotalBalance/hooks/useTotalBalance";

export interface ITotalBalanceProps {}

/**
 * Total Balance, PnL
 */
function TotalBalance(props: ITotalBalanceProps) {
  const {
    isPricesLoading,
    isUserLoading,
    totalPnl,
    tokensTotalBalance,
    tokensSpentUsdt,
  } = useTotalBalance();

  return (
    <div className={styles.root}>
      <div className={styles.heading}>
        <h1 className={styles.text}>Total Balance</h1>{" "}
        <Image className={styles.logo} src={logoSrc} alt="Logo" />
      </div>
      {!isUserLoading && !isPricesLoading ? (
        <>
          <h2 className={styles.balanceText}>
            ${tokensTotalBalance.toFixed(3)}
          </h2>
          <div className={styles.profitWrapper}>
            <ProfitAndLoss amount={totalPnl} />
          </div>
          <div className={styles.spentWrapper}>
            <Spent amount={tokensSpentUsdt} />
          </div>
        </>
      ) : (
        <h2 className={styles.balanceText}>Loading...</h2>
      )}
    </div>
  );
}

export default TotalBalance;
