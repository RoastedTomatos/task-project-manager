export type Project = {
  id: number
  title: string
  taskCount: number
  status: 'active' | 'archived' | 'paused' | 'completed'
  description?: string
  createdAt: string
}
