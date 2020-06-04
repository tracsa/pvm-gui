<template>
  <div>
    <base-layout style="max-width: 940px;">
      <template v-slot:left>
        <b-input-group
          class="mb-2"
        >
          <b-form-input
            v-model="searchText"
            placeholder="Buscar"
          ></b-form-input>
          <b-input-group-append>
            <b-button variant="primary"
              @click="resetData(); loadLastExecutions();"
            >
              <icon
                :icon="['fas', 'search']"
                aria-hidden="true"
              />
            </b-button>
          </b-input-group-append>
        </b-input-group>

        <b-nav
          class="mb-2"
          vertical
          pills
        >
          <b-nav-item
            v-for="item in listOptions"
            :key="item.value"
            :active="item.value == selectedList"
            :disabled="loading"
            @click="selectedList = item.value;"
          >{{ item.text }}</b-nav-item>
        </b-nav>

        <b-form-checkbox-group
          class="mb-2"
          v-model="selectedStatus"
          :options="statusOptions"
          switches
          stacked
        ></b-form-checkbox-group>
      </template>

      <template v-slot:right>
        <b-container
          class="p-0 justify-content-center"
        >
          <template
            v-if="executions.length"
          >
            <b-row
              no-gutters
              v-for="execution in executions"
              :key="execution.id"
            >
              <b-col>
                <ca-history-item
                  class="mb-3"
                  :execution="execution"
                />
              </b-col>
            </b-row>
          </template>

          <b-row
            no-gutters
            v-else
            class="mb-3"
          >
            <b-col class="text-center">
              <span>No hay resultados para mostrar</span>
            </b-col>
          </b-row>

          <b-row
            no-gutters
            class="mb-3"
          >
            <b-col
              cols="12"
            >
              <b-button
                v-if="!loading"
                variant="primary"
                class="w-100"
                @click="loadLastExecutions()"
              >Cargar más elementos</b-button>

              <div
                v-else
                class="text-center"
              >
                <div
                  class="spinner-border"
                  role="status"
                >
                  <span class="sr-only">Cargando...</span>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </template>
    </base-layout>
  </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import { getAuthUser } from '../utils/auth';
import UserService from '../services/user.service';

export default {
  data() {
    const user = getAuthUser();

    return {
      loading: true,
      executions: [],

      userId: user.username,

      searchText: '',

      firstDate: null,
      lastDate: null,

      minDate: null,
      maxDate: null,

      selectedStatus: ['cancelled', 'finished'],
      statusOptions: [
        {
          value: 'cancelled',
          text: 'Cancelado',
        },
        {
          value: 'finished',
          text: 'Finalizado',
        },
      ],

      selectedList: 'userActivity',
      listOptions: [
        {
          value: 'userActivity',
          text: 'Ver solo mi actividad',
        },
        {
          value: 'allHistory',
          text: 'Ver todo',
        },
      ],
    };
  },

  filters: {
    fmtDate(val, fmt = 'llll') {
      return moment(val).format(fmt);
    },
  },

  watch: {
    searchText() {
      const vm = this;

      vm.resetData();
      vm.loadLastExecutions();
    },

    selectedStatus() {
      const vm = this;

      vm.resetData();
      vm.loadLastExecutions();
    },

    selectedList: {
      immediate: true,
      handler() {
        const vm = this;

        vm.resetData();
        vm.loadLastExecutions();
      },
    },
  },

  methods: {
    resetData() {
      const vm = this;

      const now = moment();

      vm.executions = [];
      vm.firstDate = now.toISOString();
      vm.lastDate = now.toISOString();
    },

    loadRecentExecutions() {
      const vm = this;

      if (vm.selectedList === 'userActivity') {
        vm.loading = true;
        vm.fetchExecutions(
          vm.searchText,
          null,
          vm.firstDate,
          [vm.userId],
          vm.selectedStatus,
        );
      } else if (vm.selectedList === 'allHistory') {
        vm.loading = true;
        vm.fetchExecutions(
          vm.searchText,
          null,
          vm.firstDate,
          null,
          vm.selectedStatus,
        );
      }
    },

    loadLastExecutions() {
      const vm = this;

      if (vm.selectedList === 'userActivity') {
        vm.loading = true;
        vm.fetchExecutions(
          vm.searchText,
          vm.lastDate,
          null,
          [vm.userId],
          vm.selectedStatus,
        );
      } else if (vm.selectedList === 'allHistory') {
        vm.loading = true;
        vm.fetchExecutions(
          vm.searchText,
          vm.lastDate,
          null,
          null,
          vm.selectedStatus,
        );
      }
    },

    fetchExecutions: _.debounce(function fetchExecutions(
      searchText,
      maxDate,
      minDate,
      actorList,
      statusList,
    ) {
      const vm = this;

      UserService.getExecutions(
        searchText,
        maxDate,
        minDate,
        actorList,
        statusList,
      ).then((response) => {
        const executions = response.data.data;

        vm.executions.push(...executions);
        vm.executions = vm.executions.filter((obj, index) => {
          const id = obj.id;
          return vm.executions.map(item => item.id).indexOf(id) === index;
        });

        vm.executions.sort((a, b) => (a.started_at < b.started_at ? 1 : -1));

        if (vm.executions.length) {
          vm.firstDate = vm.executions[0].started_at;
          vm.lastDate = vm.executions[vm.executions.length - 1].started_at;
        }

        vm.loading = false;
      }).catch(() => {
        vm.loading = false;
      });
    }, 250),
  },
};
</script>
