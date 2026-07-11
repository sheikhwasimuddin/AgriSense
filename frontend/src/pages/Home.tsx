import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Wifi, BarChart3, Tractor, Bell, Sprout, ArrowRight, Zap, Activity, Shield } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-emerald-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 dot-pattern pointer-events-none opacity-50 z-0" />
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none z-0 mix-blend-screen" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none z-0 mix-blend-screen" />

      {/* Navbar (Minimal for Landing Page) */}
      <nav className="fixed top-0 left-0 right-0 h-20 glass border-b border-black/[0.1] dark:border-white/[0.06] z-50 flex items-center px-6 md:px-12">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sprout className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            AgriSense
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            AI
          </span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link to="/register" className="h-10 px-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 flex flex-col items-center text-center z-10 min-h-[90vh] justify-center spotlight">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-0 shimmer opacity-50" />
            <Zap className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">🚀 Powered by Machine Learning</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
            The Future of <br className="hidden md:block" />
            <span className="gradient-text">Smart Farming</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            AI-powered crop yield prediction, real-time IoT monitoring, and intelligent farm analytics — all in one unified platform designed for the modern farmer.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link to="/register" className="w-full sm:w-auto h-14 px-8 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-base font-bold text-white shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-300 group">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto h-14 px-8 inline-flex items-center justify-center rounded-2xl glass border-black/[0.1] dark:border-white/[0.08] text-base font-semibold text-foreground hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
              View Dashboard
            </Link>
          </motion.div>

          {/* Floating Stats */}
          <motion.div variants={itemVariants} className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6 opacity-80">
            <div className="flex items-center gap-3 animate-float">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Brain className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">98.89%</p>
                <p className="text-xs text-muted-foreground">ML Accuracy</p>
              </div>
            </div>
            <div className="flex items-center gap-3 animate-float-delayed">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">&lt; 100ms</p>
                <p className="text-xs text-muted-foreground">Real-time Updates</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 animate-float">
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">24/7</p>
                <p className="text-xs text-muted-foreground">IoT Monitoring</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 px-6 md:px-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need to farm smarter</h2>
            <p className="text-muted-foreground text-lg">Powerful tools packed into a beautiful, intuitive interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ML Prediction - Large */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 glass rounded-3xl p-8 border border-black/[0.1] dark:border-white/[0.06] hover:border-emerald-500/30 transition-colors relative overflow-hidden group"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-500" />
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                <Brain className="h-7 w-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">ML Yield Prediction</h3>
              <p className="text-muted-foreground max-w-md">
                Leverage state-of-the-art Extra Trees Regressor models to predict crop yields with unprecedented accuracy based on environmental factors.
              </p>
            </motion.div>

            {/* IoT Dashboard */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass rounded-3xl p-8 border border-black/[0.1] dark:border-white/[0.06] hover:border-blue-500/30 transition-colors relative overflow-hidden group"
            >
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-500" />
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <Wifi className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">IoT Dashboard</h3>
              <p className="text-muted-foreground text-sm">
                Connect and monitor sensors in real-time. Track moisture, temperature, and soil pH instantly.
              </p>
            </motion.div>

            {/* Smart Analytics */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass rounded-3xl p-8 border border-black/[0.1] dark:border-white/[0.06] hover:border-purple-500/30 transition-colors relative overflow-hidden group"
            >
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors duration-500" />
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Smart Analytics</h3>
              <p className="text-muted-foreground text-sm">
                Visualize historical data and identify trends to optimize your farming strategies.
              </p>
            </motion.div>

            {/* Farm Management */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass rounded-3xl p-8 border border-black/[0.1] dark:border-white/[0.06] hover:border-amber-500/30 transition-colors relative overflow-hidden group"
            >
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors duration-500" />
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20">
                <Tractor className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Farm Management</h3>
              <p className="text-muted-foreground text-sm">
                Organize multiple plots, track crops, and manage your agricultural portfolio centrally.
              </p>
            </motion.div>

            {/* Real-time Alerts - Large */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="md:col-span-2 glass rounded-3xl p-8 border border-black/[0.1] dark:border-white/[0.06] hover:border-rose-500/30 transition-colors relative overflow-hidden group"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl group-hover:bg-rose-500/20 transition-colors duration-500" />
              <div className="h-14 w-14 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6 border border-rose-500/20">
                <Bell className="h-7 w-7 text-rose-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Intelligent Alerts</h3>
              <p className="text-muted-foreground max-w-md">
                Get notified instantly when conditions fall out of optimal ranges. Prevent crop damage before it happens with AI-driven anomaly detection.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative z-10 bg-black/40 border-y border-black/[0.1] dark:border-white/[0.06] grid-pattern">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">50k+</div>
              <div className="text-sm text-muted-foreground font-medium tracking-wide uppercase">Predictions Made</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">1.2k+</div>
              <div className="text-sm text-muted-foreground font-medium tracking-wide uppercase">Farms Monitored</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">98.9%</div>
              <div className="text-sm text-muted-foreground font-medium tracking-wide uppercase">ML Accuracy</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-rose-400 mb-2">&lt;100ms</div>
              <div className="text-sm text-muted-foreground font-medium tracking-wide uppercase">API Response</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-[2.5rem] p-1 glass border-white/[0.1] animated-border overflow-hidden"
        >
          <div className="bg-background/80 backdrop-blur-3xl rounded-[2.35rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-emerald-500/20 blur-[100px] pointer-events-none" />
            
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Start predicting crop yields today</h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Join thousands of forward-thinking farmers maximizing their harvest with AgriSense AI.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full h-14 px-6 rounded-2xl bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.1] dark:border-white/[0.08] focus:border-emerald-500/50 outline-none transition-colors placeholder:text-muted-foreground/50"
              />
              <Link to="/register" className="w-full sm:w-auto flex-shrink-0 h-14 px-8 inline-flex items-center justify-center rounded-2xl bg-foreground text-background font-bold hover:bg-emerald-400 transition-colors">
                Get Started
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              No credit card required. Free forever for individual farmers.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/[0.1] dark:border-white/[0.06] py-12 text-center relative z-10 bg-background">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sprout className="h-5 w-5 text-emerald-500" />
          <span className="font-bold text-foreground tracking-tight">AgriSense AI</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} AgriSense AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
