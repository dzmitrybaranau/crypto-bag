"use client";

import React, { useState } from "react";
import styles from "./AddTokenModal.module.scss";
import Button from "@/components/TotalBalance/components/Button/Button";
import { AnimatePresence, motion } from "framer-motion";
import { useUserStore } from "@/store";
import TokenForm from "@/components/TokenTransactionModal/components/TokenForm";

/**
 * Add Token Modal
 */
function TokenTransactionModal() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "buy" | "sell";
  }>({
    isOpen: false,
    type: "buy",
  });
  const tokenTransaction = useUserStore((state) => state.tokenTransaction);
  const userId = useUserStore((state) => state.userAccount?.id);

  const handleOpenModal = (type: "buy" | "sell") => () =>
    setModalState({ isOpen: true, type });
  const handleCloseModal = () =>
    setModalState({ ...modalState, isOpen: false });

  const handleTokenTransaction = ({
    amount,
    price,
    tokenId,
  }: {
    amount: string;
    price: string;
    tokenId: string;
  }) => {
    if (userId) {
      tokenTransaction({
        tokenId,
        amount,
        price,
        userId,
        type: "buy",
      });
    }

    setModalState({ ...modalState, isOpen: false });
  };

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
        onClick={handleOpenModal("buy")}
      >
        + Buy
      </Button>
      <Button
        cssProps={{
          height: 48,
          background: "#FEB321",
          color: "",
          fontSize: "20px",
          fontWeight: 500,
          boxShadow:
            "0px 4px 4px rgba(0,0,0, 0.25), inset 0px -4px 2px #ff8f00",
        }}
        onClick={handleOpenModal("sell")}
      >
        - Sell
      </Button>
      <AnimatePresence>
        {modalState.isOpen && (
          <motion.div
            initial={{
              top: "100%",
            }}
            animate={{ top: "20px" }}
            exit={{ top: "100%" }}
            transition={{ ease: "easeInOut" }}
            className={styles.root}
          >
            <TokenForm
              type={modalState.type}
              onSubmit={handleTokenTransaction}
              onClose={handleCloseModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default TokenTransactionModal;
