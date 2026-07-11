import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { farmsService } from "@/services/farms";
import { predictionService } from "@/services/prediction";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Bug, Sprout, Image as ImageIcon, MapPin, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { DiseasePredictionResponse } from "@/types";

export default function Disease() {
  const queryClient = useQueryClient();
  const [selectedFarmId, setSelectedFarmId] = useState<string>("none");
  const [imageUrl, setImageUrl] = useState("");
  const [result, setResult] = useState<DiseasePredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: farms, isLoading: farmsLoading } = useQuery({
    queryKey: ["farms"],
    queryFn: farmsService.getFarms,
  });

  const { data: diseaseHistory } = useQuery({
    queryKey: ["diseaseHistory", selectedFarmId],
    queryFn: () => predictionService.getDiseaseHistory(parseInt(selectedFarmId)),
    enabled: !!selectedFarmId && selectedFarmId !== "none" && selectedFarmId !== "",
  });

  const predictMutation = useMutation({
    mutationFn: predictionService.predictDisease,
    onSuccess: (data) => {
      setResult(data);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["diseaseHistory"] });
    },
    onError: (err: any) => {
      setError(err?.response?.data?.detail || "Prediction failed. Please try again.");
      setResult(null);
    },
  });

  function handlePredict() {
    if (!imageUrl) {
      setError("Please provide an image URL");
      return;
    }
    
    const payload: any = { image_url: imageUrl };
    if (selectedFarmId && selectedFarmId !== "none") {
      payload.farm_id = parseInt(selectedFarmId);
    }
    
    predictMutation.mutate(payload);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
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
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
          <Bug className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-rose-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
            Disease Detection
          </h1>
          <p className="text-muted-foreground mt-0.5">
            AI-powered image analysis to detect crop diseases instantly.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form Panel - 3 columns */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card className="glass shadow-lg border-black/10 dark:border-white/10 overflow-hidden relative h-full">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-red-400 to-orange-500" />
            
            <CardHeader className="pb-4 pt-6">
              <CardTitle className="text-xl">Image Analysis</CardTitle>
              <CardDescription>Upload an image URL of your crop leaf for classification.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-3.5 w-3.5 text-rose-400" />
                  Target Farm <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                </label>
                <Select onValueChange={setSelectedFarmId} value={selectedFarmId}>
                  <SelectTrigger className="bg-background/50 border-black/10 dark:border-white/10 h-11 rounded-xl hover:border-rose-500/30 transition-colors">
                    <SelectValue placeholder={farmsLoading ? "Loading..." : "No farm (quick test)"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No farm (quick test)</SelectItem>
                    {farms?.map((farm) => (
                      <SelectItem key={farm.id} value={farm.id.toString()}>
                        {farm.farm_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <ImageIcon className="h-3.5 w-3.5 text-blue-400" />
                  Image URL
                </label>
                <Input 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/leaf-image.jpg" 
                  className="bg-background/50 border-black/10 dark:border-white/10 h-11 rounded-xl hover:border-blue-500/30 transition-colors" 
                />
              </div>

              {imageUrl && (
                <div className="mt-4 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 max-h-64 flex justify-center bg-black/5 dark:bg-white/5">
                  <img src={imageUrl} alt="Crop Preview" className="object-contain h-full" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}

              <Button 
                onClick={handlePredict}
                className="w-full h-12 mt-4 text-base font-semibold rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 transition-all duration-300 border-0" 
                disabled={predictMutation.isPending}
              >
                {predictMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Image...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Detect Disease
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Panel - 2 columns */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="glass h-full border-black/10 dark:border-white/10 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />
            
            <CardHeader className="text-center pb-2 pt-6">
              <CardTitle className="text-xl">Analysis Result</CardTitle>
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
                      <div className="h-28 w-28 mx-auto rounded-full bg-gradient-to-br from-rose-500/20 to-red-500/20 flex items-center justify-center">
                        <Loader2 className="h-12 w-12 text-rose-400 animate-spin" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Scanning for pathogens...</p>
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
                      <p className="text-sm font-medium text-red-400">Detection Failed</p>
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
                    <div className="py-8 px-6 bg-gradient-to-br from-rose-500/10 via-background/50 to-red-500/10 rounded-2xl border border-rose-500/20 shadow-inner">
                      <span className="block text-sm text-muted-foreground mb-3 uppercase tracking-wider">Detected Condition</span>
                      <span className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${result.disease === "Healthy" ? "from-emerald-400 to-teal-400" : "from-rose-400 to-orange-400"}`}>
                        {result.disease}
                      </span>
                      <span className="block text-md font-medium mt-2 text-muted-foreground">
                        {(result.confidence * 100).toFixed(1)}% Confidence
                      </span>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-background/50 border border-black/5 dark:border-white/5 text-left">
                      <span className="text-xs text-muted-foreground block mb-1">Recommendation</span>
                      <span className="text-sm font-medium text-foreground">{result.recommendation}</span>
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
                        <Bug className="h-12 w-12 text-slate-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground/60">Ready to analyze</p>
                      <p className="text-xs text-muted-foreground mt-1">Upload an image URL to detect diseases</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* History Panel */}
        {selectedFarmId && selectedFarmId !== "none" && diseaseHistory && diseaseHistory.length > 0 && (
          <motion.div variants={itemVariants} className="lg:col-span-5 mt-4">
            <Card className="glass border-black/10 dark:border-white/10 overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-rose-500" />
                  Detection History
                </CardTitle>
                <CardDescription>Past health scans for the selected farm</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {diseaseHistory.map((history) => (
                    <div key={history.id} className="p-4 rounded-xl bg-background/50 border border-black/5 dark:border-white/5 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className={`text-sm font-bold ${history.disease === "Healthy" ? "text-emerald-500" : "text-rose-500"}`}>
                          {history.disease}
                        </span>
                        <span className="text-xs text-muted-foreground">{new Date(history.created_at || "").toLocaleDateString()}</span>
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {history.recommendation}
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className="font-medium text-foreground">{(history.confidence * 100).toFixed(1)}%</span>
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
