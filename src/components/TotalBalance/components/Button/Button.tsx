import React, { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import styles from "./Button.module.scss";

export interface IButtonProps extends ButtonHTMLAttributes<any> {
  children?: ReactNode;
  cssProps?: CSSProperties;
}

/**
 * Button
 */
function Button(props: IButtonProps) {
  const { children, cssProps } = props;
  return (
    <button className={styles.root} style={{ ...cssProps }}>
      {children}
    </button>
  );
}

export default Button;
