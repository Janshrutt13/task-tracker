import api from './axios';
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types';

export const fetchTasks = async (): Promise<Task[]> => {
    const res = await api.get<Task[]>('/tasks');
    return res.data;
};

export const createTask = async (data: CreateTaskInput): Promise<Task> => {
    const res = await api.post<Task>('/tasks', data);
    return res.data;
};

export const updateTask = async (id: number, data: UpdateTaskInput): Promise<Task> => {
    const res = await api.patch<Task>(`/tasks/${id}`, data);
    return res.data;
};

export const deleteTask = async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
};
