<template>
  <div v-if="!loading" class="timelines-container container">
    <!-- {{ task }} -->

    <div v-for="form in task.form_array" :key="form.ref">
      <div
        v-for="error in errors"
        :key="error.code"
        class="alert custom-alert-danger">
        {{ $t('error.code') }}
      </div>
      <form-render
        :form="form"
        @submit="submit"
      />
    </div>    

    =========================
    {{ timeline }}
  </div>
</template>

<script>
import moment from 'moment';
import { get, post } from '@/utils/api';

export default {
  props: ['taskId'],
  data() {
    return {
      errors: [],
      loading: true,
      task: null,
      timeline: null,
    };
  },
  mounted() {
    console.log(this.taskId)
    this.loadData(this.taskId);
  },
  watch: {
    model(newValue, prevValue) {
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
          this.timeline = body.data;
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
          this.$router.push('/tracking');
          console.log('data', data);
        })
        .catch((errors) => {
          this.errors = errors;
        });
    },

  },
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

</style>
