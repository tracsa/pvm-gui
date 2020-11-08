<template>
  <timeline-item-base
    :pointer="pointer"
    :extended="extended"
    :verbose="verbose"
  >
    <template v-slot:content>
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
    </template>
  </timeline-item-base>
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
    verbose: {
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

    collapseId() {
      const vm = this;
      const modalId = `collapse-${vm.uuid}`;

      return modalId;
    },
  },
};
</script>
