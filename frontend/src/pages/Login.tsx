import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm as useRHForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Sprout, Loader2, Mail, Lock, Brain, Wifi, BarChart3 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useRHForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await login(values);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.response?.data?.detail || "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden relative selection:bg-emerald-500/30">
      {/* Decorative Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none mix-blend-screen" />

      {/* Left side: Brand / Hero */}
      <div className="hidden md:flex flex-1 flex-col justify-center items-start p-12 lg:p-24 relative z-10">
        <Link to="/home" className="absolute top-12 left-12 flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Sprout className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">AgriSense</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-md">
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight mb-6 gradient-text">
            Welcome Back
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Sign in to access your AI-powered farming dashboard and monitor your yields.
          </p>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-4 glass rounded-2xl p-4 border border-black/[0.1] dark:border-white/[0.06]">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Brain className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Yield Prediction</h3>
                <p className="text-sm text-muted-foreground">Extra Trees Regressor ML Models</p>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-4 glass rounded-2xl p-4 border border-black/[0.1] dark:border-white/[0.06]">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <Wifi className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">IoT Sensors</h3>
                <p className="text-sm text-muted-foreground">Real-time soil & weather sync</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-4 glass rounded-2xl p-4 border border-black/[0.1] dark:border-white/[0.06]">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Smart Analytics</h3>
                <p className="text-sm text-muted-foreground">Historical data insights</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 z-10">
        <Link to="/home" className="md:hidden flex items-center gap-2 mb-12">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
            <Sprout className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">AgriSense</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[440px] glass rounded-[2rem] p-8 sm:p-12 border border-black/[0.1] dark:border-white/[0.08] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Sign in to AgriSense</h2>
            <p className="text-muted-foreground mt-2">Enter your details to continue</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="h-4 w-4 text-emerald-400" /> Email
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="farmer@example.com" {...field} className="h-12 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border-black/[0.1] dark:border-white/[0.08] focus:border-emerald-500/50 transition-colors" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <Lock className="h-4 w-4 text-cyan-400" /> Password
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="h-12 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border-black/[0.1] dark:border-white/[0.08] focus:border-emerald-500/50 transition-colors" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button 
                type="submit" 
                className="w-full h-12 mt-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In"}
              </button>
            </form>
          </Form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/register" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
              Sign up
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
