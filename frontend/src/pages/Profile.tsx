import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Package, 
  Save,
  Check
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: user?.full_name || "John Doe",
    email: user?.email || "john.doe@example.com",
    phone: user?.phone || "+1 (555) 012-3456",
    city: "San Francisco",
    age: "32",
    foodStock: "450", // kg
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile Saved",
        description: "Your personal information has been updated successfully.",
      });
    }, 1000);
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
      className="space-y-8 max-w-5xl mx-auto pb-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <UserIcon className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-muted-foreground mt-0.5">Manage your personal information and contact details.</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Settings */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass border-black/10 dark:border-white/10 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
                <CardHeader className="pb-4 pt-6">
                  <CardTitle className="text-xl">General Information</CardTitle>
                  <CardDescription>Update your contact and demographic details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <UserIcon className="h-3.5 w-3.5 text-indigo-400" /> Full Name
                      </Label>
                      <Input 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-background/50 border-black/10 dark:border-white/10 h-11 rounded-xl focus:border-indigo-500/50" 
                      />
                    </div>
                    {/* Email */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-blue-400" /> Email Address
                      </Label>
                      <Input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-background/50 border-black/10 dark:border-white/10 h-11 rounded-xl focus:border-indigo-500/50" 
                      />
                    </div>
                    {/* Phone */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-emerald-400" /> Phone Number
                      </Label>
                      <Input 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="bg-background/50 border-black/10 dark:border-white/10 h-11 rounded-xl focus:border-indigo-500/50" 
                      />
                    </div>
                    {/* City */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-rose-400" /> City
                      </Label>
                      <Input 
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="bg-background/50 border-black/10 dark:border-white/10 h-11 rounded-xl focus:border-indigo-500/50" 
                      />
                    </div>
                    {/* Age */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-amber-400" /> Age
                      </Label>
                      <Input 
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                        className="bg-background/50 border-black/10 dark:border-white/10 h-11 rounded-xl focus:border-indigo-500/50" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-black/10 dark:border-white/10 overflow-hidden relative">
                <CardHeader className="pb-4 pt-6">
                  <CardTitle className="text-xl">Farm Inventory</CardTitle>
                  <CardDescription>Manage your current storage and food stock.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-w-md space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Package className="h-3.5 w-3.5 text-orange-400" /> Current Stock of Food (kg)
                    </Label>
                    <Input 
                      type="number"
                      value={formData.foodStock}
                      onChange={(e) => setFormData({...formData, foodStock: e.target.value})}
                      className="bg-background/50 border-black/10 dark:border-white/10 h-11 rounded-xl focus:border-indigo-500/50 text-lg font-semibold text-indigo-400" 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Save Panel */}
            <div className="space-y-6">
              <Card className="glass border-black/10 dark:border-white/10 sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Review & Save</CardTitle>
                  <CardDescription>Make sure all your information is correct before saving.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <h4 className="text-sm font-semibold text-indigo-400 flex items-center gap-2 mb-1">
                      <Check className="h-4 w-4" /> Profile Completeness
                    </h4>
                    <p className="text-xs text-muted-foreground">Your profile is 100% complete. This helps the AI generate more accurate yield and disease predictions.</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 transition-all duration-300 border-0"
                  >
                    {isSaving ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Saving Changes...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-5 w-5" />
                        Save Changes
                      </div>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
