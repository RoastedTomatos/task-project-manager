import { defineStore } from 'pinia'
import api from '@/api/axios'
import type { Project } from '@/types/Project'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as Project[],
    loading: false,
    nextId: 1 as number,
  }),

  actions: {
    async fetchProjects() {
      try {
        this.loading = true
        const { data } = await api.get<Project[]>('/projects')
        this.projects = data
        const maxId = data.reduce((max, project) => Math.max(max, project.id), 0)
        this.nextId = maxId + 1
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchProjectById(id: number): Promise<Project | undefined> {
      const cachedProject = this.projects.find((p) => p.id === id)
      if (cachedProject && cachedProject.description) {
        return cachedProject
      }
      try {
        const { data } = await api.get<Project>(`/projects/${id}`)
        const index = this.projects.findIndex((p) => p.id === id)
        if (index !== -1) {
          this.projects[index] = data
        } else {
          this.projects.push(data)
        }
        return data
      } catch (error) {
        console.error(`Failed to fetch project ${id}:`, error)
        return undefined
      }
    },

    async addProject(project: Omit<Project, 'id' | 'taskCount'>) {
      try {
        const projectWithLocalId = {
          ...project,
          id: this.nextId,
        } as Project

        const res = await api.post<Project>('/projects', projectWithLocalId)

        this.nextId++

        this.projects.push(res.data)
      } catch (error) {
        console.error('Failed to add project:', error)
      }
    },
  },
})
