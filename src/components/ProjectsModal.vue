<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-container">
        <h2 class="modal-title">Create New Project</h2>
        <form @submit.prevent="saveProject">
          <div class="form-group">
            <label for="project-title">Project Title</label>
            <input id="project-title" v-model="newProjectTitle" type="text" required />
          </div>

          <div class="modal-actions">
            <button
              type="button"
              class="btn btn-secondary"
              @click="$emit('close')"
              :disabled="store.loading"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="!newProjectTitle.trim() || store.loading"
            >
              {{ store.loading ? 'Creating...' : 'Create Project' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import type { Project } from '@/types/Project'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'project-created'])

const store = useProjectsStore()
const newProjectTitle = ref('')

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      newProjectTitle.value = ''
    }
  },
)

const saveProject = async () => {
  if (!newProjectTitle.value.trim()) return

  const projectData: Partial<Project> = {
    title: newProjectTitle.value.trim(),
    taskCount: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
  }

  try {
    await store.addProject(projectData as Project)

    emit('project-created')
    emit('close')
  } catch (error) {
    console.error('Failed to create project:', error)
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

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

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
