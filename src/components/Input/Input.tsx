import React, { InputHTMLAttributes } from "react";
import styles from "./Input.module.scss";

export interface ITextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

/**
 * Text input
 */
function Input(props: ITextInputProps) {
  const { label, ...inputProps } = props;
  return (
    <div className={styles.root}>
      <label htmlFor={inputProps.id} className={styles.label}>
        {label}
      </label>
      <input type="text" className={styles.input} {...inputProps} />
    </div>
  );
}

export default Input;
