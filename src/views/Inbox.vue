<template>
  <div
    class="container-fluid p-0"
    style="max-width: 1270px;"
  >
    <div class="row no-gutters"
      v-if="!showRight"
    >
      <div class="col">
        <slot name="top">
          <div class="px-3 py-2 text-center">
            <h3>{{ listOptions.find(x => x.value === selectedList).label }}</h3>
            <p>{{ listOptions.find(x => x.value === selectedList).description }}</p>
          </div>
          <hr/>

        </slot>
      </div>
    </div>

    <div class="row no-gutters">
      <div v-if="showLeft"
        :class="{
          'col-2': showRight,
          'col-3': !showRight,
        }"
      >
        <slot name="left">
          <b-nav
            class="mb-2"
            vertical
            pills
          >
            <b-nav-item
              v-for="(item, index) in listOptions"
              :key="index"
              :active="item.value === selectedList"
              @click="selectedList = item.value;"
            >{{ item.label }}</b-nav-item>
          </b-nav>
        </slot>
      </div>

      <div v-if="showCenter"
        :class="{
          'col-4': (showLeft && showRight) || (!showLeft && showRight),
          'col-9': showLeft && !showRight,
          'col-12': !showLeft && !showRight,
        }"
      >
        <slot name="center">
          <div class="container-fluid p-0">
            <div class="row no-gutters mb-3">
              <div class="col">
                <div class="p-1">
                  <label>Buscar en
                    "{{ listOptions.find(x => x.value === selectedList).label }}"
                  </label>
                  <input class="w-100"/>
                </div>
              </div>
            </div>

            <div class="row no-gutters mb-3"
              v-for="(item, index) in itemList.data"
              :key="index"
            >
              <div class="col">
                <component
                  :is="itemComponent(item)"
                  :execution='item'
                  :pointer='item'
                  :extended='true'
                  :verbose='true'
                />
              </div>
            </div>
          </div>
        </slot>
      </div>

      <div v-if="showRight"
        :class="{
          'col-6': showLeft && showCenter,
          'col-8': !showLeft && showCenter,
          'col-12': !showLeft && !showCenter,
        }"
      >
        <slot name="right">
          <div class="text-center">
            <h3>Flujo de autorizacion</h3>
            "{{ $mq }}"
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  data() {
    return {
      itemList: {
        data: [],
        loading: false,
        error: false,
        totalCount: 0,
      },

      selectedExecution: null,

      selectedList: 'myPendingTasks',
      listOptions: [
        {
          value: 'myPendingTasks',
          label: 'Mis tareas pendientes',
          description: 'Todas las tareas que tienes asignadas',
        },
        {
          value: 'myTasks',
          label: 'Tareas relacionadas conmigo',
        },
        {
          value: 'allOngoingTasks',
          label: 'Todas las tareas pendientes',
          description: 'Todas las tareas en curso, aún cuando no sean tuyas',
        },
        {
          value: 'allExecutionOngoing',
          label: 'Todos los flujos de autorización en curso',
          description: 'Todas los procesos en curso',
        },
        {
          value: 'executionHistory',
          label: 'Historal de flujos de autorización',
          description: '¿Buscas un flujo finalizado o cancelado? Este es el lugar',
        },
        {
          value: 'taskHistory',
          label: 'Historal de tareas',
          description: '¿Buscas una tareas finalizada o cancelada? Este es el lugar',
        },
      ],
    };
  },

  computed: {
    showLeft() {
      return (
        (this.showRight === false && (this.$mq === 'md' || this.$mq === 'lg')) ||
        (this.showRight === true && (this.$mq === 'lg'))
      );
    },

    showCenter() {
      return (
        this.showRight === false ||
        (this.showRight === true && (this.$mq === 'md' || this.$mq === 'lg'))
      );
    },

    showRight() {
      return !!this.selectedExecution;
    },
  },

  created() {
    const vm = this;
    vm.fetchExecutions();
  },

  methods: {
    fetchExecutions: _.debounce(function fetchExecutions() {
      const vm = this;

      vm.itemList.loading = true;

      vm.$executionService.getExecutions({
        executionStatus: ['ongoing'],
      })
        .then((response) => {
          vm.itemList.data = response.data.data;
          vm.itemList.totalCount = response.data.total_count;
        });
    }, 250),

    fetchPointers: _.debounce(function fetchPointers() {
      const vm = this;

      vm.itemList.loading = true;

      vm.$pointerService.getPointers({
        pointerStatus: ['ongoing'],
        onlyUserAndPatch: true,
      })
        .then((response) => {
          vm.itemList.data = response.data.pointers;
          vm.itemList.totalCount = response.data.total_count;
        });
    }, 250),

    itemComponent(obj) {
      // case execution
      const k = '_type';
      if (obj[k] === 'execution') {
        return 'app-execution-card';
      }
      // case pointer
      return obj.state === 'ongoing' ? 'timeline-pending' : 'timeline-action';
    },
  },
};
</script>
