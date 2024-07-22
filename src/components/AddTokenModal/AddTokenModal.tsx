"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import Select from "react-select";
import styles from "./AddTokenModal.module.scss";
import Input from "@/components/Input/Input";
import inputStyles from "../Input/Input.module.scss";
import Button from "@/components/TotalBalance/components/Button/Button";

export interface IAddTokenModalProps {}

interface IFormInterface {
  token:
    | undefined
    | {
        value: string;
        label: string;
      };
  usdt: string | undefined;
  amount: string | undefined;
  price: string | undefined;
}

/**
 * Add Token Modal
 */
function AddTokenModal(props: IAddTokenModalProps) {
  const [isBuyOpen, setIsBuyOpen] = useState(true);

  const handleOpenBuy = () => {
    console.log("OPEN");
    setIsBuyOpen(true);
  };
  const handleCloseBuy = () => setIsBuyOpen(false);

  const [formState, setFormState] = useState<IFormInterface>({
    token: undefined,
    usdt: undefined,
    amount: undefined,
    price: undefined,
  });

  const [autoCalculate, setAutoCalculate] = useState(true);

  const handleFormChange = (e: ChangeEvent<HTMLFormElement>) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));

    if (id === "usdt" || id === "amount") {
      setAutoCalculate(true);
    } else if (id === "price") {
      setAutoCalculate(false);
    }
  };

  useEffect(() => {
    if (autoCalculate && formState.usdt && formState.amount) {
      const newPrice = (
        parseFloat(formState.usdt) / parseFloat(formState.amount)
      ).toString();

      if (newPrice !== formState.price) {
        setFormState((prevState) => ({
          ...prevState,
          price: newPrice,
        }));
      }
    }
  }, [formState.usdt, formState.amount, formState.price, autoCalculate]);

  const options = [
    { value: "ETH", label: "ETH" },
    { value: "BTC", label: "BTC" },
    { value: "LTC", label: "LTC" },
  ];

  return (
    <>
      <Button
        cssProps={{
          height: 48,
          background: "#FED521",
          fontSize: "20px",
          fontWeight: 500,
          boxShadow:
            "0px 4px 4px rgba(0,0,0, 0.25), inset 0px -4px 2px #FEB321",
        }}
        onClick={handleOpenBuy}
      >
        + Buy
      </Button>
      {isBuyOpen && (
        <div className={styles.root}>
          <button className={styles.closeButton} onClick={handleCloseBuy} />
          <form onChange={handleFormChange}>
            <div className={styles.inputWrapper}>
              <label className={inputStyles.label}>Token</label>
              <Select
                styles={{
                  container: (base, props) => ({
                    ...base,
                    marginTop: 8,
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
                }}
                defaultValue={formState.token}
                onChange={(option) =>
                  setFormState({ ...formState, token: option || undefined })
                }
                options={options}
              />
            </div>
            <div className={styles.inputWrapper}>
              <Input
                label="USDT ($)"
                type="number"
                id="usdt"
                value={formState.usdt}
              />
            </div>
            <div className={styles.inputWrapper}>
              <Input
                label="Amount"
                type="number"
                id="amount"
                value={formState.amount}
              />
            </div>
            <div className={styles.inputWrapper}>
              <Input
                label="Price"
                type="number"
                id="price"
                value={formState.price}
              />
            </div>
          </form>
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
          >
            Add To Bag
          </Button>
        </div>
      )}
    </>
  );
}

export default AddTokenModal;
