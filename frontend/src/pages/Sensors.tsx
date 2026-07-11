import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { farmsService } from "@/services/farms";
import { sensorsService } from "@/services/sensors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThermometerSun, Droplets, FlaskConical, CloudRain, Sun, Activity, Wifi } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Sensors() {
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
            IoT Sensors
            <div className="ml-3 flex items-center px-2 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium border border-green-500/20">
              <span className="relative flex h-2 w-2 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live Sync
            </div>
          </h1>
          <p className="text-muted-foreground mt-1">Real-time telemetry from your field sensors.</p>
        </div>

        <div className="w-full sm:w-64">
          <Select value={activeFarmId} onValueChange={setSelectedFarmId}>
            <SelectTrigger className="bg-background glass">
              <SelectValue placeholder={farmsLoading ? "Loading..." : "Select Farm"} />
            </SelectTrigger>
            <SelectContent>
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
        <div className="text-center py-12 glass rounded-xl">
          <Wifi className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium text-foreground">No Farm Selected</h3>
          <p className="text-muted-foreground">Select a farm from the dropdown or add one first.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
              <Card className="glass border-orange-500/20">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <ThermometerSun className="h-8 w-8 text-orange-500 mb-2" />
                  <span className="text-sm text-muted-foreground">Temperature</span>
                  <span className="text-3xl font-bold mt-1">
                    {latestLoading ? <Skeleton className="h-8 w-16" /> : `${latest?.temperature.toFixed(1)}°`}
                  </span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
              <Card className="glass border-blue-500/20">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <Droplets className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-sm text-muted-foreground">Humidity</span>
                  <span className="text-3xl font-bold mt-1">
                    {latestLoading ? <Skeleton className="h-8 w-16" /> : `${latest?.humidity.toFixed(1)}%`}
                  </span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}>
              <Card className="glass border-amber-600/20">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <Activity className="h-8 w-8 text-amber-600 mb-2" />
                  <span className="text-sm text-muted-foreground">Soil Moisture</span>
                  <span className="text-3xl font-bold mt-1">
                    {latestLoading ? <Skeleton className="h-8 w-16" /> : `${latest?.soil_moisture.toFixed(1)}%`}
                  </span>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mocked extra sensors for a premium look */}
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }}>
              <Card className="glass border-purple-500/20">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center opacity-70">
                  <FlaskConical className="h-8 w-8 text-purple-500 mb-2" />
                  <span className="text-sm text-muted-foreground">Soil pH</span>
                  <span className="text-3xl font-bold mt-1">6.8</span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }}>
              <Card className="glass border-cyan-500/20">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center opacity-70">
                  <CloudRain className="h-8 w-8 text-cyan-500 mb-2" />
                  <span className="text-sm text-muted-foreground">Rainfall</span>
                  <span className="text-3xl font-bold mt-1">12<span className="text-lg">mm</span></span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6 }}>
              <Card className="glass border-yellow-500/20">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center opacity-70">
                  <Sun className="h-8 w-8 text-yellow-500 mb-2" />
                  <span className="text-sm text-muted-foreground">Light (LUX)</span>
                  <span className="text-3xl font-bold mt-1">45k</span>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Live Charts */}
          <Card className="glass mt-8">
            <CardHeader>
              <CardTitle>Real-Time Telemetry Graph</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
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
