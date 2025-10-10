// src/api/axios.ts
type Project = {
  id: number
  title: string
  taskCount: number
  status: 'active' | 'archived' | 'paused' | 'completed'
  createdAt: string
}

const fakeDB: Project[] = [
  {
    id: 1,
    title: 'Landing Page',
    taskCount: 12,
    status: 'active',
    createdAt: '2025-10-01',
  },
  {
    id: 2,
    title: 'Mobile App',
    taskCount: 8,
    status: 'paused',
    createdAt: '2025-09-20',
  },
  {
    id: 3,
    title: 'CRM System',
    taskCount: 20,
    status: 'completed',
    createdAt: '2025-08-10',
  },
]

const axios = {
  async get<T = any>(url: string): Promise<{ data: T }> {
    await new Promise((r) => setTimeout(r, 500))

    if (url === '/projects') {
      return { data: fakeDB as unknown as T }
    }

    throw new Error(`Unknown GET ${url}`)
  },

  async post<T = any>(url: string, payload: any): Promise<{ data: T }> {
    await new Promise((r) => setTimeout(r, 300))

    if (url === '/projects') {
      const newProject: Project = {
        ...payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      }
      fakeDB.push(newProject)
      return { data: newProject as unknown as T }
    }

    throw new Error(`Unknown POST ${url}`)
  },
}

export default axios
