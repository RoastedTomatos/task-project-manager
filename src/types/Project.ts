export type Project = {
  id: number
  title: string
  taskCount: number
  status: 'active' | 'archived' | 'paused' | 'completed'
  createdAt: string
}
