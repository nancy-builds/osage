export const formatPriceVND = (price: number | string): string => {
  const value = typeof price === "string" ? Number(price) : price

  if (isNaN(value)) return "0 ₫"

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}
