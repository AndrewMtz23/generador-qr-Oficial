import {
  Link2,
  MessageCircle,
  Wifi,
  FileText,
  UtensilsCrossed,
  Star,
  Share2,
  ShoppingBag,
  Store,
  CreditCard,
  Package,
  Headset,
  Coffee,
  KeyRound,
  Briefcase,
  Home,
  ClipboardList,
  CalendarDays,
  Boxes,
  Gift,
  type LucideIcon,
} from "lucide-react";
import type { GeneratorRouteType } from "./seo";

/** Icon of each QR type landing (cards, "other types" links). */
export const TYPE_ICONS: Record<GeneratorRouteType, LucideIcon> = {
  url: Link2,
  whatsapp: MessageCircle,
  wifi: Wifi,
  texto: FileText,
};

/** One icon per use case, in the same order as `landing.types.<type>.useCases.items`. */
export const USE_CASE_ICONS: Record<GeneratorRouteType, LucideIcon[]> = {
  url: [UtensilsCrossed, Star, Share2, ShoppingBag],
  whatsapp: [Store, CreditCard, Package, Headset],
  wifi: [Coffee, KeyRound, Briefcase, Home],
  texto: [ClipboardList, CalendarDays, Boxes, Gift],
};
