<template>
  <section class="projects-page">
    <h1>Projects</h1>

    <div class="actions">
      <input v-model="filter" placeholder="Search by name..." />
      <button @click="fetchProjects">Reload</button>
      <button @click="openAddModal">Add Project</button>
    </div>

    <table v-if="!loading">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Tasks</th>
          <th>Status</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in filteredProjects" :key="p.id" @click="goToProject(p.id)">
          <td>{{ p.id }}</td>
          <td>{{ p.title }}</td>
          <td>{{ p.taskCount }}</td>
          <td>{{ p.status }}</td>
          <td>{{ new Date(p.createdAt).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>Loading...</p>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { useRouter } from 'vue-router'

const store = useProjectsStore()
const router = useRouter()

const filter = ref('')
const loading = computed(() => store.loading)
const projects = computed(() => store.projects)

const filteredProjects = computed(() =>
  projects.value.filter((p) => p.title.toLowerCase().includes(filter.value.toLowerCase())),
)

function goToProject(id: number) {
  router.push(`/project/${id}`)
}

function fetchProjects() {
  store.fetchProjects()
}

function openAddModal() {
  alert('TODO: Add modal')
}

onMounted(fetchProjects)
</script>

<style scoped lang="scss">
.projects-page {
  padding: 1rem;
  h1 {
    margin-bottom: 1rem;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    th,
    td {
      padding: 0.5rem;
      border-bottom: 1px solid #ccc;
    }
    tr:hover {
      background: #f7f7f7;
      cursor: pointer;
    }
  }
}
</style>
