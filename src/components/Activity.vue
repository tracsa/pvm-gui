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
      <div v-for="form in model.form_array" :key="form.ref">
        <div
          v-for="error in errors"
          :key="error.code"
          class="alert custom-alert-danger">
          {{ $t(error.code) }}
        </div>
        <form-render
          :form="form"
          @submit="submit"
        />
      </div>
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
  methods: {
    submit: function submit(formInstance) {
      const postData = {
        process_name: this.model.id,
        form_array: [formInstance],
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
