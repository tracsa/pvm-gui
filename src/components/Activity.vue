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
        v-for="(error, index) in errors"
        :key="index"
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
        });
    },
  },
};
</script>
