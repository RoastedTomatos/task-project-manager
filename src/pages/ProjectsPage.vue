<template>
  <section class="projects-page">
    <h1>Projects Table</h1>

    <div class="actions">
      <button @click="fetchProjects">
        <img src="@/assets/refresh-icon.svg" alt="refresh" />
      </button>
      <input v-model="filter" placeholder="Search by name..." @input="onFilterTextBoxChanged" />
      <button @click="openAddModal">Add Project</button>
    </div>

    <div v-if="loading">Loading...</div>

    <div v-else class="ag-grid-container">
      <ag-grid-vue
        class="ag-theme-quartz"
        :rowData="store.projects"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :animateRows="true"
        @grid-ready="onGridReady"
        @row-clicked="onRowClicked"
      />
    </div>
  </section>

  <AddProjectModal
    :is-open="isModalOpen"
    @close="isModalOpen = false"
    @project-created="handleProjectCreated"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { useRouter } from 'vue-router'
import AddProjectModal from '@/components/ProjectsModal.vue'
import { AgGridVue } from 'ag-grid-vue3'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { toast, type ToastOptions } from 'vue3-toastify'

interface CustomGridApi {
  setGridOption: (option: 'quickFilterText', value: string | number | null) => void
}

interface GridReadyEvent {
  api: CustomGridApi
}

interface RowClickedEvent {
  data: {
    id: number
  }
}

interface ValueFormatterParams {
  value: string | number | Date | undefined
}

const store = useProjectsStore()
const router = useRouter()

const filter = ref('')
const isModalOpen = ref(false)
const gridApi = ref<CustomGridApi | null>(null)

const columnDefs = ref([
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'title', headerName: 'Title', flex: 2, minWidth: 200 },
  { field: 'taskCount', headerName: 'Tasks', width: 100 },
  { field: 'status', headerName: 'Status', width: 120 },
  {
    field: 'createdAt',
    headerName: 'Created',
    width: 120,
    valueFormatter: (p: ValueFormatterParams) => {
      if (p.value) {
        return new Date(p.value).toLocaleDateString()
      }
      return ''
    },
  },
])

const defaultColDef = {
  resizable: true,
  sortable: true,
  filter: true,
  minWidth: 100,
}

function onGridReady(params: GridReadyEvent) {
  gridApi.value = params.api
}

function onRowClicked(event: RowClickedEvent) {
  goToProject(event.data.id)
}

function onFilterTextBoxChanged() {
  if (gridApi.value) {
    gridApi.value.setGridOption('quickFilterText', filter.value)
  }
}

async function fetchProjects() {
  await store.fetchProjects()
}

function handleProjectCreated() {
  fetchProjects()
  toast('Project created successfully!', {
    autoClose: 1000,
    position: toast.POSITION.BOTTOM_RIGHT,
  } as ToastOptions)
}

function goToProject(id: number) {
  router.push(`/project/${id}`)
}

function openAddModal() {
  isModalOpen.value = true
}

onMounted(fetchProjects)

const loading = computed(() => store.loading)
</script>

<style scoped lang="scss">
.projects-page {
  padding: 1rem;

  h1 {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
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
    height: 42px;
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
      padding: 10px;
      width: 42px;
      height: 42px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #e9ecef;
      color: #343a40;
      border: 1px solid #dee2e6;

      &:hover {
        background-color: #d8dade;
      }

      img {
        width: 20px;
        height: 20px;
      }
    }
  }

  .ag-grid-container {
    height: 500px;
    width: 100%;
  }

  .ag-theme-quartz {
    height: 100%;
  }
}
</style>
