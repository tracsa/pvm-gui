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
          <router-link
            class="font-weight-bold"
            :to="{
              name: 'inbox-item',
              params: {
                id: execution.id,
              },
            }"
            v-html="executionNameRender"
          >
          </router-link>
        </div>
      </div>

      <div class="row no-gutters">
        <div class="col text-right">
          <small
            class="text-muted"
            :title="execution.started_at|fmtDate('LLLL')"
          >
            <span>{{ execution.started_at|fmtDate('lll') }}</span>
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
        v-if="verbose && execution.status === 'ongoing'"
      >
        <hr/>
        <div class="row no-gutters">
          <div class="col">
            <linear-steps
              :nodes="steps"
              @click="$emit('click', $event)"
            />
          </div>
        </div>
      </span>

      <div class="row no-gutters mt-3">
        <div class="col">
          <b-collapse :id="collapseId" v-model="visible">
            <hero v-if="summary.loading"
              icon="spinner"
              title="commons.loading"
              spin
            />
            <div v-else-if="summary.error"
              class="text-center"
            >
              <icon :icon="['fas', 'times']"/>
              <span class="ml-1">Error al cargar resumen</span>
            </div>
            <div v-else
              v-html="summary.html"
            />
          </b-collapse>

          <div class="w-100 text-center">
            <a
              v-b-toggle="collapseId"
              href="#"
              v-on:click.prevent="showSummary()"
            >
              <span v-if="!visible">
                <icon :icon="['fas', 'caret-down']"/>
                Mostrar resumen</span>
              <span v-else>
                <icon :icon="['fas', 'caret-up']"/>
                Ocultar resumen</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import axios from 'axios';

const md = require('markdown-it')();

const API_PVM_URL = `${process.env.CACAHUATE_URL}`;

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
      visible: false,

      summary: {
        html: null,
        loading: false,
        error: false,
      },
    };
  },

  computed: {
    collapseId() {
      const vm = this;
      const modalId = `collapse-${vm.uuid}`;

      return modalId;
    },

    executionNameRender() {
      if (!this.execution.name) {
        return '';
      }

      return md.renderInline(this.execution.name);
    },

    steps() {
      if (!this.execution.state) {
        return [];
      }

      const state = this.execution.state;
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
    showSummary() {
      const vm = this;

      if (vm.summary.loading || vm.visible) { return; }
      vm.summary.loading = true;
      vm.summary.error = false;

      vm.fetchSummary(vm.execution.id)
        .then((response) => {
          vm.summary.loading = false;
          vm.summary.html = response.data;
        }).catch(() => {
          vm.summary.loading = false;
          vm.summary.error = true;
        });
    },

    fetchSummary(executionId) {
      return axios.get(
        `${API_PVM_URL}/v1/execution/${executionId}/summary`,
      );
    },
  },
};
</script>
