export const getTokenPriceFromBinance = async ({
  tokenSymbol,
  fallbackPrice = 0,
}: {
  tokenSymbol: string;
  fallbackPrice?: number;
}) => {
  if (tokenSymbol.toLowerCase() === "usdt") {
    return 1;
  }
  const response = await fetch(
    `https://api.binance.com/api/v3/ticker/price?symbol=${tokenSymbol}USDT`,
  );

  const data = await response.json();

  if (data?.price) {
    return parseFloat(parseFloat(data.price.toString()).toFixed(8));
  }

  return fallbackPrice;
};
