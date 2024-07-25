"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import Select from "react-select";
import styles from "./AddTokenModal.module.scss";
import Input from "@/components/Input/Input";
import inputStyles from "../Input/Input.module.scss";
import Button from "@/components/TotalBalance/components/Button/Button";
import { AnimatePresence, motion } from "framer-motion";
import { useUserStore } from "@/store";
import { getAllTokens } from "@/utils/getAllTokens";
import { getTokenById } from "@/utils/getTokenById";

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
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const buyToken = useUserStore((state) => state.buyToken);

  const [formState, setFormState] = useState<IFormInterface>({
    token: undefined,
    usdt: undefined,
    amount: undefined,
    price: undefined,
  });

  const handleOpenBuy = () => setIsBuyOpen(true);
  const handleCloseBuy = () => setIsBuyOpen(false);

  const handleFormChange = (e: ChangeEvent<HTMLFormElement>) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleAddToBagClick = () => {
    if (formState?.token?.value && formState.amount && formState.price) {
      buyToken({
        tokenId: formState.token.value,
        amount: formState.amount,
        price: formState.price,
      });
    }
    setIsBuyOpen(false);
    setFormState({
      token: undefined,
      usdt: undefined,
      amount: undefined,
      price: undefined,
    });
  };

  useEffect(() => {
    if (formState.usdt && formState.amount) {
      const newPrice = parseFloat(
        (parseFloat(formState.usdt) / parseFloat(formState.amount)).toFixed(6),
      ).toString();

      if (newPrice !== formState.price) {
        setFormState((prevState) => ({
          ...prevState,
          price: newPrice,
        }));
      }
    }
  }, [formState.usdt, formState.amount, formState.price]);

  const options = getAllTokens().map((token) => ({
    label: token.symbol,
    value: token.id,
  }));

  const estimatePrice =
    getTokenById(formState.token?.value || "")
      ?.latestMarketPrice?.toFixed(8)
      ?.toString() ?? undefined;

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
      <AnimatePresence>
        {isBuyOpen && (
          <motion.div
            initial={{
              top: "100%",
            }}
            animate={{ top: "20px" }}
            exit={{ top: "100%" }}
            transition={{ ease: "easeInOut" }}
            className={styles.root}
          >
            <button className={styles.closeButton} onClick={handleCloseBuy} />
            <form onChange={handleFormChange}>
              <div className={styles.inputWrapper}>
                <label className={inputStyles.label}>Token</label>
                <Select
                  styles={{
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
                  placeholder={
                    estimatePrice ? `~${parseFloat(estimatePrice)}` : undefined
                  }
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
              disabled={
                !formState.price ||
                !formState.amount ||
                !formState.token?.value ||
                !formState.usdt
              }
              onClick={handleAddToBagClick}
            >
              Add To Bag
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AddTokenModal;
