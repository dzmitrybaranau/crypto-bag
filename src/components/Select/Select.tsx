import React from "react";
import ReactSelect, {
  GroupBase,
  Props,
  SingleValue,
  StylesConfig,
} from "react-select";

export interface ISelectProps<T> extends Omit<Props, "onChange"> {
  onChange: (option: SingleValue<T>) => void;
}

const selectStyles: StylesConfig<any, false, GroupBase<any>> = {
  container: (base, props) => ({
    ...base,
    marginTop: 8,
    outline: "none",
  }),
  menu: (base, state) => ({
    ...base,
    background: "#FFF6D6",
    padding: "0px",
    borderRadius: 8,
  }),
  menuList: (base, state) => ({
    ...base,
    background: "#FFF6D6",
    padding: "0px",
    borderRadius: 8,
  }),
  option: (base, props) => ({
    ...base,
    display: "flex",
    alignItems: "center",
    color: "#292929",
    fontWeight: 500,
    fontSize: "20px",
    background: props.isSelected
      ? "#c2baa1"
      : props.isFocused
        ? "#eee4cb"
        : "transparent",
    height: "50px",
    cursor: "pointer",
  }),
  control: (base, props) => ({
    ...base,
    height: 60,
    background: "#FFF6D6",
    boxShadow: "inset 0px -2px 0px #7C4C27",
    border: "1px solid #7C4C27",
    borderRadius: "16px",
    padding: "0px 8px 0px 8px",
    fontSize: "20px",
    fontWeight: 500,
  }),
};

/**
 * Styled select
 */
function Select<T>(props: ISelectProps<T>) {
  // @ts-ignore
  return <ReactSelect styles={selectStyles} {...props} />;
}

export default Select;
