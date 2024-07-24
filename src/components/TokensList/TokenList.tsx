"use client";

import React from "react";
import styles from "./TokenList.module.scss";
import TokenRow from "@/components/TokensList/components/TokenRow/TokenRow";
import Search from "@/components/TokensList/components/Search/Search";
import { useUserStore } from "@/store";

export interface ITokenListProps {}

/**
 * Tokens List
 */
function TokenList(props: ITokenListProps) {
  const userAccount = useUserStore((state) => state.userAccount);
  const tokensToRender = Object.values(userAccount?.tokens ?? {});

  return (
    <div className={styles.root}>
      <div className={styles.heading}>
        <b>Token</b>
        <Search />
      </div>
      {tokensToRender.map((token) => (
        <div key={token.id} style={{ marginBottom: 12 }}>
          <TokenRow token={token} />
        </div>
      ))}
    </div>
  );
}

export default TokenList;
