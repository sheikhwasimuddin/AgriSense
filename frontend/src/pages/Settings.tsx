import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/components/theme-provider";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Moon, 
  Sun,
  Mail,
  Globe
} from "lucide-react";

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'ur', name: 'اردو (Urdu)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' }
];

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    weeklyReports: true,
  });

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
            <SettingsIcon className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              {t('settings.title')}
            </h1>
            <p className="text-muted-foreground mt-0.5">{t('settings.subtitle')}</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-6">
        <Card className="glass border-black/10 dark:border-white/10 overflow-hidden relative max-w-3xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" />
          <CardHeader className="pb-4 pt-6">
            <CardTitle className="text-xl">{t('settings.appearance')}</CardTitle>
            <CardDescription>{t('settings.appearanceDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl border border-black/5 dark:border-white/5 bg-background/50">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center border border-white/10">
                  {theme === 'dark' ? <Moon className="h-5 w-5 text-white" /> : <Sun className="h-5 w-5 text-yellow-400" />}
                </div>
                <div>
                  <h4 className="font-medium">{t('settings.themeMode')}</h4>
                  <p className="text-sm text-muted-foreground">{t('settings.themeDesc')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 p-1 rounded-lg">
                <button
                  onClick={() => setTheme("light")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${theme === 'light' ? 'bg-white dark:bg-black shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {t('settings.light')}
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${theme === 'dark' ? 'bg-white dark:bg-black shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {t('settings.dark')}
                </button>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-black/5 dark:border-white/5 bg-background/50">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">{t('settings.language')}</h4>
                  <p className="text-sm text-muted-foreground">{t('settings.languageDesc')}</p>
                </div>
              </div>
              <div className="w-[180px]">
                <Select value={i18n.language} onValueChange={(val) => i18n.changeLanguage(val)}>
                  <SelectTrigger className="bg-black/5 dark:bg-white/5 border-none shadow-sm focus:ring-2 focus:ring-cyan-500/50">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-black/10 dark:border-white/10 max-w-3xl">
          <CardHeader className="pb-4 pt-6">
            <CardTitle className="text-xl">{t('settings.notifications')}</CardTitle>
            <CardDescription>{t('settings.notificationsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-black/5 dark:border-white/5 bg-background/50">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-medium">{t('settings.pushNotif')}</h4>
                  <p className="text-sm text-muted-foreground">{t('settings.pushNotifDesc')}</p>
                </div>
              </div>
              <button 
                onClick={() => setNotifications({...notifications, emailAlerts: !notifications.emailAlerts})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.emailAlerts ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.emailAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-black/5 dark:border-white/5 bg-background/50">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium">{t('settings.weeklyReports')}</h4>
                  <p className="text-sm text-muted-foreground">{t('settings.weeklyReportsDesc')}</p>
                </div>
              </div>
              <button 
                onClick={() => setNotifications({...notifications, weeklyReports: !notifications.weeklyReports})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.weeklyReports ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.weeklyReports ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
