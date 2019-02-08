<template>
  <div>
    <div class="head-container">
      <div v-if="item !== null" class="text-primary">
        <div class="row">
          <div class="col-11">
            <b>{{ execution.name }}</b>
          </div>
          <div class="col-1 text-right">
            <router-link :to="{ path: '/inbox'}" replace>
              <icon :icon="['fas', 'times']" />
            </router-link>
          </div>
        </div>
      </div>
      <linear-steps :nodes="steps"/>
    </div>

    <div class="timeline">
      <timeline-task
        v-if="task"
        :task="task"
      />

      <div
        v-for="pointer in pointers"
        :key="pointer.id">
        <timeline-pending
          v-if="pointer.finished_at === null"
          :node="pointer"
        />

        <timeline-validation
        v-else-if="pointer.node.type === 'validation'"
        :validation="pointer"
        />

        <timeline-action
          v-else-if="pointer.node.type === 'action'"
          :action="pointer"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['item'],
  data() {
    return {
      sleep: 0,
      timeoutId: 0,
    };
  },
  mounted() {
    this.reloadJob();
  },
  computed: {
    execution() {
      if (!this.item) {
        return null;
      }

      return this.item.execution;
    },
    pointers() {
      if (!this.item) {
        return null;
      }

      return this.item.pointers;
    },
    task() {
      if (!this.item) {
        return null;
      }

      return this.item.task;
    },
    steps() {
      if (!this.execution) {
        return [];
      }

      const state = this.execution.state;
      return state.item_order.map(key => state.items[key]);
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
    loadData: function loadData() {
    },
  },
};
</script>
