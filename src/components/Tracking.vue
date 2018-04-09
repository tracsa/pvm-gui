<template>
  <div>
    <div v-if="last !== null" class="text-primary">
      <b>{{ last.execution.name }}</b>
    </div>

    <timeline v-if="!loading" :actions="actions" />
  </div>
</template>

<script>
import { get } from '@/utils/api';

export default {
  props: ['id'],
  data() {
    return {
      loading: true,
      actions: [],
    };
  },
  mounted() {
    this.loadData(this.id);
  },
  watch: {
    id: function (newId) {
      this.loadData(newId);
    },
  },
  computed: {
    last: function last() {
      if (this.actions.length === 0) {
        return null;
      }

      return this.actions[0];
    }
  },
  methods: {
    loadData: function loadData(id) {
      get(`/log/${id}`)
        .then((body) => {
          this.loading = false;
          this.actions = body.data;
        })
        .catch((errors) => {
          this.loading = false;
          alert();
        });
    }
  },
};
</script>
