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

    <b-container fluid>
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
          >Terminada el {{ pointer.finished_at|fmtDate('lll') }}</small>
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
            <b-card
              no-body>

              <b-card-body>
                <b-card-title>
                  <p v-html="comment_render"></p>
                </b-card-title>
                <b-list-group flush>
                  <b-list-group-item>
                    <b-container fluid>
                      <b-row class="d-flex justify-content-between align-items-center">
                        <template
                          v-for="(input, it) in inputs"
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
    verbose: {
      type: Boolean,
      default: false,
    },
    state: Object,
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
      return 'danger';
    },

    collapseId() {
      const vm = this;
      const modalId = `collapse-${vm.uuid}`;

      return modalId;
    },

    formatedPatch() {
      const vm = this;
      const obj = {};

      obj.inputs = [];
      vm.pointer.patch.inputs.forEach((input) => {
        const keys = input.ref.split('.');
        const formData = keys[2].split(':');

        obj.inputs.push({
          nodeRef: keys[0],
          actorId: keys[1],
          formIndex: parseInt(formData[0], 10),
          formRef: formData[1],
          inputRef: keys[3],
          value: input.value,
          valueCaption: input.value_caption,
        });
      });

      return obj;
    },

    comment_render() {
      if (!this.pointer.patch) {
        return '';
      }

      return md.renderInline(this.pointer.patch.comment);
    },

    inputs() {
      const vm = this;

      const res = [];
      vm.formatedPatch.inputs.forEach((input) => {
        const form = vm.state
          .items[input.nodeRef].actors
          .items[input.actorId].forms[input.formIndex];

        const obj = form.inputs
          .items[input.inputRef];

        const hidden = (obj.hidden === true);
        if (
          (input.formRef === form.ref) && !hidden
        ) {
          const inp = Object.assign({}, obj);

          inp.value = input.value;
          inp.value_caption = input.valueCaption;
          res.push(inp);
        }
      });

      return res;
    },

  },

  methods: {
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
