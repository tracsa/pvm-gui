<template>
  <timeline-item-base
    :pointer="pointer"
    :extended="extended"
    :verbose="verbose"
  >
    <template v-slot:content>
      <b-container fluid>
        <hr/>
        <b-row no-gutters class="mt-3">
          <b-col cols="12">
            <b-collapse :id="collapseId" v-model="visible">
              <b-card
                no-body>

                <b-card-body>
                  <b-card-title>
                    <span>{{ pointer.patch.actor.fullname }}</span>
                    <small class="text-muted">llenó la siguente información</small>
                  </b-card-title>

                  <p v-html="comment_render"></p>

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

            <div class="w-100 text-center">
              <a
                v-b-toggle="collapseId"
                href="#"
                v-on:click.prevent
              >
                <span v-if="!visible">
                  <icon :icon="['fas', 'caret-down']"/>
                  Mostrar detalle</span>
                <span v-else>
                  <icon :icon="['fas', 'caret-up']"/>
                  Ocultar detalle</span>
              </a>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </template>
  </timeline-item-base>
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
