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
  const { children, cssProps, ...rest } = props;
  return (
    <button className={styles.root} style={{ ...cssProps }} {...rest}>
      {children}
    </button>
  );
}

export default Button;
