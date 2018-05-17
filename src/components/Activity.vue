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
        v-for="error in errors"
        :key="error.where"
        class="alert custom-alert-danger">
        {{ $t(`errors.${error.where}`) }}
      </div>

      <form-render
        :forms="model.form_array"
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
      errors: [],
    };
  },
  watch: {
    model() {
      this.errors = [];
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
          this.errors = errors;
          console.error(errors);
        });
    },
  },
};
</script>
