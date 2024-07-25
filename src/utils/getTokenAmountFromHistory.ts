import { ITokenTransaction } from "@/store/useUserStore";

export const getTokenAmountFromHistory = (tokenHistory: ITokenTransaction[]) => {
  const amount = tokenHistory.reduce((p, c) => {
    if (c.type == "buy") {
      return p + parseFloat(c.amount);
    }
    if (c.type === "sell") {
      return p - parseFloat(c.amount);
    }
    return p;
  }, 0);

  return amount;
};
