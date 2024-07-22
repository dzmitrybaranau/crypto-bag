import React, { useState } from "react";
import styles from "./App.module.scss";
import TotalBalance from "@/components/TotalBalance/TotalBalance";
import Button from "@/components/TotalBalance/components/Button/Button";
import TokenList from "@/components/TokensList/TokenList";
import AddTokenModal from "@/components/AddTokenModal/AddTokenModal";

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
        <AddTokenModal />
        <Button
          cssProps={{
            height: 48,
            background: "#FEB321",
            fontSize: "20px",
            fontWeight: 500,
            boxShadow:
              "0px 4px 4px rgba(0,0,0, 0.25), inset 0px -4px 2px #ff8f00",
          }}
        >
          - Sell
        </Button>
      </div>
      <TokenList />
    </div>
  );
}

export default App;
