<template>
  <div v-if="!loading">
    <div class="timeline" v-for="form in task.form_array" :key="form.ref">
      <div class="card timeline-action">
          <div class="card-body">
            <div class="float-right">
              <router-link :to="{ path: '/tracking'}">
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
              :form="form"
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
          console.error(errors);
        });
    },
    submit: function submit(formInstance) {
      const postData = {
        execution_id: this.task.execution.id,
        node_id: this.task.node_id,
        form_array: [formInstance],
      };

      post('/pointer', postData, 'application/json')
        .then((data) => {
          this.$router.push(`/tracking/${this.task.execution.id}`);
          console.log('data', data);
        })
        .catch((errors) => {
          this.errors = errors;
        });
    },

  },
};
</script>
