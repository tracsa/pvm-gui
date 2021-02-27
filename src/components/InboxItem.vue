<template>
  <div>
    <div class="text-right">
      <router-link :to="{ path: path}" replace
      >
        <icon :icon="['fas', 'arrow-left']" class="mr-1"/>
        <span>Volver a bandeja</span>
      </router-link>
    </div>

    <app-execution-card
      class="mb-3"
      :execution="execution"
      :verbose="true"
      @click="handleStepClick"
    />

    <div class="timeline">
      <div v-if="execution.finished_at">
        <div class="timeline-action">
          <span class="timeline-dot"/>
          <div class="alert custom-alert-info">
            <span v-if="execution.status === 'finished'"
            >Flujo finalizado</span>
            <span v-else-if="execution.status === 'cancelled'"
            >Flujo cancelado</span>
            <br/>
            &bull;
            <small>{{ execution.finished_at|fmtDate }}</small>
          </div>
        </div>
      </div>

      <timeline-execution-delete
        v-if="cancellable && execution.status === 'ongoing'"
        :execution="execution"
      />

      <div v-if="task">
        <div
          class="timeline-action mb-4"
          :id="task.id"
        >
          <span class="timeline-dot"/>

          <timeline-task
            v-if="execution.status === 'ongoing'"
            :task="task"
            :pointer="taskPointer"
            :class="{
              'custom-card-border border-primary': task.id === highlightPId,
            }"
            @complete="handleComplete"
          />
        </div>
      </div>

      <div
        v-for="pointer in pointers"
        :key="pointer.id">

        <div
          class="timeline-action mb-4"
          v-if="canAssign && isAssignable(pointer)"
        >
          <timeline-user-assignment
            :node="pointer"
          />
        </div>

        <div
          :id="pointer.id"
          class="timeline-action mb-4"
        >
          <span class="timeline-dot"/>

          <timeline-pending
            :pointer="pointer"
            :class="{
              'custom-card-border border-primary': pointer.id === highlightPId,
            }"
            v-if="isOngoingPointer(pointer)  && !isDoablePointer(pointer)"
          />

          <timeline-patch
            :pointer="pointer"
            :state="item.execution.state"
            :class="{
              'custom-card-border border-primary': pointer.id === highlightPId,
            }"
            v-if="pointer.state === 'cancelled' && pointer.patch"
          />

          <timeline-action
            :pointer="pointer"
            :class="{
              'custom-card-border border-primary': pointer.id === highlightPId,
            }"
            v-else-if="pointer.state !== 'ongoing' && hasForms(pointer)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { getAuthUser } from '../utils/auth';

export default {
  props: ['item'],

  data() {
    return {
      user: getAuthUser(),
      sleep: 0,
      timeoutId: 0,

      summaryVisible: false,
    };
  },

  created() {
    this.reloadJob();
  },
  destroyed() {
    clearTimeout(this.timeoutId);
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
      const pointer = this.pointers.find(p => p.id === this.highlightPId);
      if (!pointer) { return null; }
      return pointer.node.id;
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
    taskPointer() {
      if (!this.pointers || !this.task) {
        return null;
      }

      return this.pointers.find(x => x.id === this.task.id);
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

    collapseId() {
      const vm = this;
      const modalId = `collapse-${vm.execution.id}`;

      return modalId;
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
          this.$router.push({
            name: 'inbox-item-pid',
            params: { id: this.execution.id, pid: pointer.id },
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
      return pointer.state === 'ongoing' && this.execution.status === 'ongoing';
    },

    isAssignable(pointer) {
      const vm = this;
      return ['action', 'validation'].includes(pointer.node.type) &&
        pointer.state === 'ongoing' &&
        vm.execution.status === 'ongoing';
    },

    hasForms(pointer) {
      return ['action', 'validation'].includes(pointer.node.type);
    },
  },

  filters: {
    fmtDate(val, fmt = 'llll') {
      return moment(val).format(fmt);
    },
  },
};
</script>
