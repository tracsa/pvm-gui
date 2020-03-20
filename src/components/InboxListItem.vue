<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <div class="text-truncate w-75">
        <small>{{ process.name }}</small><br />
        <b>{{ pointer.node.name }}</b>
      </div>
      <div
        v-if="process.status !== 'cancelled' && process.status !== 'finished'"
        :id="'assignees-' + process.id"
        class="rounded border border-light bg-secondary text-white p-1"
      >
        {{ assignees.length }}
        <icon :icon="['fa', 'users']"/>
      </div>
      <div
        v-else
        class="rounded border border-light bg-info text-white p-1"
      >
        <div class="d-flex">
          <span class="d-none d-md-block d-lg-block d-xl-none d-xl-block mr-1">
            Proceso finalizado
          </span>
          <icon :icon="['fa', 'flag-checkered']"/>
        </div>
      </div>

      <b-popover
        v-if="assignees.length"
        :target="'assignees-' + process.id"
        triggers="hover focus"
        placement="leftbottom">
        <template v-slot:title>{{ $t('inbox.assigned_to') }}</template>
        <div>
          <div
            v-for="assignee in assignees"
            :key="assignee.id">
            <strong>{{ assignee.title }}</strong>
            <a :href="'mailto:' + assignee.email">{{ assignee.email }}</a>
          </div>
        </div>
      </b-popover>
    </div>

    <div class="d-flex justify-content-end align-items-center">
      <div :title="pointer.started_at | formatDate">
        {{ pointer.started_at | relativeDate }}<br/>
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
