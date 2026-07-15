import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { farmsService } from "@/services/farms";
import { sensorsService } from "@/services/sensors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gauge } from "@/components/ui/gauge";
import { ThermometerSun, Droplets, FlaskConical, CloudRain, Sun, Activity, Wifi } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";

export default function Sensors() {
  const { t } = useTranslation();
  const [selectedFarmId, setSelectedFarmId] = useState<string>("");

  const { data: farms, isLoading: farmsLoading } = useQuery({
    queryKey: ["farms"],
    queryFn: farmsService.getFarms,
  });

  // Default to first farm if none selected
  const activeFarmId = selectedFarmId || (farms?.[0]?.id.toString() ?? "");

  const { data: latest, isLoading: latestLoading } = useQuery({
    queryKey: ["sensors-latest", activeFarmId],
    queryFn: () => sensorsService.getLatest(parseInt(activeFarmId)),
    enabled: !!activeFarmId,
    refetchInterval: 10000, // Refresh every 10s
  });

  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ["sensors-history", activeFarmId],
    queryFn: () => sensorsService.getHistory(parseInt(activeFarmId)),
    enabled: !!activeFarmId,
  });

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const chartData = history?.map(h => ({
    time: formatTime(h.timestamp),
    temp: h.temperature,
    hum: h.humidity,
    soil: h.soil_moisture
  })).reverse() || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            {t('sensors.title')}
            <div className="ml-3 flex items-center px-2 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium border border-green-500/20">
              <span className="relative flex h-2 w-2 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              {t('sensors.liveSync')}
            </div>
          </h1>
          <p className="text-muted-foreground mt-1">{t('sensors.subtitle')}</p>
        </div>

        <div className="w-full sm:w-64">
          <Select value={activeFarmId} onValueChange={setSelectedFarmId}>
            <SelectTrigger className="bg-background neo-box border-none h-11">
              <SelectValue placeholder={farmsLoading ? "Loading..." : "Select Farm"} />
            </SelectTrigger>
            <SelectContent className="neo-box border-none">
              {farms?.map((farm) => (
                <SelectItem key={farm.id} value={farm.id.toString()}>
                  {farm.farm_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!activeFarmId ? (
        <div className="text-center py-12 neo-inset rounded-xl">
          <Wifi className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium text-foreground">{t('sensors.noFarm')}</h3>
          <p className="text-muted-foreground">{t('sensors.noFarmDesc')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
              <Card className="neo-box border-none h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  {latestLoading ? <Skeleton className="h-24 w-24 rounded-full neo-inset" /> : (
                    <Gauge
                      value={latest?.temperature || 0}
                      unit="°C"
                      min={-10}
                      max={50}
                      label={t('sensors.temperature')}
                      colorClass="text-orange-500"
                      size={100}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
              <Card className="neo-box border-none h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  {latestLoading ? <Skeleton className="h-24 w-24 rounded-full neo-inset" /> : (
                    <Gauge
                      value={latest?.humidity || 0}
                      unit="%"
                      min={0}
                      max={100}
                      label={t('sensors.humidity')}
                      colorClass="text-blue-500"
                      size={100}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}>
              <Card className="neo-box border-none h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  {latestLoading ? <Skeleton className="h-24 w-24 rounded-full neo-inset" /> : (
                    <Gauge
                      value={latest?.soil_moisture || 0}
                      unit="%"
                      min={0}
                      max={100}
                      label={t('sensors.soilMoisture')}
                      colorClass="text-amber-500"
                      size={100}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Mocked extra sensors for a premium look */}
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }}>
              <Card className="neo-box border-none h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center opacity-70 h-full">
                  <Gauge
                      value={6.8}
                      min={0}
                      max={14}
                      label={t('sensors.soilPh')}
                      colorClass="text-purple-500"
                      size={100}
                    />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }}>
              <Card className="neo-box border-none h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center opacity-70 h-full">
                  <Gauge
                      value={12}
                      unit="mm"
                      min={0}
                      max={50}
                      label={t('sensors.rainfall')}
                      colorClass="text-cyan-500"
                      size={100}
                    />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6 }}>
              <Card className="neo-box border-none h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center opacity-70 h-full">
                  <Gauge
                      value={45}
                      unit="k lx"
                      min={0}
                      max={100}
                      label={t('sensors.light')}
                      colorClass="text-yellow-500"
                      size={100}
                    />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Live Charts */}
          <Card className="neo-box border-none mt-8">
            <CardHeader>
              <CardTitle>{t('sensors.graphTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full p-4 neo-inset rounded-2xl">
                {historyLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                      <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px', border: 'none', color: '#fff' }}
                      />
                      <Line type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="hum" name="Humidity (%)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="soil" name="Soil Moisture (%)" stroke="#d97706" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
