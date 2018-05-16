<template>
  <div v-if="!loading">
    <div class="timeline">
      <div class="card timeline-action">
        <div class="card-body">
          <div class="float-right">
            <router-link :to="{ path: '/tracking'}">
              <icon :icon="['fas', 'times']" />
            </router-link>
          </div>
          <div
            v-for="(error, index) in errors.global"
            :key="index"
            class="alert custom-alert-danger">
            {{ error.code || error.detail }}
          </div>

          <form-render
            v-if="task.node_type === 'action'"
            :forms="task.form_array"
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
    </div>

    <timeline v-if="actions.length > 0" :actions="actions" />
  </div>
  <div v-else>
    <loading />
  </div>

</template>

<script>
import { get, post } from '@/utils/api';
import formatErrors from '@/utils/formatErrors';

export default {
  props: ['taskId'],
  data() {
    return {
      errors: {
        global: [],
      },
      loading: true,
      sending: false,
      task: null,
      actions: [],
    };
  },
  mounted() {
    this.loadData(this.taskId);
  },
  watch: {
    taskId(newValue) {
      this.loadData(newValue);
      this.errors = {
        global: [],
      };
    },
  },
  methods: {
    loadData: function loadData(id) {
      get(`/task/${id}`)
        .then((body) => {
          this.task = body.data;

          return get(`/log/${this.task.execution.id}`);
        })
        .then((body) => {
          this.loading = false;
          this.actions = body.data;
        })
        .catch(() => {
          // TODO notify user
        });
    },
    validate: function validate(validation) {
      const postData = Object.assign({
        execution_id: this.task.execution.id,
        node_id: this.task.node_id,
      }, validation);

      this.sending = true;
      post('/pointer', postData, 'application/json')
        .then(() => {
          this.sending = false;
          this.$router.push(`/tracking/${this.task.execution.id}`);
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
          this.$router.push(`/tracking/${this.task.execution.id}`);
        })
        .catch((errors) => {
          this.sending = false;
          this.errors = formatErrors(errors);
        });
    },

  },
};
</script>
