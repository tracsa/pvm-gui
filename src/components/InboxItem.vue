<template>
  <div>
    <div class="head-container">
      <div v-if="item !== null" class="text-primary">
        <div class="row">
          <div class="col-11">
            <b>{{ execution.name }}</b>
          </div>
          <div class="col-1 text-right">
            <router-link :to="{ path: path}" replace>
              <icon :icon="['fas', 'times']" />
            </router-link>
          </div>
        </div>
      </div>
      <linear-steps :nodes="steps" @click="handleStepClick"/>
    </div>

    <div class="timeline">
      <timeline-task
        v-if="task"
        :task="task"
        @complete="handleComplete"
        :highlight="task.id === highlightId"
      />

      <div
        v-for="pointer in pointers"
        :key="pointer.id">
        <timeline-patch
          v-if="pointer.state === 'cancelled' && pointer.patch"
          :patch="pointer.patch"
        />

        <timeline-pending
          v-else-if="pointer.state === 'ongoing'"
          :node="pointer"
          :highlight="pointer.id === highlightId"
        />

        <timeline-validation
          v-else-if="pointer.state === 'finished' && pointer.node.type === 'validation'"
          :validation="pointer"
          :highlight="pointer.id === highlightId"
        />

        <timeline-action
          v-else-if="pointer.state === 'finished' && pointer.node.type === 'action'"
          :action="pointer"
          :highlight="pointer.id === highlightId"
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
  created() {
    this.reloadJob();
  },
  destroyed() {
    clearTimeout(this.timeoutId);
  },
  computed: {
    highlightId: function selectedId() {
      const { pid } = this.$route.params;
      if (!pid) {
        return null;
      }

      return pid;
    },
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
    path() {
      if (this.$route.name === 'history-item') {
        return '/history';
      }
      return '/inbox';
    },
  },
  methods: {
    reloadJob() {
      // In case of dead component
      if (!this || !this.item) {
        return;
      }

      // Clear prev timeout
      clearTimeout(this.timeoutId);

      // Load data
      this.$emit('refresh');

      // Set new timeout with +1s delay
      this.sleep = this.sleep + 1000;
      this.timeoutId = setTimeout(this.reloadJob, this.sleep);
    },
    handleComplete() {
      this.sleep = 0;
      this.reloadJob();
    },
    handleStepClick(nodeId) {
      let highlight;
      for (let i = this.pointers.length - 1; i >= 0; i -= 1) {
        const pointer = this.pointers[i];
        if (nodeId === pointer.node.id) {
          highlight = pointer.id;
        }
      }

      // Scroll to element
      const el = document.getElementById(highlight);
      window.scrollBy(0, el.offsetTop + 110);
    },
  },
};
</script>
