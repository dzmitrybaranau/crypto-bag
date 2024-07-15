import React from 'react'
import styles from "./Profit.module.scss";

export interface IProfitProps {
    
}

/**
 * Whole profit
 */
function Profit(props: IProfitProps) {
  const { } = props
  return (
    <div className={styles.root}>PnL +$23,43 (+4,43%)</div>
  )
}

export default Profit
