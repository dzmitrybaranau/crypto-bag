import React from "react";
import styles from "./Search.module.scss";
export interface ISearchProps {}

/**
 * Search Tokens
 */
function Search(props: ISearchProps) {
  const {} = props;
  return (
    <div className={styles.root}>
      <div className={styles.searchIcon}>
        <div className={styles.circle}></div>
        <div className={styles.stick}></div>
      </div>
      <input className={styles.input} placeholder="Search" />
    </div>
  );
}

export default Search;
