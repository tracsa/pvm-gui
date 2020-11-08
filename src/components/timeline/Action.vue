<template>
  <b-card
    no-body
    class="py-3 shadow"
    text-variant="dark"
    bg-variant="light"
  >
    <b-container fluid>
      <div class="d-flex justify-content-between">
        <small class="text-muted">Tarea</small>
        <small class="text-muted">{{ pointer.id }}</small>
      </div>

      <b-row no-gutters>
        <b-col
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
        </b-col>
      </b-row>

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
            href="javascript:void(0)"
            :id="assigneesPopoverId"
          >
            <icon :icon="['fas', 'user-tag']" class="mr-1"/>

            <span
              v-if="verbose"
            >
              <small>
                <span>Asignada a </span>
                <b>{{ assignees[0].fullname }}</b>
                <span
                  v-if="assignees.length > 1"
                > y <b>{{ assignees.length - 1 }}</b> más</span>
              </small>
            </span>

            <span
              v-else
            >
              <small>
                <span><b>Asignada a {{ assignees.length }}</b></span>
              </small>
            </span>
          </a>

          <span v-else>
            <small>Sin usuarios asignados</small>
          </span>
        </div>
      </div>
    </b-container>

    <b-container fluid
      v-if="actors.length"
    >
      <hr/>

      <b-row no-gutters>
        <b-col>
          Realizada por <b>{{ actors[0].fullname }}</b>
          <span
            v-if="actors.length > 1"
          >y <b>{{ actors.length - 1 }}</b> más</span>
        </b-col>
      </b-row>

      <b-row no-gutters
        v-if="pointer.finished_at"
      >
        <b-col>
          <small
            class="text-muted"
            :title="pointer.finished_at|fmtDate('LLLL')"
          >Terminada el {{ pointer.finished_at|fmtDate('lll') }}</small>
        </b-col>
      </b-row>

      <b-row no-gutters class="mt-3">
        <b-col cols="12">
          <a
            v-b-toggle="collapseId"
            href="javascript:void(0)"
          >
            <span v-if="!visible">Mostrar más</span>
            <span v-else>Mostrar menos</span>
          </a>

          <b-collapse :id="collapseId" v-model="visible">
            <b-row no-gutters class="mt-2">
              <b-col
                cols="12"
                v-for="(actor, identifier) in pointer.actors.items"
                :key="identifier"
              >
                <b-card
                  no-body
                  :key="identifier">
                  <b-card-body>
                    <b-card-title>
                      {{ actor.user.fullname }}
                    <small class="text-muted">llenó la siguiente informacion</small>
                    </b-card-title>

                    <b-list-group flush>
                      <b-list-group-item
                        v-for="(form, key) in actor.forms"
                        :key="key"
                      >
                        <b-container fluid>
                          <b-row class="d-flex justify-content-between align-items-center">
                            <template
                              v-for="(input, it) in listInputs(form.inputs)"
                            >
                              <b-col
                                :key="it"
                                cols="12"
                                class="px-4 pb-1"
                              >
                                <div
                                  class="border-left pl-1"
                                  :class="[emptyValue(input) ? 'border-warning' : 'border-info']">
                                  <small
                                    :class="{ 'text-muted': emptyValue(input)}"
                                  >{{ input.label }}</small><br/>

                                  <p
                                    :class="{ 'text-muted': emptyValue(input) }"
                                  ><value-render :input="input"/><br/></p>
                                </div>
                              </b-col>
                            </template>
                          </b-row>
                        </b-container>

                      </b-list-group-item>
                    </b-list-group>
                  </b-card-body>
                </b-card>
              </b-col>
            </b-row>
          </b-collapse>
        </b-col>
      </b-row>

    </b-container>

    <b-container fluid
      v-if="pointer.state === 'cancelled'"
    >
      <hr/>

      <b-row no-gutters>
        <b-col>
          Cancelada
        </b-col>
      </b-row>

      <b-row no-gutters
        v-if="pointer.finished_at"
      >
        <b-col>
          <small
            class="text-muted"
            :title="pointer.finished_at|fmtDate('LLLL')"
          >Cancelada el {{ pointer.finished_at|fmtDate('lll') }}</small>
        </b-col>
      </b-row>

    </b-container>
  </b-card>
</template>

<script>
import moment from 'moment';

const md = require('markdown-it')();

export default {
  props: {
    pointer: Object,
    extended: {
      type: Boolean,
      default: false,
    },
    verbose: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      keyUsers: process.env.KEY_USERS,

      visible: false,
    };
  },

  filters: {
    fmtDate(val, fmt = 'llll') {
      return moment(val).format(fmt);
    },
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
      }));
    },

    assigneesPopoverId() {
      const vm = this;
      const modalId = `assignees-popover-${vm.pointer.id}`;

      return modalId;
    },

    borderVariant() {
      const vm = this;
      return vm.state ? 'primary' : 'danger';
    },

    collapseId() {
      const vm = this;
      const modalId = `collapse-${vm.pointer.id}`;

      return modalId;
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

  methods: {
    listInputs(inputs) {
      return inputs.item_order
        .map(key => inputs.items[key])
        .filter(input => !input.hidden);
    },

    emptyValue(input) {
      if (!input.value) return true;

      return (input.value === null || input.value_caption === '');
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-card-border {
  border-left-style:solid;
  border-left-width: 4px;
};
</style>
