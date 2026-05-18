import {
  Trees, Waves, Map, UtensilsCrossed, Home,
  Users, ShieldCheck, Award, Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface Service {
  id: string;
  title: string;
  description: string;
  provider_name?: string;
  phone?: string;
  category_id: number;
  price_amount: number | null;
  price_label: string;
  is_free: boolean;
  duration: string | null;
  features: string[];
  images: string[];
  avg_rating: number;
  review_count: number;
  is_available: boolean;
  created_at: string;
}

export interface ServiceCategory {
  id: number | "all";
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export const serviceCategories: ServiceCategory[] = [
  { id: "all", label: "Бүгд",          icon: Sparkles,         color: "text-primary",         bg: "bg-primary/10" },
  { id: 1,     label: "Түрээс",        icon: Home,             color: "text-blue-600",        bg: "bg-blue-100" },
  { id: 2,     label: "Байгаль",       icon: Trees,            color: "text-emerald-600",     bg: "bg-emerald-100" },
  { id: 3,     label: "Усны үйлчилгээ", icon: Waves,            color: "text-cyan-600",        bg: "bg-cyan-100" },
  { id: 4,     label: "Аялал",         icon: Map,              color: "text-amber-600",       bg: "bg-amber-100" },
  { id: 5,     label: "Хоол",          icon: UtensilsCrossed,  color: "text-rose-600",        bg: "bg-rose-100" },
];

export const serviceStats = [
  { icon: Users,       value: "50+",   label: "Үйлчилгээ" },
  { icon: ShieldCheck, value: "100%",  label: "Найдвартай" },
  { icon: Award,       value: "4.8",   label: "Дундаж үнэлгээ" },
  { icon: Sparkles,    value: "24/7",  label: "Туслалцаа" },
];

export function formatServicePrice(s: Service): string {
  if (s.is_free) return "Үнэгүй";
  if (!s.price_amount) return "—";
  return `${s.price_amount.toLocaleString()}${s.price_label}`;
}