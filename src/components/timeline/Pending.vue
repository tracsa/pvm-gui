<template>
  <div :id="node.id" v-if="!hidden" class="timeline-action">
    <span class="timeline-dot dot-orange" />

    <div class="alert custom-alert-warning">
      <div v-if="node.node.name" class="task-description" v-html="name_render" />
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

const md = require('markdown-it')();

export default {
  props: ['node'],
  computed: {
    hidden() {
      const user = getAuthUser();
      const assignees = this.node.notified_users.map(u => u.identifier);

      return assignees.indexOf(user.username) !== -1;
    },

    name_render() {
      if (!this.node.node) {
        return '';
      }

      return md.render(this.node.node.name);
    },
  },
};
</script>
