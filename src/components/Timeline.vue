<template>
  <div style="flex-grow: 1">
    <div v-if="last !== null" class="text-primary">
      <b>{{ last.execution.name }}</b>
    </div>
    <div class="timeline-container">
      <div class="vertical-line"></div>
      <div class="timeline">
        <timeline-action
          v-for="action in actions"
          :key="action.id"
          :action="action"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { get } from '@/utils/api';

export default {
  props: ['actions'],
  computed: {
    last: function last() {
      if (this.actions.length === 0) {
        return null;
      }

      return this.actions[0];
    }
  },
};
</script>
