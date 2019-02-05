<template>
  <div class="process-list-item">
    <div class="process-info">
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
      const pointers = this.process.pointer;

      if (pointers.length === 0) {
        return null;
      }

      return pointers[pointers.length - 1];
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

<style lang="scss">
$listitem-height: 58px;
.process-list-item {
  color: black;
  padding: 10px 5px 10px 15px;
  border-top: 1px solid #EAEAEA;
  position: relative;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
  align-content: stretch;

  &:hover {
    background: #e4dcf3;
  }

  $assignee-margin: 10px;
  $assignee-size: $listitem-height - 2 * $assignee-margin;

  .assignee {
    position: relative;
    background: steelblue;
    border-radius: $assignee-size / 2;
    color: white;
    flex-shrink: 0;
    font-size: 0.8em;
    font-weight: bold;
    height: $assignee-size;
    padding-top: 3px;
    line-height: $assignee-size;
    margin: $assignee-margin;
    text-align: center;
    text-transform: uppercase;
    width: $assignee-size;

    &.counter {
      background-color: #4e2d89;
    }

    .popover {
      display: none;
    }

    &:hover .popover {
      display: block;
    }
  }

  .popover {
    min-width: 200px;
    color: #333;
    position: absolute;
    top: 10px + $assignee-size / 2;
    left: auto;
    right: -5px;

    &.active {
      display: block;
    }

    .arrow {
      left: auto;
      right: 8px;
    }
  }

  .time-info {
    flex-shrink: 0;
    line-height: $listitem-height;
    color: #333;
  }

  .process-info {
    flex-grow: 1;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    font-size: 1.2em;

    small {
      color: #555;
    }
  }
}
</style>
