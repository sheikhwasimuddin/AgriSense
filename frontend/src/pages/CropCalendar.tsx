import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksService, CropTaskCreate } from "@/services/tasks";
import { farmsService } from "@/services/farms";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { CalendarDays, Plus, Trash2, Check, Sprout, Droplets, Sun, FlaskConical, ClipboardList, Loader2 } from "lucide-react";

const TASK_TYPES = [
  { value: "planting", label: "Planting", icon: Sprout, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { value: "watering", label: "Watering", icon: Droplets, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { value: "harvesting", label: "Harvesting", icon: Sun, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { value: "fertilizing", label: "Fertilizing", icon: FlaskConical, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { value: "general", label: "General", icon: ClipboardList, color: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
];

export default function CropCalendar() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<CropTaskCreate>({ title: "", description: "", task_type: "general", due_date: "", farm_id: undefined });

  const { data: tasks, isLoading } = useQuery({ queryKey: ["tasks"], queryFn: tasksService.getTasks });
  const { data: farms } = useQuery({ queryKey: ["farms"], queryFn: farmsService.getFarms });

  const createMutation = useMutation({
    mutationFn: tasksService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsOpen(false);
      setForm({ title: "", description: "", task_type: "general", due_date: "", farm_id: undefined });
      toast({ title: "Task Created", description: "Your crop task has been added." });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: tasksService.toggleTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: tasksService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: "Task Deleted" });
    },
  });

  const getTypeInfo = (type: string) => TASK_TYPES.find(t => t.value === type) || TASK_TYPES[4];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    createMutation.mutate({
      ...form,
      due_date: form.due_date || undefined,
      farm_id: form.farm_id || undefined,
    });
  };

  const pending = tasks?.filter(t => !t.completed) || [];
  const completed = tasks?.filter(t => t.completed) || [];

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <CalendarDays className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">Crop Calendar</h1>
            <p className="text-muted-foreground mt-0.5">
              {tasks ? `${pending.length} pending · ${completed.length} completed` : "Schedule and track your farming tasks"}
            </p>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300">
              <Plus className="h-4 w-4" /> Add Task
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[460px] glass border-black/[0.1] dark:border-white/[0.08]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-lg">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <CalendarDays className="h-4.5 w-4.5 text-white" />
                </div>
                New Task
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</Label>
                <Input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Plant wheat seeds" className="bg-background/50 border-black/10 dark:border-white/10 h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</Label>
                <Input value={form.description || ""} onChange={e => setForm({...form, description: e.target.value})} placeholder="Optional details" className="bg-background/50 border-black/10 dark:border-white/10 h-11 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</Label>
                  <Select value={form.task_type} onValueChange={v => setForm({...form, task_type: v})}>
                    <SelectTrigger className="bg-background/50 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TASK_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Due Date</Label>
                  <Input type="date" value={form.due_date || ""} onChange={e => setForm({...form, due_date: e.target.value})} className="bg-background/50 h-11 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Farm (Optional)</Label>
                <Select value={form.farm_id?.toString() || "none"} onValueChange={v => setForm({...form, farm_id: v === "none" ? undefined : parseInt(v)})}>
                  <SelectTrigger className="bg-background/50 h-11 rounded-xl"><SelectValue placeholder="No specific farm" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific farm</SelectItem>
                    {farms?.map(f => <SelectItem key={f.id} value={f.id.toString()}>{f.farm_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <button type="submit" disabled={createMutation.isPending} className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2">
                {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Task
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task List */}
      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-black/5 dark:bg-white/5 animate-pulse" />)}</div>
      ) : tasks && tasks.length === 0 ? (
        <div className="text-center py-20 glass rounded-xl">
          <CalendarDays className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium">No tasks yet</h3>
          <p className="text-muted-foreground">Click "Add Task" to schedule your first farming activity.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending */}
          {pending.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3">📋 Pending ({pending.length})</h2>
              <div className="space-y-3">
                {pending.map((task, i) => {
                  const typeInfo = getTypeInfo(task.task_type);
                  return (
                    <motion.div key={task.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="glass border-black/10 dark:border-white/10 hover:border-amber-500/20 transition-colors">
                        <CardContent className="p-4 flex items-center gap-4">
                          <button onClick={() => toggleMutation.mutate(task.id)} className="h-6 w-6 rounded-md border-2 border-black/20 dark:border-white/20 hover:border-emerald-500 transition-colors flex items-center justify-center flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{task.title}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${typeInfo.color}`}>
                                {typeInfo.label}
                              </span>
                            </div>
                            {task.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.description}</p>}
                            {task.due_date && (
                              <p className="text-xs text-muted-foreground mt-1">
                                📅 {new Date(task.due_date).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })}
                              </p>
                            )}
                          </div>
                          <button onClick={() => deleteMutation.mutate(task.id)} className="h-8 w-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3 text-muted-foreground">✅ Completed ({completed.length})</h2>
              <div className="space-y-2">
                {completed.map((task) => {
                  const typeInfo = getTypeInfo(task.task_type);
                  return (
                    <Card key={task.id} className="glass border-black/10 dark:border-white/10 opacity-60">
                      <CardContent className="p-4 flex items-center gap-4">
                        <button onClick={() => toggleMutation.mutate(task.id)} className="h-6 w-6 rounded-md bg-emerald-500 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3.5 w-3.5 text-white" />
                        </button>
                        <span className="text-sm line-through flex-1">{task.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${typeInfo.color}`}>{typeInfo.label}</span>
                        <button onClick={() => deleteMutation.mutate(task.id)} className="h-8 w-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
