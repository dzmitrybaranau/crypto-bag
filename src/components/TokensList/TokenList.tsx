import React from "react";
import styles from "./TokenList.module.scss";
import TokenRow from "@/components/TokensList/components/TokenRow/TokenRow";
import Search from "@/components/TokensList/components/Search/Search";

export interface ITokenListProps {}

/**
 * Tokens List
 */
function TokenList(props: ITokenListProps) {
  const {} = props;
  return (
    <div className={styles.root}>
      <div className={styles.heading}>
        <b>Token</b>
        <Search />
      </div>
      <TokenRow />
    </div>
  );
}

export default TokenList;
