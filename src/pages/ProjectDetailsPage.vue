<template>
  <section class="tasks-page">
    <h1>Tasks for Project: {{ projectTitle }}</h1>

    <div class="actions">
      <button @click="fetchTasks">Reload Tasks</button>
      <input v-model="filter" placeholder="Search by title or assignee..." />
      <button @click="openAddTaskModal">Add Task</button>
    </div>

    <div v-if="tasksStore.loading">Loading tasks...</div>

    <table v-else class="tasks-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Assignee</th>
          <th>Due Date</th>
          <th>Status</th>
        </tr>
      </thead>

      <draggable
        v-model="draggableTasks"
        tag="tbody"
        item-key="id"
        @start="dragging = true"
        @end="onDragEnd"
      >
        <template #item="{ element: task }">
          <tr
            v-show="isTaskVisible(task)"
            :class="{ dragging: dragging }"
            @click="editTask(task.id)"
          >
            <td>{{ task.id }}</td>
            <td>{{ task.title }}</td>
            <td>{{ task.assignee }}</td>
            <td>{{ new Date(task.dueDate).toLocaleDateString() }}</td>
            <td>
              <span :class="['status', task.status]">{{ statusLabels[task.status] }}</span>
            </td>
          </tr>
        </template>
      </draggable>
    </table>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'
import draggable from 'vuedraggable'
import type { Task } from '@/types/Task'

const tasksStore = useTasksStore()
const route = useRoute()

const projectId = Number(route.params.id)
const projectTitle = ref(`Project ${projectId}`)
const filter = ref('')
const dragging = ref(false)

const draggableTasks = ref<Task[]>([])

const statusLabels = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
} as const

watch(
  () => tasksStore.tasks,
  (newTasks) => {
    draggableTasks.value = [...newTasks]
  },
  { immediate: true },
)

async function fetchTasks() {
  await tasksStore.fetchTasks(projectId)
}

async function onDragEnd() {
  dragging.value = false

  console.log(
    'Tasks reordered locally:',
    draggableTasks.value.map((t) => t.id),
  )
}

function isTaskVisible(task: Task): boolean {
  const f = filter.value.toLowerCase()
  if (!f) return true

  return (
    (task.title || '').toLowerCase().includes(f) ||
    (task.assignee || '').toLowerCase().includes(f) ||
    (task.status || '').toLowerCase().includes(f)
  )
}

function openAddTaskModal() {
  alert('TODO: Add task modal for project ' + projectId)
}

function editTask(id: number) {
  console.log('TODO: Open edit modal for task:', id)
}

onMounted(fetchTasks)
</script>

<style scoped lang="scss">
.tasks-page {
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

  .tasks-table {
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
      cursor: pointer;
      &.dragging {
        opacity: 0.5;
      }
      &:hover {
        background: #f7f7f7;
      }
    }

    .status {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: bold;
      &.todo {
        background-color: #ffe0b2;
        color: #ff9800;
      }
      &.in-progress {
        background-color: #bbdefb;
        color: #2196f3;
      }
      &.done {
        background-color: #c8e6c9;
        color: #4caf50;
      }
    }
  }
  .actions {
    display: flex;
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>
