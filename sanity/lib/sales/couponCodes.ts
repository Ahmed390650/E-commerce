export const COUPON_CODE = {
  BFRIDAY: "BFRIDAY",
  XMAS2021: "XMAS2021",
  BY020: "BY020",
} as const;

export type CouponCode = keyof typeof COUPON_CODE;
