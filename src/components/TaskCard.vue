<template>
  <div class="task-card" @click="$emit('edit', task.id)">
    <p class="task-title">{{ task.title }}</p>
    <div class="task-details">
      <span class="task-assignee">🧑‍💻 {{ task.assignee }}</span>
      <span class="task-date">📅 {{ new Date(task.dueDate).toLocaleDateString() }}</span>
    </div>
    <div :class="['status', task.status]">
      {{ statusLabels[task.status] }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/types/Task'

defineProps<{
  task: Task
}>()

defineEmits(['edit'])

const statusLabels = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
} as const
</script>

<style scoped lang="scss">
.task-card {
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  cursor: pointer;
  transition:
    transform 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  border-left: 5px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .task-title {
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 0.95rem;
    color: #333;
  }

  .task-details {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: #666;
  }

  .status {
    display: inline-block;
    padding: 2px 8px;
    margin-top: 8px;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: bold;
  }

  &.todo {
    border-left-color: #ff9800;
  }
  &.in-progress {
    border-left-color: #2196f3;
  }
  &.done {
    border-left-color: #4caf50;
  }

  & .status-badge {
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
</style>
