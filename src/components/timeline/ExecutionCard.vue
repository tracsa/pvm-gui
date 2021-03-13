<template>
  <div
    class="card no-body py-3 shadow"
  >
    <div class="container-fluid">
      <div class="d-flex justify-content-between">
        <small class="text-muted">Flujo de autorización</small>
        <small class="text-muted">{{ execution.id }}</small>
      </div>

      <div class="row no-gutters">
        <div
          class="col text-justify"
          :class="{ 'text-truncate': extended }"
        >
          <a
            href="#"
            v-on:click.prevent="$emit('click-execution', execution.id)"
          >
            <b><app-md-render :raw-string="executionName"/></b>
          </a>
        </div>
      </div>

      <div class="row no-gutters">
        <div class="col text-right">
          <small
            class="text-muted"
            :title="execution.started_at|fmtDate('LLLL')"
          >
            <span
              v-if="verbose"
            >Iniciado el {{ execution.started_at|fmtDate('LLLL') }}</span>
            <span
              v-else
            >{{ execution.started_at|fmtDate('lll') }}</span>
          </small>
        </div>
      </div>

      <div class="row no-gutters">
        <div class="col text-right">
          <small
            class="text-muted"
            :title="execution.finished_at|fmtDate('LLLL')"
            v-if="execution.finished_at"
          >
            <span
              v-if="verbose"
            >
              <span v-if="execution.status === 'finished'"
              >Finalizado el {{ execution.finished_at|fmtDate('LLLL') }}</span>
              <span v-else-if="execution.status === 'cancelled'"
              >Cancelado el {{ execution.finished_at|fmtDate('LLLL') }}</span>
            </span>
            <span
              v-else
            >{{ execution.finished_at|fmtDate('lll') }}</span>
          </small>

          <span
            v-else
          >
            <span class="badge badge-warning">En curso</span>
          </span>
        </div>
      </div>

      <div class="row no-gutters">
        <div class="col">
          <app-users-popover
            v-if="actors.length"
            :target="actorsPopoverId"
            :title="'Usuarios que realizaron tareas'"
            :users="actors"
          />

          <a
            v-if="actors.length"
            href="#"
            @click.prevent
            :id="actorsPopoverId"
          >
            <icon :icon="['fas', 'user-tie']" class="mr-1"/>

            <small>
              <b>Realizado por {{ actors.length }}</b>
            </small>
          </a>
        </div>
      </div>

      <span
        v-if="verbose"
      >
        <div class="row no-gutters mt-3">
          <div class="col">
            <hero v-if="state.loading"
              icon="spinner"
              title="commons.loading"
              spin
            />
            <div v-else-if="state.error"
              class="text-center my-2"
            >
              <icon :icon="['fas', 'times']"/>
              <span class="ml-1">Error al cargar linea de tiempo</span>
            </div>

            <div class="w-100 text-center"
              v-else-if="!stateData"
            >
              <a href="#"
                v-on:click.prevent="loadState()"
              >
                <icon :icon="['fa', 'ellipsis-h']"/>
                <span class="ml-1">Cargar linea de tiempo</span>
              </a>
            </div>

            <linear-steps
              v-else
              :nodes="steps"
              @click="$emit('click', $event)"
            />
          </div>
        </div>
      </span>

      <div class="row no-gutters">
        <timeline-summary
          :execution-id="execution.id"
        />

        <div class="col">
          <slot name="content"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  props: {
    execution: {
      type: Object,
      required: true,
    },

    extended: {
      type: Boolean,
      default: false,
    },

    verbose: {
      type: Boolean,
      default: false,
    },
  },

  filters: {
    fmtDate(val, fmt = 'llll') {
      return moment(val).format(fmt);
    },
  },

  data() {
    return {
      uuid: Math.random(),

      state: {
        data: null,
        loading: false,
        error: false,
      },
    };
  },

  computed: {
    executionName() {
      if (!this.execution.name) {
        return '';
      }

      return this.execution.name;
    },

    stateData() {
      if (this.execution.state) { return this.execution.state; }
      return this.state.data;
    },

    steps() {
      if (!this.stateData) {
        return [];
      }

      const state = this.stateData;
      return state.item_order.map(key => state.items[key]);
    },

    actors() {
      if (!this.execution.actor_list) {
        return null;
      }

      const rawList = this.execution.actor_list.map(item => item.actor);
      return rawList
        .filter((obj, index) => {
          const id = obj.identifier;
          return rawList.map(item => item.identifier).indexOf(id) === index;
        });
    },

    actorsPopoverId() {
      const vm = this;
      const modalId = `actors-popover-${vm.uuid}`;

      return modalId;
    },
  },

  methods: {
    loadState() {
      const vm = this;

      if (vm.state.loading) { return; }
      vm.state.loading = true;
      vm.state.error = false;

      vm.fetchExecution(this.execution.id)
        .then((response) => {
          vm.state.loading = false;
          vm.state.data = response.data.data.state;
        }).catch(() => {
          vm.state.loading = false;
          vm.state.error = true;
        });
    },

    fetchExecution(executionId) {
      return this.$executionService.getExecution(executionId);
    },
  },
};
</script>
