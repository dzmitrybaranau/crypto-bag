export const formatDecimals = (
  value: string | number | undefined,
  fractionDigits = 6,
) => {
  if (!value) return "";
  const numValue = parseFloat(value.toString());
  return parseFloat(numValue.toFixed(fractionDigits).toString());
};
