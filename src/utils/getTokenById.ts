import { getAllTokens } from "@/utils/getAllTokens";
import { IToken } from "@/store/useUserStore/useUserStore";

export const getTokenById = (id: string): IToken => {
  const allTokens = getAllTokens();
  const token = allTokens.find((token) => token.id === id);
  return {
    id: token?.id || "",
    cmcId: token?.cmcId?.toString() || "",
    name: token?.name || "",
    symbol: token?.symbol || "",
    latestMarketPrice: token?.lastestMarketPrice ?? 0,
  };
};
