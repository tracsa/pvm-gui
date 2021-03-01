<template>
  <div v-if="executionData">
    <div class="text-right">
      <router-link :to="{ path: path}" replace
      >
        <icon :icon="['fas', 'arrow-left']" class="mr-1"/>
        <span>Volver a bandeja</span>
      </router-link>
    </div>

    <app-execution-card
      class="mb-3"
      :execution="executionData"
      :verbose="true"
      @click="handleStepClick"
    />

    <div class="timeline">
      <div v-if="executionData.finished_at">
        <div class="timeline-action">
          <span class="timeline-dot"/>
          <div class="alert custom-alert-info">
            <span v-if="executionData.status === 'finished'"
            >Flujo finalizado</span>
            <span v-else-if="executionData.status === 'cancelled'"
            >Flujo cancelado</span>
            <br/>
            &bull;
            <small>{{ executionData.finished_at|fmtDate }}</small>
          </div>
        </div>
      </div>

      <div
        v-for="pointer in listPointers"
        :key="pointer.id">

        <div
          :id="pointer.id"
          class="timeline-action mb-4"
        >
          <span class="timeline-dot"/>

          <component
            :is="pointer.state === 'ongoing' ? 'timeline-pending' : 'timeline-action'"
            :pointer="pointer"
            :class="{
              'custom-card-border border-primary': pointer.id === highlightPId,
            }"
            @complete="handleComplete"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { getAuthUser } from '../utils/auth';

const API_PVM_URL = `${process.env.CACAHUATE_URL}`;

export default {
  props: ['item'],

  data() {
    return {
      user: getAuthUser(),
      sleep: 0,
      timeoutId: 0,

      execution: {
        data: null,
        loading: false,
        error: false,
      },

      pointers: {
        data: [],
        loading: false,
        error: false,
      },
    };
  },

  created() {
    this.reloadJob();
  },

  destroyed() {
    clearTimeout(this.timeoutId);
  },

  filters: {
    fmtDate(val, fmt = 'llll') {
      return moment(val).format(fmt);
    },
  },

  computed: {
    cancellable() {
      return this.user.role === 'admin';
    },
    canAssign() {
      return this.user.role === 'admin';
    },

    highlightPId() {
      const { pid } = this.$route.params;
      if (!pid) { return null; }
      return pid;
    },

    highlightNId() {
      const pointer = this.listPointers.find(p => p.id === this.highlightPId);
      if (!pointer) { return null; }
      return pointer.node.id;
    },

    executionData() {
      return this.execution.data;
    },

    task() {
      if (!this.item) {
        return null;
      }

      return this.item.task;
    },
    taskPointer() {
      if (!this.listPointers || !this.task) {
        return null;
      }

      return this.listPointers.find(x => x.id === this.task.id);
    },

    steps() {
      if (!this.executionData) {
        return [];
      }

      const state = this.executionData.state;
      return state.item_order.map(key => state.items[key]);
    },
    path() {
      if (this.$route.name === 'history-item') {
        return '/history';
      }
      return '/inbox';
    },

    collapseId() {
      const vm = this;
      const modalId = `collapse-${vm.executionData.id}`;

      return modalId;
    },

    listPointers() {
      return this.pointers.data;
    },
  },

  methods: {
    loadExecution() {
      const vm = this;

      vm.$executionService.getExecution(vm.item.execution.id)
        .then((response) => {
          vm.execution.loading = false;
          vm.execution.data = response.data.data;

          vm.loadPointers();
        }).catch(() => {
          vm.execution.loading = false;
          vm.execution.error = true;
        });
    },

    loadPointers() {
      const vm = this;
      vm.$pointerService.getPointers({
        executionIds: [vm.executionData.id],
      })
        .then((response) => {
          vm.pointers.loading = false;
          vm.pointers.data = response.data.pointers;
        }).catch(() => {
          vm.pointers.loading = false;
          vm.pointers.error = true;
        });
    },

    reloadJob() {
      // In case of dead component
      if (!this || !this.item) {
        return;
      }

      this.loadExecution();

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
      for (let i = this.listPointers.length - 1; i >= 0; i -= 1) {
        const pointer = this.listPointers[i];
        if (nodeId === pointer.node.id) {
          highlight = pointer.id;
          this.$router.push({
            name: 'inbox-item-pid',
            params: { id: this.executionData.id, pid: pointer.id },
          });
        }
      }

      // Scroll to element
      const el = document.getElementById(highlight);
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
        });
      }
    },

    isDoablePointer(pointer) {
      const vm = this;

      if (pointer.state !== 'ongoing') {
        return false;
      }

      if (pointer.notified_users
        .map(user => user.identifier).indexOf(vm.user.username) === -1) {
        return false;
      }

      return true;
    },

    isOngoingPointer(pointer) {
      return pointer.state === 'ongoing' && this.executionData.status === 'ongoing';
    },

    isAssignable(pointer) {
      const vm = this;
      return ['action', 'validation'].includes(pointer.node.type) &&
        pointer.state === 'ongoing' &&
        vm.executionData.status === 'ongoing';
    },

    hasForms(pointer) {
      if (pointer.patch) { return true; }

      return ['action', 'validation'].includes(pointer.node.type);
    },
  },
};
</script>
