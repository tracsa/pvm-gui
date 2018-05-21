<template>
  <div
    v-if="!hidden"
    class="timeline-action">
    <span class="timeline-dot dot-orange" />

    <div class="alert custom-alert-warning">
      <div>{{ node.node.name }}</div>
      <div>
        <small>Asignado a </small>
        <small
          style="font-weight: bold;"
          v-for="user in node.notified_users"
          :key="user.id">
          {{ user.fullname }}&nbsp;
        </small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['node'],
  data() {
    const hidden = (this.$router.history.current.name === 'task');
    return { hidden };
  },
};
</script>
