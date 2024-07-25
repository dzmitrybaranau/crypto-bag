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
        setFormState((prevState) => ({
          ...prevState,
          amount: amount.toString(),
          token: option as ITokenOption,
          price: lastPrice,
          usdt: (amount * parseFloat(lastPrice)).toFixed(0).toString(),
        }));
      }
    }
    return setFormState((prevState) => ({
      ...prevState,
      token: option as ITokenOption,
    }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
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
            placeholder={
              estimatedPrice ? `~${parseFloat(estimatedPrice)}` : undefined
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
