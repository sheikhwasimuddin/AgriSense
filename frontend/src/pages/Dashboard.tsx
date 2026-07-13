import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { farmsService } from "@/services/farms";
import { sensorsService } from "@/services/sensors";
import { analyticsService } from "@/services/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ThermometerSun,
  Droplets,
  Activity,
  MapPin,
  Tractor,
  Sprout,
  TrendingUp,
  Brain,
  Wifi,
  Database,
  Globe,
  Ruler,
  Wheat,
  Calendar,
  ArrowRight,
  Sun,
  CloudRain,
  FlaskConical,
} from "lucide-react";

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const statCardVariants: any = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function Dashboard() {
  const { t } = useTranslation();
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);

  const { data: farms, isLoading: farmsLoading } = useQuery({
    queryKey: ["farms"],
    queryFn: farmsService.getFarms,
  });

  useEffect(() => {
    if (farms && farms.length > 0 && selectedFarmId === null) {
      setSelectedFarmId(farms[0].id);
    }
  }, [farms, selectedFarmId]);

  const activeFarm = farms?.find((f) => f.id === selectedFarmId) || (farms && farms.length > 0 ? farms[0] : null);

  const { data: sensors, isLoading: sensorsLoading } = useQuery({
    queryKey: ["sensors", activeFarm?.id],
    queryFn: () => sensorsService.getLatest(activeFarm!.id),
    enabled: !!activeFarm,
    refetchInterval: 10000,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["analytics", activeFarm?.id],
    queryFn: () => analyticsService.getSummary(activeFarm!.id),
    enabled: !!activeFarm,
  });

  const isLoading = farmsLoading || sensorsLoading || analyticsLoading;

  const statCards = [
    {
      label: "Temperature",
      value: sensors?.temperature,
      unit: "°C",
      avg: analytics?.averages?.temperature,
      icon: ThermometerSun,
      gradient: "from-orange-500 to-amber-400",
      glowColor: "rgba(249,115,22,0.12)",
      accentLine: "from-orange-500 via-amber-400 to-orange-300",
      iconBg: "from-orange-500/20 to-amber-400/20",
      iconColor: "text-orange-400",
    },
    {
      label: "Humidity",
      value: sensors?.humidity,
      unit: "%",
      avg: analytics?.averages?.humidity,
      icon: Droplets,
      gradient: "from-blue-500 to-cyan-400",
      glowColor: "rgba(59,130,246,0.12)",
      accentLine: "from-blue-500 via-cyan-400 to-blue-300",
      iconBg: "from-blue-500/20 to-cyan-400/20",
      iconColor: "text-blue-400",
    },
    {
      label: "Soil Moisture",
      value: sensors?.soil_moisture,
      unit: "%",
      avg: analytics?.averages?.soil_moisture,
      icon: Droplets,
      gradient: "from-amber-500 to-yellow-400",
      glowColor: "rgba(245,158,11,0.12)",
      accentLine: "from-amber-500 via-yellow-400 to-amber-300",
      iconBg: "from-amber-500/20 to-yellow-400/20",
      iconColor: "text-amber-400",
    },
    {
      label: "Latest Yield",
      value: analytics?.latest_prediction,
      unit: " t/ha",
      avg: null,
      icon: TrendingUp,
      gradient: "from-emerald-500 to-cyan-400",
      glowColor: "rgba(16,185,129,0.12)",
      accentLine: "from-emerald-500 via-cyan-400 to-emerald-300",
      iconBg: "from-emerald-500/20 to-cyan-400/20",
      iconColor: "text-emerald-400",
    },
    {
      label: "Soil pH",
      value: sensors?.soil_ph,
      unit: "",
      avg: null,
      icon: FlaskConical,
      gradient: "from-fuchsia-500 to-purple-400",
      glowColor: "rgba(217,70,239,0.12)",
      accentLine: "from-fuchsia-500 via-purple-400 to-fuchsia-300",
      iconBg: "from-fuchsia-500/20 to-purple-400/20",
      iconColor: "text-fuchsia-400",
    },
    {
      label: "Rainfall",
      value: sensors?.rainfall,
      unit: " mm",
      avg: null,
      icon: CloudRain,
      gradient: "from-blue-600 to-indigo-400",
      glowColor: "rgba(79,70,229,0.12)",
      accentLine: "from-blue-600 via-indigo-400 to-blue-400",
      iconBg: "from-blue-600/20 to-indigo-400/20",
      iconColor: "text-blue-400",
    },
    {
      label: "Light Intensity",
      value: sensors?.light_intensity,
      unit: " lx",
      avg: null,
      icon: Sun,
      gradient: "from-yellow-400 to-amber-300",
      glowColor: "rgba(250,204,21,0.12)",
      accentLine: "from-yellow-400 via-amber-300 to-yellow-200",
      iconBg: "from-yellow-400/20 to-amber-300/20",
      iconColor: "text-yellow-400",
    },
  ];

  const systemStatuses = [
    {
      label: "ML Prediction Engine",
      status: "Online",
      icon: Brain,
    },
    {
      label: "IoT Sensor Sync",
      status: "Active",
      icon: Wifi,
    },
    {
      label: "Database Connection",
      status: "Connected",
      icon: Database,
    },
  ];

  const farmDetailRows = activeFarm
    ? [
        {
          label: "Farm Name",
          value: activeFarm.farm_name,
          icon: Tractor,
        },
        {
          label: "Location",
          value: activeFarm.location,
          icon: MapPin,
        },
        {
          label: "Area",
          value: `${activeFarm.area} hectares`,
          icon: Ruler,
        },
        {
          label: "Primary Crop",
          value: activeFarm.crop,
          icon: Wheat,
        },
        {
          label: "Added",
          value: activeFarm.created_at ? new Date(activeFarm.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }) : "N/A",
          icon: Calendar,
        },
      ]
    : [];

  // --- Empty State ---
  if (!farmsLoading && !activeFarm) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col items-center text-center max-w-md"
        >
          {/* Floating animated gradient circle */}
          <div className="relative mb-8">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-emerald-500/5 flex items-center justify-center backdrop-blur-sm border border-black/[0.1] dark:border-white/[0.06]">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 flex items-center justify-center">
                  <Sprout className="h-10 w-10 text-emerald-400" />
                </div>
              </div>
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 blur-2xl -z-10 scale-150" />
            </motion.div>
          </div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-3">
            {t('dashboard.welcome')}
          </h2>
          <p className="text-slate-900/50 dark:text-white/50 text-base leading-relaxed mb-8">
            {t('dashboard.subtitle')}
          </p>
          <Link
            to="/farms"
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  // --- Main Dashboard ---
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-500 dark:from-white dark:via-white/90 dark:to-white/60 bg-clip-text text-transparent leading-tight">
              {t('nav.dashboard')}
            </h1>
            {activeFarm && (
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-400/70" />
                <span className="text-sm text-slate-900/40 dark:text-white/40">
                  {activeFarm.location}
                </span>
              </div>
            )}
          </div>
        </div>

        {farms && farms.length > 0 && (
          <div className="w-full sm:w-[240px]">
            <Select
              value={selectedFarmId?.toString() || ""}
              onValueChange={(val) => setSelectedFarmId(parseInt(val))}
            >
              <SelectTrigger className="h-11 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border-black/[0.1] dark:border-white/[0.08] focus:border-emerald-500/50">
                <SelectValue placeholder="Select a farm" />
              </SelectTrigger>
              <SelectContent className="glass border-black/[0.1] dark:border-white/[0.08]">
                {farms.map((farm) => (
                  <SelectItem key={farm.id} value={farm.id.toString()}>
                    {farm.farm_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              custom={i}
              variants={statCardVariants}
              initial="hidden"
              animate="visible"
              className="group glass overflow-hidden relative rounded-2xl border border-black/[0.1] dark:border-white/[0.06] hover:border-white/[0.1] transition-all duration-500"
            >
              {/* Gradient accent line */}
              <div
                className={`h-0.5 w-full bg-gradient-to-r ${stat.accentLine}`}
              />

              {/* Shimmer overlay on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </div>

              <div className="p-5 relative">
                {/* Icon badge top-right */}
                <div className="absolute top-4 right-4">
                  <div
                    className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center border border-black/[0.1] dark:border-white/[0.04]`}
                  >
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </div>

                <p className="text-xs font-medium text-slate-900/40 dark:text-white/40 uppercase tracking-wider mb-3">
                  {stat.label}
                </p>

                {isLoading ? (
                  <Skeleton className="h-9 w-24 bg-black/[0.06] dark:bg-white/[0.06] rounded-lg" />
                ) : (
                  <>
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {stat.value != null
                        ? `${typeof stat.value === "number" ? stat.value.toFixed(1) : stat.value}${stat.unit}`
                        : "—"}
                    </p>
                    {stat.avg != null && (
                      <p className="text-xs text-slate-900/30 dark:text-white/30 mt-1.5">
                        Avg:{" "}
                        {typeof stat.avg === "number"
                          ? stat.avg.toFixed(1)
                          : stat.avg}
                        {stat.unit}
                      </p>
                    )}
                    {stat.label === "Latest Yield" && (
                      <p className="text-xs text-slate-900/30 dark:text-white/30 mt-1.5">
                        Predicted yield
                      </p>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Farm Details */}
        <motion.div
          variants={itemVariants}
          className="glass rounded-2xl overflow-hidden border border-black/[0.1] dark:border-white/[0.06]"
        >
          <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300" />
          <div className="p-6">
            <h3 className="text-sm font-semibold text-slate-900/60 dark:text-white/60 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400/70" />
              Farm Details
            </h3>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-5 w-full bg-black/[0.04] dark:bg-white/[0.04] rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-0">
                {farmDetailRows.map((row, i) => {
                  const RowIcon = row.icon;
                  return (
                    <div
                      key={row.label}
                      className={`flex items-center justify-between py-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors duration-200 rounded-lg px-1 ${
                        i < farmDetailRows.length - 1
                          ? "border-b border-black/[0.1] dark:border-white/[0.04]"
                          : ""
                      }`}
                    >
                      <span className="flex items-center gap-2.5 text-sm text-slate-900/40 dark:text-white/40">
                        <RowIcon className="h-4 w-4 text-slate-900/20 dark:text-white/20" />
                        {t(`dashboard.details.${row.label.toLowerCase().replace(' ', '_')}`)}
                      </span>
                      <span className="text-sm font-medium text-slate-900/80 dark:text-white/80">
                        {row.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          variants={itemVariants}
          className="glass rounded-2xl overflow-hidden border border-black/[0.1] dark:border-white/[0.06]"
        >
          <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-300" />
          <div className="p-6">
            <h3 className="text-sm font-semibold text-slate-900/60 dark:text-white/60 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Globe className="h-4 w-4 text-cyan-400/70" />
              System Status
            </h3>

            <div className="space-y-0">
              {systemStatuses.map((item, i) => {
                const StatusIcon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between py-3.5 px-1 ${
                      i < systemStatuses.length - 1
                        ? "border-b border-black/[0.1] dark:border-white/[0.04]"
                        : ""
                    }`}
                  >
                    <span className="flex items-center gap-3 text-sm text-slate-900/70 dark:text-white/70">
                      <div className="h-8 w-8 rounded-lg bg-black/[0.04] dark:bg-white/[0.04] flex items-center justify-center border border-black/[0.1] dark:border-white/[0.04]">
                        <StatusIcon className="h-4 w-4 text-slate-900/40 dark:text-white/40" />
                      </div>
                      {item.label}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-emerald-400/90 font-medium">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                      </span>
                      {item.status}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-black/[0.1] dark:border-white/[0.04]">
              <p className="text-xs text-slate-900/25 dark:text-white/25">
                Last updated: just now
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
