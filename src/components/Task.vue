<template>
  <div v-if="!loading">
    <div class="timeline">
      <div class="card timeline-action">
        <div class="card-body">
          <div class="float-right">
            <router-link :to="{ path: '/task'}">
              <icon :icon="['fas', 'times']" />
            </router-link>
          </div>
          <div
            v-for="error in errors"
            :key="error.code"
            class="alert custom-alert-danger">
            {{ $t('error.code') }}
          </div>

          <form-render
            :forms="task.form_array"
            :sending="sending"
            @submit= "submit"
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

export default {
  props: ['taskId'],
  data() {
    return {
      errors: [],
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
        .catch((errors) => {
          this.loading = false;
          this.errors = errors;
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
          this.errors = errors;
        });
    },

  },
};
</script>
