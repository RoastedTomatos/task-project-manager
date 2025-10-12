import { defineStore } from 'pinia'
import api from '@/api/axios'
import type { Task } from '@/types/Task'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    loading: false,
  }),
  actions: {
    async fetchTasks(projectId?: number) {
      this.loading = true
      try {
        const url = projectId ? `/tasks?projectId=${projectId}` : '/tasks'
        const res = await api.get<Task[]>(url)
        this.tasks = res.data
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
      } finally {
        this.loading = false
      }
    },

    async addTask(task: Omit<Task, 'id'>) {
      const res = await api.post<Task>('/tasks', task)
      this.tasks.push(res.data)
    },

    async updateTask(id: number, payload: Partial<Task>) {
      const res = await api.patch<Task>(`/tasks/${id}`, payload)
      const updatedTask = res.data
      this.tasks = this.tasks.map((task) => (task.id === id ? updatedTask : task))
    },
  },
})
