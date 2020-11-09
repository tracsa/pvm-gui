<template>
  <div
    class="card no-body text-dark bg-light py-3 shadow overflow-auto"
  >
    <div class="container-fluid">
      <div class="d-flex justify-content-between">
        <small class="text-muted">Tarea</small>
        <small class="text-muted">{{ pointer.id }}</small>
      </div>

      <div class="row no-gutters">
        <div
          class="col"
          :class="{ 'text-truncate': extended }"
        >
          <b v-html="pointerNameRender"/><br/>
          <router-link
            v-if="extended"
            :to="{
              name: 'dashboard',
              query: {
                executionId: pointer.execution.id,
              },
            }"
          >
            <small>En <b v-html="executionNameRender"/></small>
          </router-link>
        </div>
      </div>

      <div class="row no-gutters">
        <div class="col">
          <small
            class="text-muted"
            :title="pointer.started_at|fmtDate('LLLL')"
          >
            <span
              v-if="verbose"
            >Creada el {{ pointer.started_at|fmtDate('LLLL') }}</span>
            <span
              v-else
            >{{ pointer.started_at|fmtDate('lll') }}</span>
          </small>
        </div>
      </div>

      <div class="row no-gutters">
        <div class="col">
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
            href="#"
            v-on:click.prevent
            :id="assigneesPopoverId"
          >
            <icon :icon="['fas', 'user-tag']" class="mr-1"/>

            <small>
              <span><b>Asignada a {{ assignees.length }}</b></span>
            </small>
          </a>

          <span v-else>
            <small>Sin usuarios asignados</small>
          </span>
        </div>
      </div>
    </div>

    <slot name="content"></slot>
  </div>
</template>

<script>
import moment from 'moment';

const md = require('markdown-it')();

export default {
  props: {
    pointer: {
      type: Object,
      required: true,
    },
    extended: {
      type: Boolean,
      default: false,
    },
    verbose: {
      type: Boolean,
      default: false,
    },
  },

  filters: {
    fmtDate(val, fmt = 'llll') {
      return moment(val).format(fmt);
    },
  },

  data() {
    return {
      uuid: Math.random(),
    };
  },

  computed: {
    pointerNameRender() {
      if (!this.pointer.node) {
        return '';
      }

      return md.renderInline(this.pointer.node.name);
    },

    executionNameRender() {
      if (!this.pointer.execution) {
        return '';
      }

      return md.renderInline(this.pointer.execution.name);
    },

    assignees() {
      return this.pointer.notified_users.map(user => ({
        id: user.id,
        fullname: user.fullname,
        email: user.email,
      })).sort((a, b) => (a.fullname > b.fullname ? 1 : -1));
    },

    assigneesPopoverId() {
      const vm = this;
      const modalId = `assignees-popover-${vm.uuid}`;

      return modalId;
    },

    borderVariant() {
      return 'warning';
    },

    actors() {
      const vm = this;

      if (vm.pointer.actors.items) {
        const actorsList = [];

        Object.values(vm.pointer.actors.items).forEach((item) => {
          actorsList.push({
            identifier: item.user.identifier,
            fullname: item.user.fullname,
          });
        });
        return actorsList;
      }

      return [];
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
