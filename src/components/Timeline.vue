<template>
  <div class="timeline">
    <div
      v-for="node in actions"
      :key="node.id">
      <timeline-pending
        v-if="node.finished_at === null"
        :node="node"
      />

      <timeline-validation
        v-else-if="node.node.type === 'validation'"
        :validation="node"
      />

      <timeline-action
        v-else-if="node.node.type === 'action'"
        :action="node"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ['actions'],
  computed: {
    last: function last() {
      if (this.actions.length === 0) {
        return null;
      }

      return this.actions[0];
    },
  },
};
</script>
