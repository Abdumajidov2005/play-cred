import {
  LayoutDashboard,
  Users,
  Calendar,
  MapPin,
  Tv2,
  Coins,
  TrendingUp,
  Handshake,
  FileText,
  Settings,
  ChevronLeft,
  Menu,
  Trophy,
  Megaphone,
  Gauge,
  CreditCard,
  Clock,
} from "lucide-react";

export const navItems = [
  {
    path: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/users",
    label: "Users",
    icon: Users,
  },
  {
    path: "/subscriptions",
    label: "Subscriptions",
    icon: CreditCard,
  },
  {
    path: "/bookings",
    label: "Bookings & Sessions",
    icon: Calendar,
  },
  {
    path: "/fields",
    label: "Fields & Locations",
    icon: MapPin,
  },
  {
    path: "/slotManagement",
    label: "Slot Management",
    icon: Clock,
  },
  {
    path: "/revenue",
    label: "Ads & Revenue",
    icon: Tv2,
  },
  {
    path: "/load-ads",
    label: "Load Ads",
    icon: Megaphone,
  },
  {
    path: "/ad-limits",
    label: "Ad Limits",
    icon: Gauge,
  },
  {
    path: "/credits-rewards",
    label: "Credits & Rewards",
    icon: Coins,
  },
  {
    path: "/referrals-growth",
    label: "Referrals & Growth",
    icon: TrendingUp,
  },
  {
    path: "/partners-sponsors",
    label: "Partners & Sponsors",
    icon: Handshake,
  },
  {
    path: "/reports-export",
    label: "Reports & Export",
    icon: FileText,
  },
  {
    path: "/settings-admins",
    label: "Settings & Admins",
    icon: Settings,
  },
];
