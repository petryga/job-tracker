export function withCommas(value?: string | number): string {
  if (!value) return "";
  if (typeof value === "number") {
    // eslint-disable-next-line no-param-reassign
    value = value.toString();
  }
  const num = parseFloat(value.replace(/,/g, ""));
  if (num === 0 || Number.isNaN(num)) return "";

  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
