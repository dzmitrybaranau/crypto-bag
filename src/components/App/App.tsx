import React from "react";
import styles from "./App.module.scss";
import TotalBalance from "@/components/TotalBalance/TotalBalance";
import Button from "@/components/TotalBalance/components/Button/Button";

export interface IAppProps {}

/**
 * App
 */
function App(props: IAppProps) {
  const {} = props;
  return (
    <div className={styles.wrapper}>
      <div className={styles.totalBalanceWrapper}>
        <TotalBalance />
      </div>
      <div className={styles.actionButtonsWrapper}>
        <Button
          cssProps={{
            height: 48,
            background: "#FED521",
            fontSize: "20px",
            fontWeight: 500,
            boxShadow:
              "0px 4px 4px rgba(0,0,0, 0.25), inset 0px -4px 2px #FEB321",
          }}
        >
          + Buy
        </Button>
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
      <div> Tokens List</div>
    </div>
  );
}

export default App;
