import parsedTokens from "./parsed_crypto_300.json";

export const getAllTokens = (): typeof parsedTokens => {
  return parsedTokens;
};
