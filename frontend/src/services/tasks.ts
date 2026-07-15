import api from "./api";

export interface CropTask {
  id: number;
  user_id: string;
  farm_id?: number;
  title: string;
  description?: string;
  task_type: string;
  due_date?: string;
  completed: boolean;
  created_at: string;
}

export interface CropTaskCreate {
  title: string;
  description?: string;
  task_type: string;
  due_date?: string;
  farm_id?: number;
}

export const tasksService = {
  getTasks: async (): Promise<CropTask[]> => {
    const response = await api.get("/tasks/");
    return response.data;
  },
  createTask: async (task: CropTaskCreate): Promise<CropTask> => {
    const response = await api.post("/tasks/", task);
    return response.data;
  },
  updateTask: async (id: number, data: Partial<CropTask>): Promise<CropTask> => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },
  toggleTask: async (id: number): Promise<CropTask> => {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data;
  },
  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
