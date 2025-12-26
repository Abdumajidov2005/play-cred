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
    path: "/ad-limits",
    label: "Ad Limits",
    icon: Gauge,
  },
];
