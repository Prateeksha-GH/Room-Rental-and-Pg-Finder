// Generic UI helpers used across pages.

export const formatPrice = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

export const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
};

export const cn = (...c) => c.filter(Boolean).join(" ");

export const dashboardPathFor = (role) =>
  role === "admin" ? "/dashboard/admin" : role === "owner" ? "/dashboard/owner" : "/dashboard/tenant";
