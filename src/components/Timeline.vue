<template>
  <div class="timeline">
    <timeline-task
      v-if="task"
      :task="task"
    />

    <div
      v-for="node in pointers"
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
  props: ['pointers', 'task'],
};
</script>
