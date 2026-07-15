import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Tractor,
  Activity,
  Droplets,
  LineChart,
  User as UserIcon,
  Settings,
  LogOut,
  Sprout,
  Zap,
  Bug,
  CloudSun,
  Map,
  CalendarDays,
} from "lucide-react";

const mainNav = [
  { nameKey: "nav.dashboard", href: "/", icon: LayoutDashboard },
  { nameKey: "nav.myFarms", href: "/farms", icon: Tractor },
  { nameKey: "nav.yieldPrediction", href: "/prediction", icon: Activity },
  { nameKey: "nav.diseaseDetection", href: "/disease", icon: Bug },
  { nameKey: "nav.iotSensors", href: "/sensors", icon: Droplets },
  { nameKey: "nav.analytics", href: "/analytics", icon: LineChart },
  { nameKey: "nav.weather", href: "/weather", icon: CloudSun },
  { nameKey: "nav.farmMap", href: "/map", icon: Map },
  { nameKey: "nav.cropCalendar", href: "/calendar", icon: CalendarDays },
];

const bottomNav = [
  { nameKey: "nav.profile", href: "/profile", icon: UserIcon },
  { nameKey: "nav.settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const { t } = useTranslation();

  return (
    <aside className="w-[260px] hidden md:flex flex-col neo-box rounded-none z-20">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-black/[0.1] dark:border-white/[0.06]">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <Sprout className="h-4.5 w-4.5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          AgriSense
        </span>
        <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
          AI
        </span>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 pt-2 pb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
          {t('nav.mainMenu')}
        </p>
        {mainNav.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/"}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 px-3 py-2 text-[13px] font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "neo-inset text-emerald-500"
                  : "text-slate-500 hover:text-emerald-400 neo-button hover:bg-transparent"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    "flex items-center justify-center h-7 w-7 rounded-md transition-all",
                    isActive
                      ? "text-emerald-500"
                      : "text-slate-500 group-hover:text-emerald-400"
                  )}
                >
                  <item.icon className="h-[16px] w-[16px]" />
                </div>
                {t(item.nameKey)}
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-black/[0.1] dark:border-white/[0.06] space-y-0.5">
        <p className="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
          {t('nav.settings')}
        </p>
        {bottomNav.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 px-3 py-2 text-[13px] font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "neo-inset text-emerald-500"
                  : "text-slate-500 hover:text-emerald-400 neo-button hover:bg-transparent"
              )
            }
          >
            <div className="flex items-center justify-center h-7 w-7 rounded-md text-slate-500">
              <item.icon className="h-[16px] w-[16px]" />
            </div>
            {t(item.nameKey)}
          </NavLink>
        ))}
        <button
          onClick={logout}
          className="w-full group flex items-center gap-3 px-3 py-2 text-[13px] font-medium rounded-lg text-rose-500 neo-button hover:bg-transparent transition-all duration-200"
        >
          <div className="flex items-center justify-center h-7 w-7 rounded-md">
            <LogOut className="h-[16px] w-[16px]" />
          </div>
          {t('nav.logout')}
        </button>

        {/* Version */}
        <div className="flex items-center gap-2 px-3 pt-3">
          <Zap className="h-3 w-3 text-emerald-500/50" />
          <span className="text-[10px] text-slate-600">v2.0.0 · Powered by ML</span>
        </div>
      </div>
    </aside>
  );
}
