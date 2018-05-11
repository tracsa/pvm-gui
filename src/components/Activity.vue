<template>
  <div class="card">
    <div class="card-header">
      <div style="font-size:16px;float:right;">
        <router-link :to="{ name: 'processes' }">
          <icon :icon="['fas', 'times']" />
        </router-link>
      </div>
      <span>{{ model.name }}</span>
    </div>
    <div class="card-body">
      <div
        v-for="(error, index) in errors.global"
        :key="index"
        class="alert custom-alert-danger">
        {{ error.code || error.detail }}
      </div>

      <form-render
        :forms="model.form_array"
        :errors="errors"
        @submit="submit"
      />
    </div>
  </div>
</template>

<script>
import { post } from '@/utils/api';

export default {
  props: ['model'],
  data() {
    return {
      errors: {
        global: [],
      },
    };
  },
  watch: {
    model() {
      this.errors = {
        global: [],
      };
    },
  },
  methods: {
    submit: function submit(formArray) {
      const postData = {
        process_name: this.model.id,
        form_array: formArray,
      };

      post('/execution', postData, 'application/json')
        .then((data) => {
          this.$router.push(`/tracking/${data.data.id}`);
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

          this.errors = formated;
        });
    },
  },
};
</script>
