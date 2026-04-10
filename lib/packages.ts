export type ListingType = "standard" | "vip"
export type PackageDays = 7 | 14 | 30

export const PACKAGES = {
  standard: [
    { days: 7,  price: 5000,  label: "7 хоног"  },
    { days: 14, price: 8000,  label: "14 хоног", popular: true },
    { days: 30, price: 15000, label: "30 хоног" },
  ],
  vip: [
    { days: 7,  price: 15000, label: "7 хоног"  },
    { days: 14, price: 25000, label: "14 хоног", popular: true },
    { days: 30, price: 45000, label: "30 хоног" },
  ],
} as const

export function formatExpiry(expiresAt: string | null) {
  if (!expiresAt) return { text: "—", urgent: false, expired: false }
  const days = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000)
  if (days <= 0) return { text: "Хугацаа дууссан", urgent: false, expired: true }
  if (days <= 3) return { text: `${days} хоног үлдсэн`, urgent: true, expired: false }
  return { text: `${days} хоног үлдсэн`, urgent: false, expired: false }
}