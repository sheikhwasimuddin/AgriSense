import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { farmsService } from "@/services/farms";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tractor, MapPin, Plus, Trash2, Loader2, Wheat, Ruler, Sprout } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

export default function Farms() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    farm_name: "",
    location: "",
    latitude: "",
    longitude: "",
    area: "",
    crop: "",
  });

  const { data: farms, isLoading } = useQuery({
    queryKey: ["farms"],
    queryFn: farmsService.getFarms,
  });

  const createMutation = useMutation({
    mutationFn: farmsService.createFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms"] });
      setIsOpen(false);
      setFormData({ farm_name: "", location: "", latitude: "", longitude: "", area: "", crop: "" });
      toast({ title: "Success", description: "Farm added successfully." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to add farm." });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: farmsService.deleteFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms"] });
      toast({ title: "Success", description: "Farm deleted successfully." });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      farm_name: formData.farm_name,
      location: formData.location,
      latitude: parseFloat(formData.latitude) || 0,
      longitude: parseFloat(formData.longitude) || 0,
      area: parseFloat(formData.area),
      crop: formData.crop,
    });
  };

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
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Tractor className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight gradient-text">My Farms</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your agricultural locations and fields.</p>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:from-emerald-500 hover:to-teal-500 transition-all duration-300">
              <Plus className="h-4 w-4" /> Add Farm
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[460px] glass border-black/[0.1] dark:border-white/[0.08]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Sprout className="h-4.5 w-4.5 text-white" />
                </div>
                Add New Farm
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Tractor className="h-3 w-3 text-amber-400" /> Farm Name
                </Label>
                <Input
                  required
                  value={formData.farm_name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, farm_name: e.target.value })}
                  placeholder="Green Valley Farm"
                  className="h-11 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border-black/[0.1] dark:border-white/[0.08] focus:border-emerald-500/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-blue-400" /> Location
                </Label>
                <Input
                  required
                  value={formData.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Punjab, India"
                  className="h-11 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border-black/[0.1] dark:border-white/[0.08] focus:border-emerald-500/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-rose-400" /> Latitude
                  </Label>
                  <Input
                    required
                    type="number"
                    step="0.000001"
                    value={formData.latitude}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="28.6139"
                    className="h-11 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border-black/[0.1] dark:border-white/[0.08] focus:border-emerald-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-cyan-400" /> Longitude
                  </Label>
                  <Input
                    required
                    type="number"
                    step="0.000001"
                    value={formData.longitude}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="77.2090"
                    className="h-11 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border-black/[0.1] dark:border-white/[0.08] focus:border-emerald-500/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Ruler className="h-3 w-3 text-purple-400" /> Total Area (Hectares)
                </Label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  value={formData.area}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="150.5"
                  className="h-11 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border-black/[0.1] dark:border-white/[0.08] focus:border-emerald-500/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Wheat className="h-3 w-3 text-emerald-400" /> Primary Crop
                </Label>
                <Input
                  required
                  value={formData.crop}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, crop: e.target.value })}
                  placeholder="Wheat"
                  className="h-11 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border-black/[0.1] dark:border-white/[0.08] focus:border-emerald-500/50"
                />
              </div>
              <button 
                type="submit" 
                className="w-full mt-6 h-11 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Farm
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.1] dark:border-white/[0.06] animate-pulse" />
          ))}
        </div>
      ) : farms?.length === 0 ? (
        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-20 glass rounded-2xl border-dashed border-black/[0.1] dark:border-white/[0.08]">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-6 animate-float">
            <Tractor className="h-10 w-10 text-amber-400" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">No farms added yet</h3>
          <p className="text-muted-foreground mt-2 text-sm max-w-sm text-center">
            Click the "Add Farm" button above to create your first farm and start monitoring crops.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms?.map((farm, index) => (
            <motion.div
              key={farm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              <Card className="glass border-black/[0.1] dark:border-white/[0.06] overflow-hidden group hover:border-emerald-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
                {/* Gradient accent */}
                <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-80" />
                
                {/* Subtle glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.03] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-8 translate-x-8" />
                
                <CardHeader className="pb-3">
                  <CardTitle className="flex justify-between items-start">
                    <span className="truncate text-lg font-bold">{farm.farm_name}</span>
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500/15 to-teal-500/15 flex items-center justify-center flex-shrink-0">
                      <Tractor className="h-4 w-4 text-emerald-400" />
                    </div>
                  </CardTitle>
                  <CardDescription className="flex items-center text-xs">
                    <MapPin className="h-3 w-3 mr-1 text-blue-400" />
                    {farm.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.02]">
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Ruler className="h-3 w-3 text-purple-400" /> Area
                      </span>
                      <span className="text-sm font-semibold">{farm.area} ha</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.02]">
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Wheat className="h-3 w-3 text-amber-400" /> Crop
                      </span>
                      <span className="text-sm font-semibold">{farm.crop}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t border-black/[0.1] dark:border-white/[0.04]">
                  <button
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
                    onClick={() => deleteMutation.mutate(farm.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete Farm
                  </button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
