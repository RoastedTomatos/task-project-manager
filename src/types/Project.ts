export interface Project {
  id: number
  title: string
  taskCount: number
  status: 'active' | 'archived'
  createdAt: string
}
