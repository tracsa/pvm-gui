<template>
  <div>
    <div class="head-container">
      <div v-if="last !== null" class="text-primary">
        <div class="row">
          <div class="col-11">
            <b>{{ last.execution.name }}</b>
          </div>
          <div class="col-1 text-right">
            <router-link :to="{ path: '/tracking'}">
              <icon :icon="['fas', 'times']" />
            </router-link>
          </div>
        </div>
      </div>
      <linear-steps :nodes="nodes"/>
    </div>
    <timeline v-if="!loading" :actions="actions" />
    <div v-else>
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
      nodes: [],
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
      get(`/execution/${id}`).then((execution) => {
        const state = execution.data.state;
        const nodes = state.item_order.map(key => state.items[key]);

        this.nodes = nodes;
      });

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
<style lang="scss" scoped>
@import '../styles/variables.scss';

$head-container-title-color: $gray-700 !important;

  .head-container {
    background: white;
    border: 3px solid #c7b5e7;
    padding: 0 20px;
    .text-primary {
      padding: 20px 20px;
      color: $black-light !important;
    }
  }
</style>
