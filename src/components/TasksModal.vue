<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-container">
        <h2 class="modal-title">Create New Task</h2>
        <form @submit.prevent="saveTask">
          <div class="form-group">
            <label for="task-title">Task Title</label>
            <input id="task-title" v-model="newTaskTitle" type="text" required />
          </div>

          <div class="form-group">
            <label for="task-description">Description (Optional)</label>
            <textarea id="task-description" v-model="newTaskDescription" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label for="task-assignee">Assignee</label>
            <input id="task-assignee" v-model="newTaskAssignee" type="text" />
          </div>

          <div class="modal-actions">
            <button
              type="button"
              class="btn btn-secondary"
              @click="$emit('close')"
              :disabled="tasksStore.loading"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="!newTaskTitle.trim() || tasksStore.loading"
            >
              {{ tasksStore.loading ? 'Creating...' : 'Create Task' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import type { Task } from '@/types/Task'

const props = defineProps<{
  isOpen: boolean
  projectId: number
}>()

const emit = defineEmits(['close', 'task-created'])

const tasksStore = useTasksStore()
const newTaskTitle = ref('')
const newTaskDescription = ref('')
const newTaskAssignee = ref('')

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      newTaskTitle.value = ''
      newTaskDescription.value = ''
      newTaskAssignee.value = ''
    }
  },
)

const saveTask = async () => {
  if (!newTaskTitle.value.trim()) return

  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + 7)
  const calculatedDueDate = futureDate.toISOString()

  const taskData: Omit<Task, 'id'> = {
    projectId: props.projectId,
    title: newTaskTitle.value.trim(),
    description: newTaskDescription.value.trim(),
    assignee: newTaskAssignee.value.trim() || 'Unassigned',
    status: 'todo',
    dueDate: calculatedDueDate,
  } as Omit<Task, 'id'>

  try {
    await tasksStore.addTask(taskData)

    emit('task-created')
    emit('close')
  } catch (error) {
    console.error('Failed to create task:', error)
  }
}
</script>

<style scoped lang="scss">
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 450px;
}

.modal-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

input,
textarea,
select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  resize: vertical;
  background-color: white;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    outline: none;
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-primary {
  background-color: #007bff;
  color: white;
  &:not(:disabled):hover {
    background-color: #0056b3;
  }
}

.btn-secondary {
  background-color: #e9ecef;
  color: #343a40;
  border: 1px solid #dee2e6;
  &:not(:disabled):hover {
    background-color: #d8dade;
  }
}
</style>
