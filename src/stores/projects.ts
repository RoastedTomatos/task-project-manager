import { defineStore } from 'pinia'
import api from '@/api/axios'
import type { Project } from '@/types/Project'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as Project[],
    loading: false,
  }),

  actions: {
    async fetchProjects() {
      try {
        this.loading = true
        const { data } = await api.get<Project[]>('/projects')
        console.log('[STORE] Data received from API:', data)
        this.projects = data
        console.log('[STORE] State updated. New projects:', this.projects)
      } catch (error) {
        console.error('[STORE] Failed to fetch projects:', error)
      } finally {
        this.loading = false
      }
    },

    async addProject(project: Omit<Project, 'id' | 'createdAt' | 'taskCount'>) {
      const newProject = {
        ...project,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        taskCount: 0,
      }
      await api.post('/projects', newProject)
      this.projects.push(newProject)
    },
  },
})
