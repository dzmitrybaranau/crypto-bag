import React from "react";
import styles from "./Spent.module.scss";
export interface ISpentProps {}

/**
 * Spend overall
 */
function Spent(props: ISpentProps) {
  const {} = props;
  return <div className={styles.root}>$5464,34 spent</div>;
}

export default Spent;
