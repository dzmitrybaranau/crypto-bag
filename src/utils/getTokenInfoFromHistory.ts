import { ITokenTransaction } from "@/store/useUserStore";

export const getTokenInfoFromHistory = (tokenHistory: ITokenTransaction[]) => {
  const sortedTokenHistory = tokenHistory.sort(
    // @ts-ignore
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const amount = sortedTokenHistory.reduce(
    (p, c) => {
      console.log({ p, c });
      if (c.type === "buy") {
        return { amount: p.amount + parseFloat(c.amount) };
      }
      if (c.type === "sell") {
        return { amount: p.amount - parseFloat(c.amount) };
      }
      return p;
    },
    { amount: 0 },
  );

  const lastPrice = sortedTokenHistory[0].price;

  return { amount: amount.amount, lastPrice };
};
