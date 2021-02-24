<template>
  <div>
    <base-layout style="max-width: 940px;">
      <template v-slot:left>
        <b-nav
          class="mb-2"
          vertical
          pills
        >
          <b-nav-item
            v-for="item in listOptions"
            :key="item.value"
            :active="item.value === selectedList"
            :disabled="loading"
            @click="selectedList = item.value;"
          >{{ item.text }}</b-nav-item>
        </b-nav>
      </template>

      <template v-slot:section-dropdown>
        <b-container
          class="p-0 justify-content-center w-100"
        >
          <b-row
            no-gutters
          >
            <b-col>
              <b-form-select
                class="mb-3"
                v-model="selectedList"
                :options="listOptions"
              ></b-form-select>
            </b-col>
          </b-row>
        </b-container>
      </template>

      <template v-slot:right>
        <b-container
          class="p-0 justify-content-center w-100"
        >
          <b-row
            no-gutters
            class="mb-3"
          >
            <b-col>
              <b-card class="py-3">
                <b-form
                  class="w-100"
                  @submit.stop.prevent="submitForm();"
                >
                  <b-form-group>
                    <b-form-input
                      v-model="form.searchText"
                      placeholder="Título o Id"
                      type="search"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group
                    label="Ordenar por:"
                  >
                    <b-form-radio-group
                      v-model="form.selectedOrder"
                      :options="orderOptions"
                    />
                  </b-form-group>

                  <b-collapse id="advanced-search-block" v-model="advancedSearch">
                    <b-form-row>
                      <b-form-group
                        class="col-6"
                        label="Desde:"
                      >
                        <b-form-input
                          v-model="form.minDate"
                          type="date"
                        ></b-form-input>
                      </b-form-group>

                      <b-form-group
                        class="col-6"
                        label="Hasta:"
                      >
                        <b-form-input
                          v-model="form.maxDate"
                          type="date"
                        ></b-form-input>
                      </b-form-group>
                    </b-form-row>

                    <b-form-group
                      label="Estado del flujo:"
                    >
                      <b-form-checkbox-group
                        v-model="form.selectedStatus"
                        :options="statusOptions"
                        switches
                      ></b-form-checkbox-group>
                    </b-form-group>
                  </b-collapse>

                  <b-form-group>
                    <a
                      href="javascript:void(0);"
                      @click="advancedSearch = !advancedSearch; resetForm();"
                    >
                      <span v-if="!advancedSearch">Busqueda avanzada</span>
                      <span v-else>Busqueda básica</span>
                    </a>
                  </b-form-group>

                    <b-button
                      type="submit"
                      variant="secondary"
                    >
                      <span>
                        <icon :icon="['fa', 'search']"/>
                        Buscar
                      </span>
                    </b-button>
                </b-form>
              </b-card>
            </b-col>
          </b-row>

          <template
            v-if="executions.length"
          >
            <b-row
              no-gutters
              v-for="execution in executions"
              :key="execution.id"
            >
              <b-col>
                <app-execution-card
                  class="mb-3"
                  :execution="execution"
                  :verbose="true"
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
                variant="secondary"
                class="w-100"
                @click="loadLastExecutions()"
              >
                <span>
                  <icon :icon="['fa', 'plus']"/>
                  Cargar más elementos
                </span>
              </b-button>

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

export default {
  data() {
    const user = getAuthUser();

    return {
      form: {
        searchText: '',
        selectedOrder: 'started_at',
        minDate: '',
        maxDate: '',
        selectedStatus: ['cancelled', 'finished'],
      },

      loading: true,
      executions: [],

      advancedSearch: false,

      userId: user.username,

      searchText: '',

      firstDate: null,
      lastDate: null,

      orderOptions: [
        {
          value: 'started_at',
          text: 'Fecha de inicio',
        },
        {
          value: 'finished_at',
          text: 'Fecha de termino',
        },
      ],

      statusOptions: [
        {
          value: 'cancelled',
          text: 'Cancelado',
        },
        {
          value: 'finished',
          text: 'Finalizado',
        },
        {
          value: 'ongoing',
          text: 'En curso',
        },
      ],

      selectedList: 'myActivity',
      listOptions: [
        {
          value: 'myActivity',
          text: 'Mi actividad',
        },
        {
          value: 'allExecutions',
          text: 'Todos los procesos',
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
    selectedList: {
      immediate: true,
      handler() {
        const vm = this;

        vm.resetData();
        vm.loadLastExecutions();
      },
    },
  },

  computed: {
    minDateISO() {
      const vm = this;
      if (vm.form.minDate) {
        return moment(vm.form.minDate).toISOString();
      }

      return '';
    },

    maxDateISO() {
      const vm = this;
      if (vm.form.maxDate) {
        return moment(vm.form.maxDate).add(1, 'days').toISOString();
      }

      return '';
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

    resetForm() {
      const vm = this;

      vm.form.minDate = '';
      vm.form.maxDate = '';
      vm.form.selectedStatus = ['cancelled', 'finished'];
    },

    submitForm() {
      const vm = this;

      vm.resetData();
      vm.loadLastExecutions();
    },

    loadLastExecutions() {
      const vm = this;

      let vDate = vm.lastDate;
      if (vm.maxDateISO && vm.maxDateISO.localeCompare(vDate) === -1) {
        vDate = vm.maxDateISO;
      }

      if (vm.selectedList === 'myActivity') {
        vm.loading = true;
        vm.fetchExecutions(
          vDate,
          vm.minDateISO,
          [vm.userId],
        );
      } else if (vm.selectedList === 'allExecutions') {
        vm.loading = true;
        vm.fetchExecutions(
          vDate,
          vm.minDateISO,
          null,
        );
      }
    },

    fetchExecutions: _.debounce(function fetchExecutions(
      maxDate,
      minDate,
      actorList,
    ) {
      const vm = this;

      vm.$api.getExecutionsByDate(
        vm.form.searchText,
        vm.form.selectedOrder,
        maxDate,
        minDate,
        actorList,
        vm.form.selectedStatus,
        'DESCENDING',
      ).then((response) => {
        const executions = response.data.data;

        vm.executions.push(...executions);
        vm.executions = vm.executions.filter((obj, index) => {
          const id = obj.id;
          return vm.executions.map(item => item.id).indexOf(id) === index;
        });

        const dateKey = vm.form.selectedOrder;
        vm.executions.sort((a, b) => (a[dateKey] < b[dateKey] ? 1 : -1));

        if (vm.executions.length) {
          const fDate = vm.executions[0][dateKey];
          if (fDate) {
            vm.firstDate = fDate;
          }

          const lDate = vm.executions[vm.executions.length - 1][dateKey];
          if (lDate) {
            vm.lastDate = lDate;
          }
        }

        vm.loading = false;
      }).catch(() => {
        vm.loading = false;
      });
    }, 250),
  },
};
</script>
