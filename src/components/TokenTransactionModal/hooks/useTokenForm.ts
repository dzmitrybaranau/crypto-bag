import { ChangeEvent, MouseEventHandler, useEffect, useState } from "react";
import { useUserStore } from "@/store";
import { useTokenPricesStore } from "@/store/useTokenPricesStore";
import { SingleValue } from "react-select";
import { getTokenInfoFromHistory } from "@/utils/getTokenInfoFromHistory";
import { ITokenTransaction } from "@/store/useUserStore";
import { getAllTokens } from "@/utils/getAllTokens";

export interface ITokenOption {
  value: string;
  label: string;
}

interface ITokenFormState {
  token: ITokenOption | undefined;
  usdt: string | undefined;
  amount: string | undefined;
  price: string | undefined;
}

export const useTokenForm = (
  type: "buy" | "sell",
  onSubmit: ({
    amount,
    price,
    tokenId,
  }: {
    amount: string;
    price: string;
    tokenId: string;
  }) => void,
) => {
  const [formState, setFormState] = useState<ITokenFormState>({
    token: undefined,
    usdt: undefined,
    amount: undefined,
    price: undefined,
  });
  const userAccount = useUserStore((state) => state.userAccount);
  const userTokenOptions = Object.keys(userAccount?.tokenTransactions ?? {});
  const {
    tokenPrices,
    setTokenPrice,
    isLoading: isLoadingTokenPrice,
  } = useTokenPricesStore((state) => ({
    ...state,
  }));

  useEffect(() => {
    const fetchTokenPrice = async () => {
      if (formState.token?.value && !tokenPrices[formState.token?.value]) {
        setTokenPrice({ tokenId: formState.token.value });
      }
    };
    fetchTokenPrice();
  }, [formState.token?.value, setTokenPrice, tokenPrices]);

  useEffect(() => {
    if (tokenPrices[formState.token?.value ?? ""]) {
      setFormState({
        ...formState,
        price: tokenPrices[formState.token?.value ?? ""].toString(),
      });
    }
  }, [tokenPrices, formState.token?.value]);

  const handleTokenSelect = (option: SingleValue<ITokenOption>) => {
    if (type === "sell") {
      if (
        userAccount?.tokenTransactions &&
        userAccount?.tokenTransactions?.[option?.value ?? ""] &&
        option?.value
      ) {
        const { amount, lastPrice } = getTokenInfoFromHistory(
          userAccount.tokenTransactions[option.value],
        );
        return setFormState((prevState) => ({
          ...prevState,
          amount: amount.toString(),
          token: option as ITokenOption,
        }));
      }
    }
    console.log("SET STATE");
    return setFormState((prevState) => ({
      ...prevState,
      token: option as ITokenOption,
      amount: undefined,
      usdt: undefined,
      price: undefined,
    }));
  };

  console.log({ formState });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    // Allow decimal inputs, including those starting with "0."
    const isValidInput = /^-?\d*\.?\d*$/.test(value);
    if (!isValidInput && value !== "") return;

    // Keep the original value for the changed field
    let originalValue = value;
    let numValue = value === "" ? 0 : parseFloat(value);

    // Don't allow negative numbers
    if (numValue < 0) {
      numValue = 0;
      originalValue = "0";
    }

    setFormState((prevState) => {
      // Use the original input value for the changed field to preserve "0." inputs
      const newState = {
        ...prevState,
        [id]: originalValue,
      };

      if (type === "sell" && formState.token?.value) {
        const { amount: userTokenAmount } = getTokenInfoFromHistory(
          userAccount?.tokenTransactions?.[
            formState.token.value
          ] as ITokenTransaction[],
        );

        const calculateAndLimitAmount = (amount: number) => {
          return Math.min(amount, userTokenAmount);
        };

        if (id === "usdt") {
          if (newState.price && newState.price !== "0") {
            const calculatedAmount = numValue / parseFloat(newState.price);
            const limitedAmount = calculateAndLimitAmount(calculatedAmount);
            newState.amount = limitedAmount.toString();
            // Keep the original USDT input if it's within limits
            if (calculatedAmount <= userTokenAmount) {
              newState.usdt = originalValue;
            } else {
              newState.usdt = (
                limitedAmount * parseFloat(newState.price)
              ).toString();
            }
          }
        } else if (id === "amount") {
          const limitedAmount = calculateAndLimitAmount(numValue);
          // Keep the original amount input if it's within limits
          newState.amount =
            numValue <= userTokenAmount
              ? originalValue
              : limitedAmount.toString();
          if (newState.price && newState.price !== "0") {
            newState.usdt = (
              limitedAmount * parseFloat(newState.price)
            ).toString();
          }
        } else if (id === "price") {
          if (newState.amount) {
            const maxAllowedUsdt = userTokenAmount * numValue;
            const calculatedUsdt = parseFloat(newState.amount) * numValue;
            // Keep the original price input
            newState.price = originalValue;
            if (calculatedUsdt <= maxAllowedUsdt) {
              newState.usdt = (
                parseFloat(newState.amount) * numValue
              ).toString();
            } else {
              newState.usdt = maxAllowedUsdt.toString();
              newState.amount = (maxAllowedUsdt / numValue).toString();
            }
          }
        }
      } else {
        // Logic for buy transactions or when token is not selected
        if (id === "usdt") {
          if (newState.price && newState.price !== "0") {
            newState.amount = (
              numValue / parseFloat(newState.price)
            ).toString();
          }
        } else if (id === "amount") {
          if (newState.price && newState.price !== "0") {
            newState.usdt = (numValue * parseFloat(newState.price)).toString();
          } else if (newState.usdt) {
            newState.price =
              numValue === 0
                ? ""
                : (parseFloat(newState.usdt) / numValue).toString();
          }
        } else if (id === "price") {
          if (newState.amount) {
            newState.usdt = (numValue * parseFloat(newState.amount)).toString();
          } else if (newState.usdt) {
            newState.amount =
              numValue === 0
                ? ""
                : (parseFloat(newState.usdt) / numValue).toString();
          }
        }
      }

      return newState;
    });
  };
  const handleSubmit: MouseEventHandler = (e) => {
    e.preventDefault();
    if (formState.token?.value && formState.amount && formState.price) {
      onSubmit({
        amount: formState.amount,
        price: formState.price,
        tokenId: formState.token?.value,
      });
      setFormState({
        token: undefined,
        usdt: undefined,
        amount: undefined,
        price: undefined,
      });
    }
  };

  const tokenOptions =
    type === "buy"
      ? getAllTokens().map((token) => ({
          value: token.id,
          label: token.symbol,
        }))
      : userTokenOptions.map((tokenId) => ({ value: tokenId, label: tokenId }));

  const tokenId = formState.token?.value ?? "";
  const pricePlaceholder =
    !isLoadingTokenPrice && !tokenPrices[tokenId]
      ? ""
      : isLoadingTokenPrice
        ? "Loading..."
        : tokenPrices[tokenId]
          ? tokenPrices[tokenId].toString()
          : "0";

  return {
    tokenId,
    tokenOption: formState.token,
    price: formState.price,
    amount: formState.amount,
    usdt: formState.usdt,
    handleInputChange,
    handleTokenSelect,
    tokenOptions,
    handleSubmit,
    isLoadingTokenPrice,
    pricePlaceholder,
  };
};
