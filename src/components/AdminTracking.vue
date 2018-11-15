<template>
  <div class="card">
    <div class="card-header">
      <div class="head-container">

        <div class="text-primary">
          <div class="row">
            <div class="col-11">
              <b>{{ execution.name }}</b>
            </div>
            <div class="col-1 text-right">
              <router-link :to="{ path: '/admin/tracking'}">
                <icon :icon="['fas', 'times']" />
              </router-link>
            </div>
          </div>
        </div>

        <linear-steps :nodes="nodes"/>
      </div>
    </div>

    <user-list
      v-if="!loading"
      :users="node.notified_users"
      class="card-body"/>
    <div v-else>
      <hero
        v-if="loading"
        icon="spinner"
        title="commons.loading"
        spin
      />
    </div>
  </div>
</template>

<script>
import { get } from '../utils/api';

export default {
  props: ['id', 'node'],
  data() {
    return {
      loading: false,
      actions: [],
      execution: [],
      nodes: [],
      sleep: 0,
      timeoutId: 0,
    };
  },
  mounted() {
    this.reloadJob();
  },
  watch: {
    id(newId) {
      this.sleep = 0;
      this.reloadJob();
      this.loadData(newId);
    },
  },
  methods: {
    reloadJob() {
      // In case of dead component
      if (!this || !this.loadData || !this.id) {
        return;
      }

      // Clear prev timeout
      clearTimeout(this.timeoutId);

      // Load data
      this.loadData(this.id);

      // Set new timeout with +1s delay
      this.sleep = this.sleep + 1000;
      this.timeoutId = setTimeout(this.reloadJob, this.sleep);
    },
    loadData: function loadData(id) {
      get(`/execution/${id}`).then((execution) => {
        const state = execution.data.state;
        const nodes = state.item_order.map(key => state.items[key]);

        this.execution = execution.data;
        this.nodes = nodes;
        this.loading = false;
      });
    },
  },
};
</script>
