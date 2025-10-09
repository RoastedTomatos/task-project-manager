import { createRouter, createWebHistory } from 'vue-router'
import ProjectsPage from '@/pages/ProjectsPage.vue'
import ProjectDetailsPage from '@/pages/ProjectDetailsPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'projects', component: ProjectsPage },
    { path: '/project/:id', name: 'project-details', component: ProjectDetailsPage },
  ],
})

export default router
