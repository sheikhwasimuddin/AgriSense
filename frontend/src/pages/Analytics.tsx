import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { farmsService } from "@/services/farms";
import { analyticsService } from "@/services/analytics";
import { sensorsService } from "@/services/sensors";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gauge } from "@/components/ui/gauge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
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
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function Analytics() {
  const { t } = useTranslation();
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

  const cropDistributionData = [
    { name: 'Wheat', value: 400 },
    { name: 'Corn', value: 300 },
    { name: 'Rice', value: 300 },
    { name: 'Barley', value: 200 },
  ];
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('analytics.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('analytics.subtitle')}</p>
        </div>

        <div className="w-full sm:w-64">
          <Select value={activeFarmId} onValueChange={setSelectedFarmId}>
            <SelectTrigger className="bg-background neo-box border-none h-11">
              <SelectValue placeholder={farmsLoading ? "Loading..." : t('analytics.selectFarm')} />
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="neo-box border-none">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            {summaryLoading ? <Skeleton className="h-24 w-24 rounded-full neo-inset" /> : (
              <Gauge
                value={summary?.averages.temperature || 0}
                unit="°C"
                min={-10}
                max={50}
                label={t('analytics.avgTemp')}
                colorClass="text-orange-500"
                size={120}
              />
            )}
            <p className="text-xs text-muted-foreground mt-4">{t('analytics.over24h')}</p>
          </CardContent>
        </Card>
        
        <Card className="neo-box border-none">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            {summaryLoading ? <Skeleton className="h-24 w-24 rounded-full neo-inset" /> : (
              <Gauge
                value={summary?.averages.humidity || 0}
                unit="%"
                min={0}
                max={100}
                label={t('analytics.avgHum')}
                colorClass="text-blue-500"
                size={120}
              />
            )}
            <p className="text-xs text-muted-foreground mt-4">{t('analytics.over24h')}</p>
          </CardContent>
        </Card>

        <Card className="neo-box border-none">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            {summaryLoading ? <Skeleton className="h-24 w-24 rounded-full neo-inset" /> : (
              <Gauge
                value={summary?.averages.soil_moisture || 0}
                unit="%"
                min={0}
                max={100}
                label={t('analytics.avgSoil')}
                colorClass="text-amber-500"
                size={120}
              />
            )}
            <p className="text-xs text-muted-foreground mt-4">{t('analytics.over24h')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="neo-box border-none">
          <CardHeader>
            <CardTitle>Crop Distribution</CardTitle>
            <CardDescription>Current land allocation by crop type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full p-4 neo-inset rounded-2xl flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cropDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {cropDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px', border: 'none', color: '#fff' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="neo-box border-none">
          <CardHeader>
            <CardTitle>{t('analytics.tempVsSoil')}</CardTitle>
            <CardDescription>{t('analytics.tempVsSoilDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full p-4 neo-inset rounded-2xl">
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

        <Card className="neo-box border-none">
          <CardHeader>
            <CardTitle>{t('analytics.historicalVsPredicted')}</CardTitle>
            <CardDescription>{t('analytics.historicalVsPredictedDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full p-4 neo-inset rounded-2xl">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyYieldData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px', border: 'none', color: '#fff' }} />
                  <Legend />
                  <Bar dataKey="yield" name={t('analytics.actualYield')} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="predicted" name={t('analytics.predictedYield')} fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
