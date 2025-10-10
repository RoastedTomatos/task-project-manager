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
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        this.loading = false
      }
    },

    async addProject(project: Omit<Project, 'id' | 'createdAt' | 'taskCount'>) {
      const newProject = {
        ...project,
        taskCount: 0,
      }
      try {
        const res = await api.post<Project>('/projects', newProject)
        this.projects.push(res.data)
      } catch (error) {
        console.error('Failed to add project:', error)
      }
    },
  },
})
