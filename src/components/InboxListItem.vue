<template>
  <div class="inbox-list-item">
    <div class="inbox-info">
      <small>{{ process.name }}</small><br />
      {{ pointer.node.name }}
    </div>

    <div class="time-info" :title="pointer.started_at | formatDate">
      {{ pointer.started_at | relativeDate }}
    </div>

    <div v-if="assignees.length > 0" class="assignee">
      <span v-if="assignees.length == 1">
        {{ assignees[0].abbr }}
      </span>
      <span v-else>
        {{ assignees.length }}
      </span>
      <div class="popover bs-popover-bottom">
        <div class="arrow"></div>
        <h3 class="popover-header">
          {{ $t('inbox.assigned_to') }}
        </h3>
        <div class="popover-body">
          <div
            v-for="assignee in assignees"
            :key="assignee.id">
            <strong>{{ assignee.title }}</strong>
            <a :href="'mailto:' + assignee.email">{{ assignee.email }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  props: ['process'],
  filters: {
    relativeDate(val) {
      const now = new Date();
      const timestamp = new Date(val);

      const day = 24 * 60 * 60 * 1000;
      const tminusone = now - day;
      const tminustwo = now - (2 * day);

      if (tminusone < timestamp) {
        return moment(val).fromNow();
      }

      if (tminustwo < timestamp) {
        return moment(val).format('l LT');
      }

      return moment(val).format('L');
    },
    formatDate(val) {
      return moment(val).format('LLLL');
    },
  },
  computed: {
    pointer: function pointer() {
      return this.process.pointer;
    },
    assignees: function assignees() {
      return this.pointer.notified_users.map(user => ({
        id: user.id,
        abbr: user.fullname.slice(0, 2),
        title: user.fullname,
        email: user.email,
      }));
    },
  },
};
</script>
