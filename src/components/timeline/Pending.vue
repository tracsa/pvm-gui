<template>
  <div v-if="!hidden" class="timeline-action">
    <span class="timeline-dot dot-orange" />

    <div class="alert custom-alert-warning">
      <div>{{ node.node.name }}</div>
      <div>
        <small>Asignado a </small>
        <small
          style="font-weight: bold;"
          v-for="user in node.notified_users"
          :key="user.id">
          {{ user.fullname || user.identifier }}&nbsp;
        </small>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuthUser } from '../../utils/auth';

export default {
  props: ['node'],
  computed: {
    hidden() {
      const user = getAuthUser();
      const assignees = this.node.notified_users.map(u => u.identifier);

      return assignees.indexOf(user.username) !== -1;
    },
  },
};
</script>
