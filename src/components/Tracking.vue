<template>
  <timeline v-if="!loading" :actions="actions" />
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
