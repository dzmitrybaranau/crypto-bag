"use client";

import React, { useState } from "react";
import styles from "./AddTokenModal.module.scss";
import Button from "@/components/TotalBalance/components/Button/Button";
import { AnimatePresence, motion } from "framer-motion";
import { useUserStore } from "@/store";
import { getAllTokens } from "@/utils/getAllTokens";
import TokenForm from "@/components/AddTokenModal/components/TokenForm";

/**
 * Add Token Modal
 */
function AddTokenModal() {
  const [isOpen, setIsOpen] = useState(false);
  const buyToken = useUserStore((state) => state.buyToken);

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  const handleAddToken = ({
    amount,
    price,
    tokenId,
  }: {
    amount: string;
    price: string;
    tokenId: string;
  }) => {
    buyToken({
      tokenId,
      amount,
      price,
    });
    setIsOpen(false);
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
        onClick={handleOpenModal}
      >
        + Buy
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              top: "100%",
            }}
            animate={{ top: "20px" }}
            exit={{ top: "100%" }}
            transition={{ ease: "easeInOut" }}
            className={styles.root}
          >
            <TokenForm onSubmit={handleAddToken} />
            <button className={styles.closeButton} onClick={handleCloseModal} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AddTokenModal;
