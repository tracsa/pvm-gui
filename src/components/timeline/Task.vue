<template>
  <div :id="task.id" class="card timeline-action" :class="{'highlight': highlight}">
    <span class="timeline-dot" />

    <div class="card-header">
      <div class="row">
        <div class="col">
          <div v-if="task.name" v-html="name_render" />
        </div>
      </div>
    </div>

    <div class="card-body">
      <div
        v-for="(error, index) in errors.global"
        :key="index"
        class="alert custom-alert-danger">
        {{ error.code || error.detail }}
      </div>

      <div v-if="task.description" class="task-description" v-html="description_render" />

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
  </div>
</template>

<script>
import { post } from '../../utils/api';
import formatErrors from '../../utils/formatErrors';

const md = require('markdown-it')();

export default {
  props: ['task', 'highlight'],
  data() {
    return {
      errors: {
        global: [],
      },
      sending: false,
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
  computed: {
    description_render() {
      if (!this.task) {
        return '';
      }

      return md.renderInline(this.task.description);
    },

    name_render() {
      if (!this.task) {
        return '';
      }

      return md.renderInline(this.task.name);
    },
  },
};
</script>
