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

        <div class="row">
          <div class="col-12">
            <small
              class="text-muted"
              :title="execution.started_at|fmtDate('LLLL')"
            >Flujo iniciado el {{ execution.started_at|fmtDate('lll') }}</small>
          </div>
        </div>

        <div v-if="execution.status === 'ongoing'" class="row">
          <div class="col-12">
            <linear-steps
              :nodes="steps"
              :selected="highlightNId"
              @click="handleStepClick"
            />
          </div>
        </div>

        <div v-else class="row">
          <div class="col-12">
            <small
              class="text-muted"
              v-if="execution.status === 'finished'"
              :title="execution.finished_at|fmtDate('LLLL')"
            >Flujo finalizado el {{ execution.finished_at|fmtDate('lll') }}</small>
            <small
              class="text-muted"
              v-else-if="execution.status === 'cancelled'"
              :title="execution.finished_at|fmtDate('LLLL')"
            >Flujo cancelado el {{ execution.finished_at|fmtDate('lll') }}</small>
          </div>
        </div>
      </div>
    </div>

    <div class="timeline">
      <b-card no-body>
        <div class="p-3 font-weight-bold">
          <a
            v-b-toggle="collapseId"
            href="javascript:void(0)"
          >
            <span v-if="!summaryVisible">Mostrar resumen</span>
            <span v-else>Ocultar resumen</span>
          </a>
        </div>

        <b-collapse :id="collapseId" v-model="summaryVisible">
          <div v-html="summary"></div>
        </b-collapse>
      </b-card>
    </div>

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
        v-for="pointer in renderablePointers"
        :key="pointer.id">

        <div
          class="timeline-action mb-4"
          v-if="assignable && pointer.state === 'ongoing' && execution.status === 'ongoing'"
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

          <timeline-validation
            :pointer="pointer"
            :class="{
              'custom-card-border border-primary': pointer.id === highlightPId,
            }"
            v-else-if="pointer.state === 'finished' && pointer.node.type === 'validation'"
          />

          <timeline-action
            :pointer="pointer"
            :class="{
              'custom-card-border border-primary': pointer.id === highlightPId,
            }"
            v-else-if="pointer.state !== 'ongoing' && pointer.node.type === 'action'"
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
    assignable() {
      return this.user.role === 'admin';
    },

    highlightPId: function selectedId() {
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
    renderablePointers() {
      const vm = this;
      if (!vm.pointers) {
        return null;
      }

      return vm.pointers.filter(vm.isRenderablePointer);
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

    summary() {
      return this.item.summary;
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
          behavior:'smooth',
        });
      }
    },

    isRenderablePointer(pointer) {
      if (!['action', 'validation'].includes(pointer.node.type)) {
        return false;
      }

      return true;
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
  },
  filters: {
    fmtDate(val, fmt = 'llll') {
      return moment(val).format(fmt);
    },
  },
};
</script>
