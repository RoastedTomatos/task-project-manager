<template>
  <section class="projects-page">
    <h1>Projects</h1>

    <div class="actions">
      <input v-model="filter" placeholder="Search by name..." />
      <button @click="fetchProjects">Reload</button>
      <button @click="openAddModal">Add Project</button>
    </div>

    <div v-if="loading">Loading...</div>

    <table v-else class="projects-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Tasks</th>
          <th>Status</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody ref="tableBody">
        <tr
          v-for="p in draggableProjects"
          :key="p.id"
          v-show="(p.title || '').toLowerCase().includes(filter.toLowerCase())"
          @click="goToProject(p.id)"
        >
          <td>{{ p.id }}</td>
          <td>{{ p.title }}</td>
          <td>{{ p.taskCount }}</td>
          <td>{{ p.status }}</td>
          <td>{{ new Date(p.createdAt).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { useRouter } from 'vue-router'
import { useDraggable } from 'vue-draggable-plus'
import type { Project } from '@/types/Project'

const store = useProjectsStore()
const router = useRouter()

const filter = ref('')
const draggableProjects = ref<Project[]>([])
const tableBody = ref<HTMLElement | null>(null)

const loading = computed(() => store.loading)

watch(
  () => store.projects,
  (newProjects) => {
    draggableProjects.value = [...newProjects]
  },
  { immediate: true },
)

async function fetchProjects() {
  await store.fetchProjects()
  draggableProjects.value = [...store.projects]
}

function goToProject(id: number) {
  router.push(`/project/${id}`)
}

function openAddModal() {
  alert('TODO: Add modal')
}

onMounted(() => {
  fetchProjects()
  if (tableBody.value) {
    useDraggable(tableBody, draggableProjects, {
      animation: 150,
      onUpdate() {
        console.log(
          'New order:',
          draggableProjects.value.map((p) => p.title),
        )
      },
    })
  }
})
</script>

<style scoped lang="scss">
.projects-page {
  padding: 1rem;
  h1 {
    margin-bottom: 1rem;
  }
  .projects-table {
    width: 100%;
    border-collapse: collapse;
    th,
    td {
      text-align: center;
      padding: 0.5rem;
      border-bottom: 1px solid #ccc;
    }
    thead th:hover {
      background: #f7f7f7;
      cursor: pointer;
    }
    tbody tr:hover {
      background: #f7f7f7;
      cursor: pointer;
    }
  }
  .actions {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
}
</style>
