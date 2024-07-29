import React, {
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import Select, { SingleValue } from "react-select";
import { getTokenById } from "@/utils/getTokenById";
import styles from "./TokenForm.module.scss";
import inputStyles from "@/components/Input/Input.module.scss";
import Input from "@/components/Input/Input";
import Button from "@/components/TotalBalance/components/Button/Button";
import { getAllTokens } from "@/utils/getAllTokens";
import { useUserStore } from "@/store";
import { getTokenInfoFromHistory } from "@/utils/getTokenInfoFromHistory";
import { useTokenPricesStore } from "@/store/useTokenPricesStore";
import { ITokenTransaction } from "@/store/useUserStore";

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
  formData?: IFormState;
  type: "buy" | "sell";
}

interface ITokenOption {
  value: string;
  label: string;
}

interface IFormState {
  token: ITokenOption | undefined;
  usdt: string | undefined;
  amount: string | undefined;
  price: string | undefined;
}

/**
 * Token Form
 */
function TokenForm({
  onSubmit,
  onClose,
  formData = {
    token: undefined,
    usdt: undefined,
    amount: undefined,
    price: undefined,
  },
  type,
}: ITokenFormProps) {
  const [formState, setFormState] = useState<IFormState>(formData);
  const user = useUserStore((state) => state.userAccount);
  const userTokenOptions = Object.keys(user?.tokenTransactions ?? {});
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
        user?.tokenTransactions &&
        user?.tokenTransactions?.[option?.value ?? ""] &&
        option?.value
      ) {
        const { amount, lastPrice } = getTokenInfoFromHistory(
          user.tokenTransactions[option.value],
        );
        return setFormState((prevState) => ({
          ...prevState,
          amount: amount.toString(),
          token: option as ITokenOption,
        }));
      }
    }
    return setFormState((prevState) => ({
      ...prevState,
      token: option as ITokenOption,
      amount: undefined,
      usdt: undefined,
    }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    // Allow decimal inputs, including those starting with "0."
    const isValidInput = /^-?\d*\.?\d*$/.test(value);
    if (!isValidInput && value !== "") return;

    let numValue = value === "" ? 0 : parseFloat(value);

    // Don't allow negative numbers
    if (numValue < 0) {
      numValue = 0;
    }

    // Check if user is selling and limit the amount
    if (type === "sell" && id === "amount" && formState.token?.value) {
      const { amount: userTokenAmount } = getTokenInfoFromHistory(
        user?.tokenTransactions?.[
          formState.token?.value
        ] as ITokenTransaction[],
      );
      if (numValue > userTokenAmount) {
        numValue = userTokenAmount;
      }
    }

    // price change
    if (type === "sell" && id === "amount" && formState.token?.value) {
      const { amount: userTokenAmount } = getTokenInfoFromHistory(
          user?.tokenTransactions?.[
              formState.token?.value
              ] as ITokenTransaction[],
      );
      if (numValue > userTokenAmount) {
        numValue = userTokenAmount;
      }
    }

    setFormState((prevState) => {
      // Use the original input value for the changed field to preserve "0." inputs
      const newState = {
        ...prevState,
        [id]: numValue.toString(),
      };

      if (id === "usdt") {
        if (newState.price && newState.price !== "0") {
          newState.amount =
            value === ""
              ? ""
              : (numValue / parseFloat(newState.price)).toString();
        }
      } else if (id === "amount") {
        if (newState.price && newState.price !== "0") {
          newState.usdt =
            value === ""
              ? ""
              : (numValue * parseFloat(newState.price)).toString();
        } else if (newState.usdt) {
          newState.price =
            value === "" || value === "0"
              ? ""
              : (parseFloat(newState.usdt) / numValue).toString();
        }
      } else if (id === "price") {
        if (newState.amount) {
          newState.usdt =
            value === ""
              ? ""
              : (numValue * parseFloat(newState.amount)).toString();
        } else if (newState.usdt) {
          newState.amount =
            numValue === 0
              ? ""
              : (parseFloat(newState.usdt) / numValue).toString();
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
        tokenId: formState.token.value,
      });
      setFormState({
        token: undefined,
        usdt: undefined,
        amount: undefined,
        price: undefined,
      });
    }
  };

  const estimatedPrice = formState.token?.value
    ? (getTokenById(formState.token?.value)
        ?.latestMarketPrice?.toFixed(8)
        ?.toString() ?? undefined)
    : undefined;

  const options =
    type === "buy"
      ? getAllTokens().map((token) => ({
          value: token.id,
          label: token.symbol,
        }))
      : userTokenOptions.map((tokeId) => ({ value: tokeId, label: tokeId }));

  return (
    <>
      <button className={styles.closeButton} onClick={onClose} />
      <form>
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
            value={formState.token}
            onChange={handleTokenSelect}
            options={options}
          />
        </div>
        <div className={styles.inputWrapper}>
          <Input
            label="USDT ($)"
            type="number"
            id="usdt"
            value={formState.usdt}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.inputWrapper}>
          <Input
            label="Amount"
            type="number"
            id="amount"
            value={formState.amount}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.inputWrapper}>
          <Input
            label="Price"
            type="number"
            id="price"
            value={formState.price}
            disabled={isLoadingTokenPrice}
            placeholder={
              !isLoadingTokenPrice && !tokenPrices[formState.token?.value ?? ""]
                ? ""
                : isLoadingTokenPrice
                  ? "Loading..."
                  : tokenPrices[formState.token?.value ?? ""]
                    ? tokenPrices[formState.token?.value ?? ""].toString()
                    : "0"
            }
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
            !formState.price ||
            !formState.amount ||
            !formState.token?.value ||
            !formState.usdt
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
