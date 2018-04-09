<template>
  <div class="timeline">
    <timeline-action
      v-for="action in actions"
      :key="action.id"
      :action="action"
    />
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
