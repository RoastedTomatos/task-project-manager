import { defineStore } from 'pinia'
import api from '@/api/axios'
import type { Project } from '@/types/project'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as Project[],
    loading: false,
  }),

  actions: {
    async fetchProjects() {
      this.loading = true
      const { data } = await api.get<Project[]>('/projects')
      this.projects = data
      this.loading = false
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
