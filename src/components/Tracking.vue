<template>
  <div>
    <div v-if="last !== null" class="text-primary">
      <div class="row">
      <div class="col-11">
        <b>{{ last.execution.name }}</b>
      </div>
      <div class="col-1 text-right">
        <a @click="this.$router.go(-1)">
          <icon :icon="['fas', 'times']" />
        </a>
      </div>

      </div>
    </div>

    <timeline v-if="!loading" :actions="actions" />
    <div
      v-else
    >
      <loading />
    </div>
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
    id(newId) {
      this.loadData(newId);
    },
  },
  computed: {
    last: function last() {
      if (this.actions.length === 0) {
        return null;
      }

      return this.actions[0];
    },
  },
  methods: {
    loadData: function loadData(id) {
      get(`/log/${id}`)
        .then((body) => {
          this.loading = false;
          this.actions = body.data;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
