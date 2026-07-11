import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { farmsService } from "@/services/farms";
import { analyticsService } from "@/services/analytics";
import { sensorsService } from "@/services/sensors";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function Analytics() {
  const [selectedFarmId, setSelectedFarmId] = useState<string>("");

  const { data: farms, isLoading: farmsLoading } = useQuery({
    queryKey: ["farms"],
    queryFn: farmsService.getFarms,
  });

  const activeFarmId = selectedFarmId || (farms?.[0]?.id.toString() ?? "");

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["analytics-summary", activeFarmId],
    queryFn: () => analyticsService.getSummary(parseInt(activeFarmId)),
    enabled: !!activeFarmId,
  });

  const { data: history } = useQuery({
    queryKey: ["sensors-history", activeFarmId],
    queryFn: () => sensorsService.getHistory(parseInt(activeFarmId)),
    enabled: !!activeFarmId,
  });

  const areaData = history?.map(h => ({
    time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: h.temperature,
    hum: h.humidity,
    soil: h.soil_moisture
  })).reverse() || [];

  // Mock monthly yield data for bar chart since we don't have a history table for yields yet
  const monthlyYieldData = [
    { month: 'Jan', yield: 120, predicted: 125 },
    { month: 'Feb', yield: 132, predicted: 130 },
    { month: 'Mar', yield: 141, predicted: 145 },
    { month: 'Apr', yield: 155, predicted: 150 },
    { month: 'May', yield: 162, predicted: 160 },
    { month: 'Jun', yield: 178, predicted: 175 },
    { month: 'Jul', yield: 185, predicted: 190 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground mt-1">Deep dive into historical data and trends.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-500">
              {summaryLoading ? <Skeleton className="h-10 w-24" /> : `${summary?.averages.temperature.toFixed(1)}°`}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Over the last 24 hours</p>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Humidity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-500">
              {summaryLoading ? <Skeleton className="h-10 w-24" /> : `${summary?.averages.humidity.toFixed(1)}%`}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Over the last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avg Soil Moisture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-amber-600">
              {summaryLoading ? <Skeleton className="h-10 w-24" /> : `${summary?.averages.soil_moisture.toFixed(1)}%`}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Over the last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Temperature vs Soil Moisture Trends</CardTitle>
            <CardDescription>Correlation between heat and soil retention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSoil" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d97706" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px', border: 'none', color: '#fff' }} />
                  <Area type="monotone" dataKey="temp" stroke="#f97316" fillOpacity={1} fill="url(#colorTemp)" />
                  <Area type="monotone" dataKey="soil" stroke="#d97706" fillOpacity={1} fill="url(#colorSoil)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Historical vs Predicted Yields</CardTitle>
            <CardDescription>Monthly harvest performance tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyYieldData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px', border: 'none', color: '#fff' }} />
                  <Legend />
                  <Bar dataKey="yield" name="Actual Yield" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="predicted" name="Predicted Yield" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
