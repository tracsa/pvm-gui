<template>
  <div>
    <linear-steps :actualStep="actualStep" :steps="this.nodes"/>
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
      actualStep: 0,
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
    getSteps: function getSteps(steps) {
      console.log("sdfd");
      let actualStep = null;
      steps.forEach((step, index) => {
        if (actualStep === null && step.active !== 1) {
          actualStep = index;
        }
      });
      this.actualStep = actualStep;
    },
    loadData: function loadData(id) {
      get(`/execution/${id}`).then((nodes) => {
        const items = nodes.data.state.items;
        let order = nodes.data.state.item_order;
        let active;
        let state;
        order = order.map((key) => {
          state = ['unfilled', 'filled', 'invalid'];
          active = state.indexOf(items[key].state);
          return {
            desc: items[key].id,
            active,
          };
        });
        this.nodes = order;
        this.getSteps(order);
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
