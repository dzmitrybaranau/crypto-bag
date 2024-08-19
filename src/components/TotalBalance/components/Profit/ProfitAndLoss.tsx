import React from "react";
import styles from "./Profit.module.scss";
import { useTotalBalance } from "@/components/TotalBalance/hooks/useTotalBalance";

export interface IProfitProps {
  amount: number;
}

/**
 * Whole profit
 */
function ProfitAndLoss({ amount }: IProfitProps) {
  return <div className={styles.root}>PnL ${amount.toFixed(2)}</div>;
}

export default ProfitAndLoss;
