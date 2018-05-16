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
            :forms="task.form_array"
            :errors="errors"
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
          // notify user about error
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
          const formated = errors.reduce((obj, error) => {
            // jslint :'(
            const ref = obj;

            let used = false;
            if (typeof error.where === 'string') {
              const match = error.where.match(/request.body.form_array.(\d+).(\w+)/);
              if (match) {
                const index = match[1];
                const name = match[2];

                if (ref[index] === undefined) {
                  ref[index] = {};
                }

                if (ref[index][name] === undefined) {
                  ref[index][name] = [];
                }

                ref[index][name].push(error);
                used = true;
              }
            }

            if (!used) {
              if (ref.global === undefined) {
                ref.global = [];
              }

              ref.global.push(error);
            }

            return ref;
          }, { global: [] });

          this.sending = false;
          this.errors = formated;
        });
    },

  },
};
</script>
