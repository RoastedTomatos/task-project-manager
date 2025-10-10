<template>
  <section class="projects-page">
    <h1>Projects</h1>

    <div class="actions">
      <button @click="fetchProjects">Reload</button>
      <input v-model="filter" placeholder="Search by name..." />
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

      <draggable
        v-model="draggableProjects"
        tag="tbody"
        item-key="id"
        @start="dragging = true"
        @end="dragging = false"
      >
        <template #item="{ element: p }">
          <tr
            v-show="(p.title || '').toLowerCase().includes(filter.toLowerCase())"
            @click="goToProject(p.id)"
          >
            <td>{{ p.id }}</td>
            <td>{{ p.title }}</td>
            <td>{{ p.taskCount }}</td>
            <td>{{ p.status }}</td>
            <td>{{ new Date(p.createdAt).toLocaleDateString() }}</td>
          </tr>
        </template>
      </draggable>
    </table>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import type { Project } from '@/types/Project'

const store = useProjectsStore()
const router = useRouter()

const filter = ref('')
const draggableProjects = ref<Project[]>([])
const dragging = ref(false)

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

onMounted(fetchProjects)

const loading = computed(() => store.loading)
</script>

<style scoped lang="scss">
.projects-page {
  padding: 1rem;

  h1 {
    margin-bottom: 1rem;
  }

  .actions {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    align-items: center;
    padding: 10px 0;
    gap: 1rem;
  }

  input {
    width: fit-content;
    max-width: 300px;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition:
      border-color 0.3s,
      box-shadow 0.3s;

    &:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
      outline: none;
    }
  }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition:
      background-color 0.3s,
      transform 0.1s,
      box-shadow 0.3s;
    white-space: nowrap;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    &:active {
      transform: translateY(0);
      box-shadow: none;
    }

    &:nth-last-child(1) {
      background-color: #007bff;
      color: white;

      &:hover {
        background-color: #0056b3;
      }
    }

    &:nth-child(1) {
      background-color: #e9ecef;
      color: #343a40;
      border: 1px solid #dee2e6;

      &:hover {
        background-color: #d8dade;
      }
    }
  }

  .projects-table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      text-align: center;
      padding: 0.75rem 0.5rem;
      border-bottom: 1px solid #eee;
      vertical-align: middle;
    }

    thead th:hover {
      background: #f7f7f7;
      cursor: pointer;
    }

    tbody tr {
      transition: background 0.2s;
      cursor: pointer;

      &.dragging {
        opacity: 0.5;
      }

      &:hover {
        background: #f4f6fc;
      }
    }
  }
}
</style>
