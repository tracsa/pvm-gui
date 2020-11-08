<template>
  <b-card
    no-body
    class="py-3 shadow overflow-auto"
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

    <b-container>
      <hr/>

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
            <div class="card-body">
              <div
                v-for="(error, index) in errors.global"
                :key="index"
                class="alert custom-alert-danger">
                {{ error.code || error.detail }}
              </div>

              <p v-if="task.description" class="card-desc" v-html="description_render" />

              <form-render
                v-if="task.node_type === 'action'"
                :forms="task.form_array"
                :prevWork="task.prev_work"
                :errors="errors"
                :sending="sending"
                @submit= "submit"
              />

              <data-validator
                v-if="task.node_type === 'validation'"
                :fields="task.fields"
                :errors="errors"
                :sending="sending"
                @submit= "validate"
              />
            </div>
          </b-collapse>
        </b-col>
      </b-row>
    </b-container>
  </b-card>
</template>

<script>
import moment from 'moment';
import { post } from '../../utils/api';
import formatErrors from '../../utils/formatErrors';

const md = require('markdown-it')();

export default {
  props: {
    task: Object,
    pointer: Object,
    extended: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      uuid: Math.random(),
      errors: {
        global: [],
      },
      sending: false,

      visible: true,
    };
  },

  methods: {
    validate: function validate(validation) {
      const postData = Object.assign({
        execution_id: this.task.execution.id,
        node_id: this.task.node_id,
      }, validation);

      this.sending = true;
      post('/pointer', postData, 'application/json')
        .then(() => {
          this.sending = false;
          this.$emit('complete');
        })
        .catch((errors) => {
          this.sending = false;
          this.errors = formatErrors(errors);
        });
    },
    submit: function submit(formArray) {
      const postData = {
        execution_id: this.task.execution.id,
        node_id: this.task.node_id,
        form_array: formArray,
      };

      this.sending = true;
      post('/pointer', postData, 'application/json')
        .then(() => {
          this.sending = false;
          this.$emit('complete');
        })
        .catch((errors) => {
          this.sending = false;
          this.errors = formatErrors(errors);
        });
    },
  },

  filters: {
    fmtDate(val, fmt = 'llll') {
      return moment(val).format(fmt);
    },
  },

  computed: {
    description_render() {
      if (!this.task) {
        return '';
      }

      return md.render(this.task.description);
    },

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
      const modalId = `assignees-popover-${vm.uuid}`;

      return modalId;
    },

    borderVariant() {
      return 'warning';
    },

    collapseId() {
      const vm = this;
      const modalId = `collapse-${vm.uuid}`;

      return modalId;
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
