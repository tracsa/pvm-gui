<template>
  <div class="card">
    <div class="card-header">
      <div style="font-size:16px;float:right;">
        <a @click="this.$router.go(-1)">
          <icon :icon="['fas', 'times']" />
        </a>
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
        :sending="sending"
        @submit="submit"
      />
    </div>
  </div>
</template>

<script>
import { post } from '@/utils/api';
import formatErrors from '@/utils/formatErrors';

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
