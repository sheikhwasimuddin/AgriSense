import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme-provider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Bell,
  Moon,
  Sun,
  Search,
  Menu,
  LayoutDashboard,
  Tractor,
  Activity,
  Droplets,
  LineChart,
  User as UserIcon,
  Settings,
  LogOut,
  Sprout,
  ChevronDown,
  Command,
  Bug,
} from "lucide-react";

const mobileNav = [
  { nameKey: "nav.dashboard", href: "/", icon: LayoutDashboard },
  { nameKey: "nav.myFarms", href: "/farms", icon: Tractor },
  { nameKey: "nav.yieldPrediction", href: "/prediction", icon: Activity },
  { nameKey: "nav.diseaseDetection", href: "/disease", icon: Bug },
  { nameKey: "nav.iotSensors", href: "/sensors", icon: Droplets },
  { nameKey: "nav.analytics", href: "/analytics", icon: LineChart },
  { nameKey: "nav.profile", href: "/profile", icon: UserIcon },
  { nameKey: "nav.settings", href: "/settings", icon: Settings },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="h-14 flex items-center justify-between px-4 sm:px-6 bg-background z-30 relative neo-box-sm rounded-none border-b-0">
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-3 flex-1">
        {/* Mobile sidebar trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden flex items-center justify-center h-8 w-8 rounded-md text-slate-400 hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-colors">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] bg-background border-black/[0.1] dark:border-white/[0.06] p-0">
            <SheetHeader className="p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
            </SheetHeader>
            {/* Mobile sidebar content */}
            <div className="flex flex-col h-full">
              <div className="h-14 flex items-center gap-3 px-5 border-b border-black/[0.1] dark:border-white/[0.06]">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Sprout className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  AgriSense
                </span>
                <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  AI
                </span>
              </div>
              <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
                <p className="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  {t('nav.mainMenu')}
                </p>
                {mobileNav.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.href === "/"}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "text-slate-400 hover:text-slate-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                      )
                    }
                  >
                    <div className="flex items-center justify-center h-7 w-7 rounded-md text-inherit">
                      <item.icon className="h-4 w-4" />
                    </div>
                    {t(item.nameKey)}
                  </NavLink>
                ))}
              </nav>
              <div className="p-3 border-t border-black/[0.1] dark:border-white/[0.06]">
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="w-full group flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-lg text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
                >
                  <div className="flex items-center justify-center h-7 w-7 rounded-md">
                    <LogOut className="h-4 w-4" />
                  </div>
                  {t('nav.logout')}
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Search bar */}
        <div className="hidden sm:flex items-center gap-2 w-full max-w-xs">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-focus-within:text-slate-300 transition-colors" />
            <input
              type="text"
              placeholder={t('nav.search')}
              className="w-full h-8 bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.1] dark:border-white/[0.06] rounded-lg pl-9 pr-12 text-[13px] text-slate-300 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/20 focus:bg-black/[0.06] dark:focus:bg-white/[0.06] transition-all"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:inline-flex items-center gap-0.5 text-[10px] text-slate-500 font-medium bg-black/[0.06] dark:bg-white/[0.06] border border-black/[0.1] dark:border-white/[0.06] rounded px-1.5 py-0.5">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Notification */}
        <button className="relative flex items-center justify-center h-8 w-8 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-background" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center justify-center h-8 w-8 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-black/[0.08] dark:bg-white/[0.08] mx-2" />

        {/* User */}
        <div className="flex items-center gap-2.5 pl-1 group cursor-pointer">
          <Avatar className="h-7 w-7 ring-1 ring-black/[0.1] dark:ring-white/[0.1]">
            <AvatarFallback className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400 font-semibold text-[10px]">
              {user?.full_name?.substring(0, 2).toUpperCase() || "US"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:flex flex-col">
            <span className="text-[12px] font-medium text-slate-900 dark:text-slate-200 leading-tight">
              {user?.full_name || "User"}
            </span>
            <span className="text-[10px] text-slate-500 leading-tight">
              {user?.email || ""}
            </span>
          </div>
          <ChevronDown className="h-3 w-3 text-slate-500 hidden lg:block" />
        </div>
      </div>
    </header>
  );
}
