<template>
  <b-card
    no-body
    class="py-3 shadow"
    text-variant="dark"
    bg-variant="light"
  >
    <b-container fluid>
      <b-row no-gutters>
        <b-col><b v-html="name_render"/>
        </b-col>
      </b-row>

      <b-row no-gutters>
        <b-col>
          <small
            class="text-muted"
            :title="pointer.started_at|fmtDate('LLLL')"
          >Tarea creada el {{ pointer.started_at|fmtDate('lll') }}</small>
        </b-col>
      </b-row>

      <b-row no-gutters>
        <b-col>
          <b-popover
            v-if="assignees.length"
            :target="assigneesPopoverId"
            triggers="click blur"
            placement="bottomleft"
            title="Usuarios asignados"
          >
            <div>
              <div
                v-for="assignee in assignees"
                class="mt-2"
                :key="assignee.id"
              >
                <b>{{ assignee.fullname }}</b><br/>
                <a :href="'mailto:' + assignee.email">{{ assignee.email }}</a>
              </div>
            </div>
          </b-popover>

          <a
            v-if="assignees.length"
            href="javascript:void(0)"
            :id="assigneesPopoverId"
          >
            <small>Asignada a <b>{{ assignees[0].fullname }}</b>
              <span
                v-if="assignees.length > 1"
              >y <b>{{ assignees.length - 1 }}</b> más</span>
            </small>
          </a>

          <span v-else>
            <small>Sin usuarios asignados</small>
          </span>
        </b-col>
      </b-row>
    </b-container>
  </b-card>
</template>

<script>
import moment from 'moment';

const md = require('markdown-it')();

export default {
  props: ['pointer'],

  filters: {
    fmtDate(val, fmt = 'llll') {
      return moment(val).format(fmt);
    },
  },

  computed: {
    name_render() {
      if (!this.pointer.node) {
        return '';
      }

      return md.renderInline(this.pointer.node.name);
    },

    assignees() {
      return this.pointer.notified_users.map(user => ({
        id: user.id,
        fullname: user.fullname,
        email: user.email,
      }));
    },

    assigneesPopoverId() {
      const vm = this;
      const modalId = `assignees-popover-${vm.pointer.id}`;

      return modalId;
    },

    borderVariant() {
      return 'warning';
    },
  },
};
</script>

<style scoped>
.custom-card-border {
  border-left-style:solid;
  border-left-width: 4px;
};
</style>
