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
  const isUserLoading = useUserStore((state) => state.isUserLoading);

  const tokenKeys = Object.keys(userAccount?.tokenTransactions ?? {});

  return (
    <div className={styles.root}>
      <div className={styles.heading}>
        <b>Token</b>
        <Search />
      </div>
      {isUserLoading && <div>Loading tokens...</div>}
      {tokenKeys.map((tokenId) => (
        <div key={tokenId} style={{ marginBottom: 12 }}>
          <TokenRow
            tokenId={tokenId}
            tokenTransactions={userAccount?.tokenTransactions[tokenId] ?? []}
          />
        </div>
      ))}
    </div>
  );
}

export default TokenList;
