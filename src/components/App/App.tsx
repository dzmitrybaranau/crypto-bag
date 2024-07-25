import React, { useState } from "react";
import styles from "./App.module.scss";
import TotalBalance from "@/components/TotalBalance/TotalBalance";
import Button from "@/components/TotalBalance/components/Button/Button";
import TokenList from "@/components/TokensList/TokenList";
import TokenTransactionModal from "@/components/TokenTransactionModal/TokenTransactionModal";

export interface IAppProps {}

/**
 * App
 */
function App(props: IAppProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.totalBalanceWrapper}>
        <TotalBalance />
      </div>
      <div className={styles.actionButtonsWrapper}>
        <TokenTransactionModal />
      </div>
      <TokenList />
    </div>
  );
}

export default App;
