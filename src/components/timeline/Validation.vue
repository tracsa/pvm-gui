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

      <b-row no-gutters>
        <b-col>
          <small
            class="text-muted"
            :title="pointer.started_at|fmtDate('LLLL')"
          >Creada el {{ pointer.started_at|fmtDate('lll') }}</small>
        </b-col>
      </b-row>

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

      <b-row no-gutters>
        <b-col>
          <span
            class="badge badge-primary"
            :class="{ 'badge-success': state, 'badge-danger': !state }">
            <span
              v-if="state">{{ $t('timeline.validation.valid') }}</span>
            <span
              v-else>{{ $t('timeline.validation.invalid') }}</span>
          </span>
        </b-col>
      </b-row>

      <b-row no-gutters class="mt-3">
        <b-col cols="12">
          <a
            v-b-toggle="collapseId"
            href="#"
            v-on:click.prevent
          >
            <span v-if="!visible">Mostrar más</span>
            <span v-else>Mostrar menos</span>
          </a>

          <b-collapse :id="collapseId" v-model="visible">
            <template
              v-if="commentArray.length > 0"
            >
              <b-card
                no-body
                v-for="item in commentArray"
                :key="item.identifier"
                class="mt-2"
              >
                <b-card-body>
                  <blockquote class="blockquote mb-0">
                    <p>{{ item.comment }}</p>

                    <footer class="blockquote-footer">
                      {{ item.fullname }}
                    </footer>
                  </blockquote>
                </b-card-body>
              </b-card>
            </template>

            <template
              v-else
            >
              <b-card-text
                class="mt-2 text-center"
              >
                No hay información que mostrar.
              </b-card-text>
            </template>
          </b-collapse>
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
  },

  data() {
    return {
      uuid: Math.random(),
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
      })).sort((a, b) => (a.fullname > b.fullname ? 1 : -1));
    },

    assigneesPopoverId() {
      const vm = this;
      const modalId = `assignees-popover-${vm.uuid}`;

      return modalId;
    },

    borderVariant() {
      const vm = this;
      return vm.state ? 'success' : 'danger';
    },

    collapseId() {
      const vm = this;
      const modalId = `collapse-${vm.uuid}`;

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

    state() {
      let state = true;
      Object.values(this.pointer.actors.items).forEach((actor) => {
        for (let i = 0; i < actor.forms.length; i += 1) {
          const inputs = actor.forms[i].inputs.items;
          state = state && inputs.response.value === 'accept';
        }
      });

      return state;
    },

    commentArray() {
      const comArr = [];
      const vm = this;
      Object.values(vm.pointer.actors.items).forEach((actor) => {
        const com = vm.getComment(actor);
        const name = actor.user.fullname;
        const id = actor.user.identifier;

        if (com) {
          comArr.push({ comment: com, fullname: name, identifier: id });
        }
      });

      return comArr;
    },
  },

  methods: {
    getComment(actor) {
      const comment = actor.forms[0].inputs.items.comment.value;
      if (!comment || comment.length === 0 || !comment.trim()) {
        return null;
      }

      return comment;
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
