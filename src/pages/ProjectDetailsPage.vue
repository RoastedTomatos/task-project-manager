<template>
  <section class="tasks-page">
    <h1>{{ projectData.title || projectTitle }}</h1>

    <div v-if="projectData.description" class="project-description-container">
      <p class="project-description">{{ projectData.description }}</p>
    </div>

    <div class="actions">
      <button @click="fetchTasks">Reload</button>
      <input v-model="filter" placeholder="Search by title or assignee..." />
      <button class="btn-primary" @click="openAddTaskModal">Add Task</button>
    </div>

    <div v-if="tasksStore.loading || projectLoading">Loading tasks...</div>

    <div v-else class="kanban-board-container">
      <div v-for="column in filteredColumns" :key="column.status" class="kanban-column">
        <div class="column-header">
          <h2>{{ column.title }}</h2>
          <span class="task-count">{{ column.tasks.length }}</span>
        </div>

        <draggable
          v-model="column.tasks"
          :animation="200"
          group="kanban-tasks"
          item-key="id"
          class="kanban-tasks-list"
          @start="dragging = true"
          @end="onDragEnd"
          :data-status="column.status"
        >
          <template #item="{ element: task }">
            <TaskCard
              :task="task"
              :class="task.status"
              class="task-item"
              @edit="editTask(task.id)"
            />
          </template>
        </draggable>
      </div>
    </div>
  </section>

  <AddTaskModal
    :is-open="isAddTaskModalOpen"
    :project-id="projectId"
    @close="isAddTaskModalOpen = false"
    @task-created="handleTaskCreated"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'
import { useProjectsStore } from '@/stores/projects'
import draggable from 'vuedraggable'
import type { Task } from '@/types/Task'
import type { Project } from '@/types/Project'
import TaskCard from '@/components/TaskCard.vue'
import AddTaskModal from '@/components/TasksModal.vue'

const tasksStore = useTasksStore()
const projectsStore = useProjectsStore()
const route = useRoute()

const projectId = Number(route.params.id)
const projectTitle = ref(`Project ${projectId}`)
const filter = ref('')
const dragging = ref(false)

const projectData = ref<Partial<Project>>({})
const projectLoading = ref(true)
const isAddTaskModalOpen = ref(false)

interface KanbanColumn {
  status: 'todo' | 'in-progress' | 'done'
  title: string
  tasks: Task[]
}

const statusLabels = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
} as const

const columns = ref<KanbanColumn[]>([
  { status: 'todo', title: statusLabels.todo, tasks: [] },
  { status: 'in-progress', title: statusLabels['in-progress'], tasks: [] },
  { status: 'done', title: statusLabels.done, tasks: [] },
])

const formatTasksToColumns = (tasks: Task[]) => {
  columns.value.forEach((col) => (col.tasks = []))

  tasks.forEach((task) => {
    const column = columns.value.find((c) => c.status === task.status)
    if (column) {
      column.tasks.push(task)
    }
  })
}

const filteredColumns = computed(() => {
  const f = filter.value.toLowerCase()

  if (!f) return columns.value

  return columns.value.map((column) => ({
    ...column,
    tasks: column.tasks.filter(
      (task) =>
        (task.title || '').toLowerCase().includes(f) ||
        (task.assignee || '').toLowerCase().includes(f),
    ),
  }))
})

watch(
  () => tasksStore.tasks,
  (newTasks) => {
    formatTasksToColumns(newTasks)
  },
  { immediate: true },
)

async function fetchProject() {
  projectLoading.value = true
  try {
    const project = await projectsStore.fetchProjectById(projectId)
    console.log(project)

    if (project) {
      projectData.value = project
    }
  } catch (error) {
    console.error('Failed to fetch project details:', error)
  } finally {
    projectLoading.value = false
  }
}

async function fetchTasks() {
  await tasksStore.fetchTasks(projectId)
}

async function onDragEnd(event: any) {
  dragging.value = false

  const fromStatus = event.from.dataset.status as KanbanColumn['status']
  const toStatus = event.to.dataset.status as KanbanColumn['status']

  const newIndex = event.newIndex

  const targetColumn = columns.value.find((c) => c.status === toStatus)

  if (!targetColumn) {
    console.error('Target column not found after drag end.')
    return
  }

  const taskToUpdate = targetColumn.tasks[newIndex]

  if (!taskToUpdate) {
    console.error('Task object not found in the new list.')
    return
  }

  const taskId = taskToUpdate.id

  if (fromStatus !== toStatus) {
    console.log(`Task ${taskId} moved from ${fromStatus} to ${toStatus}. Updating status...`)
    await tasksStore.updateTask(taskId, { status: toStatus })
  }

  const newOrder = targetColumn.tasks.map((task, index) => ({
    id: task.id,
    orderIndex: index,
  }))

  console.log(
    `Order changed in ${toStatus}. New order:`,
    newOrder.map((o) => o.id),
  )
}

function openAddTaskModal() {
  isAddTaskModalOpen.value = true
}

function handleTaskCreated() {
  isAddTaskModalOpen.value = false
  fetchTasks()
}

function editTask(id: number) {
  console.log('TODO: Open edit modal for task:', id)
}

onMounted(() => {
  fetchProject()
  fetchTasks()
})
</script>

<style scoped lang="scss">
.tasks-page {
  padding: 1rem;

  h1 {
    display: flex;
    width: 100%;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .project-description-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto 1.5rem auto;
    padding: 15px;
    background-color: #eef4f9;
    border-radius: 8px;
    border-left: 4px solid #007bff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .project-description {
    font-size: 1rem;
    color: #444;
    line-height: 1.5;
    text-align: center;
    margin: 0;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding: 10px 0;
  }

  input {
    max-width: fit-content;
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
  }

  .btn-primary {
    background-color: #007bff;
    color: white;
    &:hover {
      background-color: #0056b3;
    }
  }

  .kanban-board-container {
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: 40px;
    overflow-x: auto;
    padding-bottom: 10px;
    min-height: 500px;
  }

  .kanban-column {
    width: 100%;
    background-color: #f4f5f7;
    border-radius: 8px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    max-height: 80vh;
  }

  .column-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 5px;

    h2 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #333;
    }
    .task-count {
      background: #e0e0e0;
      color: #777;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
    }
  }

  .kanban-tasks-list {
    flex-grow: 1;
    overflow-y: auto;
    min-height: 50px;
    padding-right: 5px;
  }

  .ghost-card {
    opacity: 0.5;
    background: #e9e9e9;
    border: 1px dashed #007bff;
    box-shadow: none;
    .task-title,
    .task-details {
      visibility: hidden;
    }
  }
}
</style>
