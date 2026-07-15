import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { farmsService } from "@/services/farms";
import { predictionService } from "@/services/prediction";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gauge } from "@/components/ui/gauge";
import { Loader2, TrendingUp, Sprout, Droplets, Thermometer, Bug, MapPin, Calendar, Wheat, Volume2, Square, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  farm_id: z.string().optional(),
  Area: z.string().min(2, "Region name is required"),
  Item: z.string().min(2, "Crop name is required"),
  Year: z.coerce.number().min(2000).max(2100),
  average_rain_fall_mm_per_year: z.coerce.number().min(0),
  avg_temp: z.coerce.number(),
  pesticides_tonnes: z.coerce.number().min(0),
});

export default function Prediction() {
  const { t } = useTranslation();
  const [result, setResult] = useState<number | null>(null);
  const [resultTonnes, setResultTonnes] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  
  const queryClient = useQueryClient();
  
  const { data: farms, isLoading: farmsLoading } = useQuery({
    queryKey: ["farms"],
    queryFn: farmsService.getFarms,
  });



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      farm_id: "",
      Area: "",
      Item: "",
      Year: new Date().getFullYear(),
      average_rain_fall_mm_per_year: 1000,
      avg_temp: 25,
      pesticides_tonnes: 100,
    },
  });

  const selectedFarmId = form.watch("farm_id");

  const { data: yieldHistory } = useQuery({
    queryKey: ["yieldHistory", selectedFarmId],
    queryFn: () => predictionService.getYieldHistory(parseInt(selectedFarmId!)),
    enabled: !!selectedFarmId && selectedFarmId !== "none" && selectedFarmId !== "",
  });

  function generateAIExplanation(values: any, tonnes: number) {
    return `Hello! Based on your environmental inputs for ${values.Area}, if you plant ${values.Item} with an average rainfall of ${values.average_rain_fall_mm_per_year} millimeters and an average temperature of ${values.avg_temp} degrees Celsius, our Artificial Intelligence model predicts an estimated yield of ${tonnes.toFixed(2)} tonnes per hectare.`;
  }

  function toggleAudio() {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel(); // clear any previous speech
      const utterance = new SpeechSynthesisUtterance(aiExplanation);
      utterance.rate = 0.95; // slightly slower for better comprehension
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  }

  const predictMutation = useMutation({
    mutationFn: predictionService.predictYield,
    onSuccess: (data) => {
      const yieldInHg = data.prediction;
      const yieldInTonnes = yieldInHg / 10000;
      
      setResult(yieldInHg);
      setResultTonnes(yieldInTonnes);
      setAiExplanation(generateAIExplanation(form.getValues(), yieldInTonnes));
      setError(null);
      
      // Stop any playing audio if new prediction comes in
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      }
      
      queryClient.invalidateQueries({ queryKey: ["yieldHistory"] });
    },
    onError: (err: any) => {
      setError(err?.response?.data?.detail || "Prediction failed. Please try again.");
      setResult(null);
      setResultTonnes(null);
      setAiExplanation("");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload: any = {
      Area: values.Area,
      Item: values.Item,
      Year: values.Year,
      average_rain_fall_mm_per_year: values.average_rain_fall_mm_per_year,
      avg_temp: values.avg_temp,
      pesticides_tonnes: values.pesticides_tonnes,
    };
    
    // Only include farm_id if one was selected
    if (values.farm_id && values.farm_id !== "" && values.farm_id !== "none") {
      payload.farm_id = parseInt(values.farm_id);
    }
    
    predictMutation.mutate(payload);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <Sprout className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
            {t('prediction.title')}
          </h1>
          <p className="text-muted-foreground mt-0.5">
            {t('prediction.subtitle')}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form Panel - 3 columns */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card className="neo-box overflow-hidden relative">
            
            <CardHeader className="pb-4 pt-6">
              <CardTitle className="text-xl">{t('prediction.params')}</CardTitle>
              <CardDescription>{t('prediction.paramsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Farm Selection */}
                    <FormField
                      control={form.control}
                      name="farm_id"
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-medium">
                            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                            {t('prediction.targetFarm')}
                            <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background/50 border-black/10 dark:border-white/10 h-11 rounded-xl hover:border-emerald-500/30 transition-colors">
                                <SelectValue placeholder={farmsLoading ? "Loading..." : "No farm (quick test)"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">No farm (quick test)</SelectItem>
                              {farms?.map((farm) => (
                                <SelectItem key={farm.id} value={farm.id.toString()}>
                                  {farm.farm_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Year */}
                    <FormField
                      control={form.control}
                      name="Year"
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-medium">
                            <Calendar className="h-3.5 w-3.5 text-blue-400" />
                            {t('prediction.targetYear')}
                          </FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="bg-background/50 border-black/10 dark:border-white/10 h-11 rounded-xl hover:border-blue-500/30 transition-colors" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Region */}
                    <FormField
                      control={form.control}
                      name="Area"
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-medium">
                            <MapPin className="h-3.5 w-3.5 text-purple-400" />
                            {t('prediction.region')}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. India" {...field} className="bg-background/50 border-black/10 dark:border-white/10 h-11 rounded-xl hover:border-purple-500/30 transition-colors" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Crop Type */}
                    <FormField
                      control={form.control}
                      name="Item"
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-medium">
                            <Wheat className="h-3.5 w-3.5 text-amber-400" />
                            {t('prediction.cropType')}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Wheat" {...field} className="bg-background/50 border-black/10 dark:border-white/10 h-11 rounded-xl hover:border-amber-500/30 transition-colors" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Rainfall */}
                    <FormField
                      control={form.control}
                      name="average_rain_fall_mm_per_year"
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-medium">
                            <Droplets className="h-3.5 w-3.5 text-cyan-400" />
                            {t('prediction.rainfall')}
                          </FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="bg-background/50 border-black/10 dark:border-white/10 h-11 rounded-xl hover:border-sky-500/30 transition-colors" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Temperature */}
                    <FormField
                      control={form.control}
                      name="avg_temp"
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-medium">
                            <Thermometer className="h-3.5 w-3.5 text-orange-400" />
                            {t('prediction.temperature')}
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} className="bg-background/50 border-black/10 dark:border-white/10 h-11 rounded-xl hover:border-orange-500/30 transition-colors" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Pesticides - full width */}
                    <FormField
                      control={form.control}
                      name="pesticides_tonnes"
                      render={({ field }: any) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="flex items-center gap-2 text-sm font-medium">
                            <Bug className="h-3.5 w-3.5 text-rose-400" />
                            {t('prediction.pesticides')}
                          </FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="bg-background/50 border-black/10 dark:border-white/10 h-11 rounded-xl hover:border-red-500/30 transition-colors" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold neo-button text-emerald-500 hover:text-emerald-400 transition-all duration-300 border-0" 
                    disabled={predictMutation.isPending}
                  >
                    {predictMutation.isPending ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Predicting...</>
                    ) : (
                      <><TrendingUp className="mr-2 h-5 w-5" /> {t('prediction.predictYield')}</>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Panel - 2 columns */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="neo-box h-full overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
            
            <CardHeader className="text-center pb-2 pt-6">
              <CardTitle className="text-xl">{t('prediction.result')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[calc(100%-80px)] p-6">
              <AnimatePresence mode="wait">
                {predictMutation.isPending ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center space-y-5"
                  >
                    <div className="relative">
                      <div className="h-28 w-28 mx-auto rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                        <Loader2 className="h-12 w-12 text-emerald-400 animate-spin" />
                      </div>
                      <div className="absolute inset-0 h-28 w-28 mx-auto rounded-full bg-emerald-400/10 animate-ping" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Processing prediction...</p>
                      <p className="text-xs text-muted-foreground mt-1">Running Extra Trees Regressor model</p>
                    </div>
                  </motion.div>
                ) : error ? (
                  <motion.div 
                    key="error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center space-y-4 w-full"
                  >
                    <div className="h-28 w-28 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <span className="text-4xl">⚠️</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-400">Prediction Failed</p>
                      <p className="text-xs text-muted-foreground mt-1">{error}</p>
                    </div>
                  </motion.div>
                ) : result !== null ? (
                  <motion.div 
                    key="result"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="text-center w-full space-y-6"
                  >
                    {/* Main Result */}
                    <div className="py-6 px-6 neo-inset rounded-2xl flex flex-col items-center">
                      <span className="block text-sm text-muted-foreground mb-4 uppercase tracking-wider">Estimated Yield</span>
                      <Gauge
                        value={resultTonnes || 0}
                        unit="t/ha"
                        min={0}
                        max={10}
                        colorClass="text-emerald-500"
                        size={140}
                        strokeWidth={10}
                      />
                      <span className="block text-xs text-muted-foreground mt-4 opacity-60">({result.toFixed(2)} hg/ha)</span>
                    </div>
                    
                    {/* Model Info */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl neo-box-sm">
                        <span className="text-xs text-muted-foreground block">Model</span>
                        <span className="text-sm font-semibold text-foreground">Extra Trees</span>
                      </div>
                      <div className="p-3 rounded-xl neo-box-sm">
                        <span className="text-xs text-muted-foreground block">Accuracy</span>
                        <span className="text-sm font-semibold text-emerald-400">98.89% R²</span>
                      </div>
                    </div>

                    {/* AI Insights Panel */}
                    <div className="mt-6 text-left border border-emerald-500/30 bg-emerald-500/5 rounded-xl p-5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 mb-2 text-emerald-400 font-medium">
                          <Bot className="h-4 w-4" /> {t('prediction.aiAnalysis')}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                          onClick={toggleAudio}
                        >
                          {isPlaying ? (
                            <><Square className="h-4 w-4 mr-2 fill-current" /> Stop</>
                          ) : (
                            <><Volume2 className="h-4 w-4 mr-2" /> Read Aloud</>
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {aiExplanation}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-muted-foreground space-y-5"
                  >
                    <div className="relative">
                      <div className="h-28 w-28 mx-auto rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-black/5 dark:border-white/5 flex items-center justify-center">
                        <TrendingUp className="h-12 w-12 text-slate-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground/60">No prediction yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Fill out the form and click the button<br/>to see your ML prediction.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* History Panel - Full width below */}
        {selectedFarmId && selectedFarmId !== "none" && yieldHistory && yieldHistory.length > 0 && (
          <motion.div variants={itemVariants} className="lg:col-span-5 mt-4">
            <Card className="neo-box overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-500" />
                  Prediction History
                </CardTitle>
                <CardDescription>Past predictions for the selected farm</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {yieldHistory.map((history) => (
                    <div key={history.id} className="p-4 rounded-xl neo-box-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-semibold text-foreground">{history.crop} ({history.year})</span>
                        <span className="text-xs text-muted-foreground">{new Date(history.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="text-2xl font-bold text-emerald-500">
                        {history.predicted_yield.toFixed(2)} <span className="text-xs text-muted-foreground font-normal">hg/ha</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Droplets className="h-3 w-3 text-sky-400" /> {history.rainfall}mm
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Thermometer className="h-3 w-3 text-orange-400" /> {history.temperature}°C
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
