import React from "react";
import styles from "./TokenForm.module.scss";
import inputStyles from "@/components/Input/Input.module.scss";
import Input from "@/components/Input/Input";
import Button from "@/components/TotalBalance/components/Button/Button";
import Select from "@/components/Select/Select";
import {
  ITokenOption,
  useTokenForm,
} from "@/components/TokenTransactionModal/hooks/useTokenForm";
import { formatDecimals } from "@/utils/formatDecimals";

export interface ITokenFormProps {
  onSubmit: ({
    amount,
    price,
    tokenId,
  }: {
    amount: string;
    price: string;
    tokenId: string;
  }) => void;
  onClose: () => void;
  type: "buy" | "sell";
}

/**
 * Token Form
 */
function TokenForm({ onSubmit, onClose, type }: ITokenFormProps) {
  const {
    amount,
    tokenOptions,
    tokenId,
    handleTokenSelect,
    usdt,
    price,
    handleInputChange,
    pricePlaceholder,
    isLoadingTokenPrice,
    handleSubmit,
    tokenOption,
  } = useTokenForm(type, onSubmit);

  return (
    <>
      <button className={styles.closeButton} onClick={onClose} />
      <form>
        <div className={styles.inputWrapper}>
          <label htmlFor="token" className={inputStyles.label}>
            Token
          </label>
          <Select<ITokenOption>
            id="token"
            value={tokenOption}
            onChange={handleTokenSelect}
            options={tokenOptions}
          />
        </div>
        <div className={styles.inputWrapper}>
          <Input
            label="USDT ($)"
            type="number"
            id="usdt"
            value={formatDecimals(usdt)}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.inputWrapper}>
          <Input
            label="Amount"
            type="number"
            id="amount"
            value={formatDecimals(amount)}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.inputWrapper}>
          <Input
            label="Price"
            type="number"
            id="price"
            value={formatDecimals(price)}
            disabled={isLoadingTokenPrice}
            placeholder={pricePlaceholder}
            onChange={handleInputChange}
          />
        </div>
        <Button
          cssProps={{
            height: "60px",
            background: "#FED521",
            fontSize: "24px",
            fontWeight: 600,
            color: "#292929",
            boxShadow:
              "inset 0px -4px 2px #feb321, 0px 2px 2px rgba(169, 0,0,0.5)",
            marginTop: 32,
          }}
          disabled={
            !price ||
            !amount ||
            !tokenId ||
            !usdt ||
            price === "0" ||
            amount === "0" ||
            usdt === "0"
          }
          onClick={handleSubmit}
          type="submit"
        >
          {type === "buy" ? "Add To Bag" : "Throw away from bag"}
        </Button>
      </form>
    </>
  );
}

export default TokenForm;
