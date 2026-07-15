import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { farmsService } from "@/services/farms";
import { weatherService } from "@/services/weather";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { CloudSun, Droplets, Wind, Eye, Gauge } from "lucide-react";

export default function Weather() {
  const [selectedFarmId, setSelectedFarmId] = useState<string>("");

  const { data: farms, isLoading: farmsLoading } = useQuery({
    queryKey: ["farms"],
    queryFn: farmsService.getFarms,
  });

  const activeFarmId = selectedFarmId || (farms?.[0]?.id.toString() ?? "");

  const { data: weather, isLoading: weatherLoading } = useQuery({
    queryKey: ["weather", activeFarmId],
    queryFn: () => weatherService.getWeather(parseInt(activeFarmId)),
    enabled: !!activeFarmId,
    refetchInterval: 300000,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div className="space-y-8" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
            <CloudSun className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Weather Forecast</h1>
            <p className="text-muted-foreground mt-0.5">
              {weather ? `${weather.farm_name} · ${weather.location}` : "Real-time weather for your farms"}
            </p>
          </div>
        </div>
        <div className="w-full sm:w-64">
          <Select value={activeFarmId} onValueChange={setSelectedFarmId}>
            <SelectTrigger className="bg-background glass">
              <SelectValue placeholder={farmsLoading ? "Loading..." : "Select Farm"} />
            </SelectTrigger>
            <SelectContent>
              {farms?.map((farm) => (
                <SelectItem key={farm.id} value={farm.id.toString()}>{farm.farm_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {!activeFarmId ? (
        <div className="text-center py-20 glass rounded-xl">
          <CloudSun className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium">Select a farm to view weather</h3>
          <p className="text-muted-foreground">Choose a farm from the dropdown above.</p>
        </div>
      ) : weatherLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      ) : weather ? (
        <>
          <motion.div variants={itemVariants}>
            <Card className="glass border-black/10 dark:border-white/10 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500" />
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="text-center md:text-left">
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.current.icon}@4x.png`}
                      alt={weather.current.description}
                      className="h-32 w-32 mx-auto md:mx-0 drop-shadow-2xl"
                    />
                    <p className="text-lg capitalize text-muted-foreground font-medium">{weather.current.description}</p>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <span className="text-8xl font-black bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
                      {Math.round(weather.current.temp)}°
                    </span>
                    <p className="text-muted-foreground mt-1">Feels like {Math.round(weather.current.feels_like)}°C</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-background/50 border border-black/5 dark:border-white/5">
                      <Droplets className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Humidity</p>
                        <p className="text-lg font-bold">{weather.current.humidity}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-background/50 border border-black/5 dark:border-white/5">
                      <Wind className="h-5 w-5 text-emerald-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Wind</p>
                        <p className="text-lg font-bold">{weather.current.wind_speed} m/s</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-background/50 border border-black/5 dark:border-white/5">
                      <Gauge className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Pressure</p>
                        <p className="text-lg font-bold">{weather.current.pressure} hPa</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-background/50 border border-black/5 dark:border-white/5">
                      <Eye className="h-5 w-5 text-amber-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Visibility</p>
                        <p className="text-lg font-bold">{(weather.current.visibility / 1000).toFixed(1)} km</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-bold mb-4">5-Day Forecast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {weather.forecast.map((day: any, i: number) => (
                <motion.div key={day.date} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="glass border-black/10 dark:border-white/10 text-center hover:border-sky-500/30 transition-colors">
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground font-medium">
                        {new Date(day.date).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })}
                      </p>
                      <img
                        src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                        alt={day.description}
                        className="h-16 w-16 mx-auto"
                      />
                      <p className="text-sm capitalize text-muted-foreground">{day.description}</p>
                      <div className="flex justify-center gap-2 mt-2">
                        <span className="text-lg font-bold">{Math.round(day.temp_max)}°</span>
                        <span className="text-lg text-muted-foreground">{Math.round(day.temp_min)}°</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Droplets className="h-3 w-3" /> {day.humidity}%
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      ) : null}
    </motion.div>
  );
}
