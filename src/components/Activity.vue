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
        class="card-desc">
        {{ model.description }}
      </div>
      <div
        v-for="(error, index) in errors.global"
        :key="index"
        class="alert custom-alert-danger">
        {{ error.code || error.detail }}
      </div>
      <div>
      </div>

      <form-render
        :forms="model.form_array"
        :errors="errors"
        :sending="sending"
        @submit="submit"
      />
    </div>
  </div>
</template>

<script>
import { post } from '../utils/api';
import formatErrors from '../utils/formatErrors';

export default {
  props: ['model'],
  data() {
    return {
      sending: false,
      errors: {
        global: [],
      },
    };
  },
  watch: {
    model() {
      this.sending = false;
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

      this.sending = true;
      post('/execution', postData, 'application/json')
        .then((data) => {
          this.sending = false;
          this.$router.push(`/tracking/${data.data.id}`);
        })
        .catch((errors) => {
          this.sending = false;
          this.errors = formatErrors(errors);
        });
    },
  },
};
</script>
