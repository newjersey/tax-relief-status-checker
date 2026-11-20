export const formatCheckAmount = (amount: number) => {
  function countDecimals(num: number) {
    if (Math.floor(num) === num) return 0;
    return num.toString().split(".")[1]?.length || 0;
  }

  if (countDecimals(amount) > 0) {
    return amount.toFixed(2);
  }

  return amount.toString();
};
