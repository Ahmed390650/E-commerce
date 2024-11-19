export function formateCurrent(
  amount: number,
  currenyCode: string = "GPP"
): string {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currenyCode.toUpperCase(),
    }).format(amount);
  } catch (error) {
    console.error("Unvalid  curreny code ", error, currenyCode);
    return `$${currenyCode.toUpperCase()} ${amount.toFixed(2)}`;
  }
}
