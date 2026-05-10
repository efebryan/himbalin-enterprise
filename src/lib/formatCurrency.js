/**
 * formatCurrency.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared Naira currency formatter used across all public and admin pages.
 */

export const formatPrice = (value) => {
  const num = Number(value);
  if (isNaN(num)) return "₦0";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};
