<template>
  <div>
    <hero v-if="execution.loading"
      icon="spinner"
      title="commons.loading"
      spin
    />
    <div v-else-if="execution.error"
      class="text-center my-2"
    >
      <icon :icon="['fas', 'times']"/>
      <span class="ml-1">Error al cargar flujo de autorización</span>
    </div>

    <div
      v-else
    >
      <app-execution-card
        :execution="execution.data"
        :extended='true'
        :verbose='true'
      />

      <hr class="my-4"/>

      <div
        v-if="execution.data.status !== 'ongoing'"
      >
        <div class="card text-white shadow"
          :class="{
            'bg-success': execution.data.status === 'finished',
            'bg-danger': execution.data.status === 'cancelled',
          }"
        >
          <div class="card-body text-center py-2">
            <b>
              <span v-if="execution.data.status === 'cancelled'"
              >Flujo cancelado</span>
              <span v-else-if="execution.data.status === 'finished'"
              >Flujo finalizado</span>
            </b>
            <br/>
            <span>{{ execution.started_at|fmtDate('LLLL') }}</span>
          </div>
        </div>

        <div
          class="text-center py-2"
        >
          <icon :icon="['fas', 'arrow-alt-circle-up']"/>
        </div>
      </div>

      <hero v-if="pointers.loading"
        icon="spinner"
        title="commons.loading"
        spin
      />
      <div v-else-if="pointers.error"
        class="text-center my-2"
      >
        <icon :icon="['fas', 'times']"/>
        <span class="ml-1">Error al cargar linea de tiempo</span>
      </div>

      <div
        v-else
      >
        <div
          v-for="item in pointers.data" :key="item.id"
        >
          <component
            :is="item.state === 'ongoing' ? 'timeline-pending' : 'timeline-action'"
            :pointer='item'
            :verbose='true'
            :autoload='true'
            v-on:complete="fetchRecentPointers()"
          />

          <div
            class="text-center py-2"
          >
            <icon :icon="['fas', 'arrow-alt-circle-up']"/>
          </div>
        </div>

        <div class="card text-white bg-info shadow">
          <div class="card-body text-center py-2">
            <b>Flujo iniciado</b>
            <br/>
            <span>{{ execution.data.started_at|fmtDate('LLLL') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  props: {
    executionId: {
      required: true,
    },
  },

  filters: {
    fmtDate(val, fmt = 'llll') {
      return moment(val).format(fmt);
    },
  },

  data() {
    return {
      timeoutId: null,

      execution: {
        data: null,
        loading: false,
        error: false,
      },

      recentExecution: {
        loading: false,
        error: false,
      },

      pointers: {
        data: [],
        loading: false,
        error: false,
        totalCount: 0,
      },

      recentPointers: {
        loading: false,
        error: false,
      },
    };
  },

  created() {
    this.timeoutId = setInterval(this.fetchRecentPointers, 10000);
  },

  destroyed() {
    clearTimeout(this.timeoutId);
  },

  methods: {
    reloadExecution() {
      const vm = this;
      const executionId = vm.execution.data.id;

      vm.recentExecution.loading = true;
      vm.recentExecution.error = false;

      vm.$executionService.getExecution(executionId)
        .then((exeRes) => {
          vm.execution.data = exeRes.data.data;
          vm.recentExecution.loading = false;
        }).catch(() => {
          vm.recentExecution.loading = false;
          vm.recentExecution.error = true;
        });
    },

    fetchExecution(executionId) {
      const vm = this;

      vm.execution.loading = true;
      vm.execution.error = false;

      vm.$executionService.getExecution(executionId)
        .then((exeRes) => {
          vm.execution.data = exeRes.data.data;
          vm.execution.loading = false;

          vm.fetchPointers(executionId);
        }).catch(() => {
          vm.execution.loading = false;
          vm.execution.error = true;
        });
    },

    fetchPointers(executionId) {
      const vm = this;

      vm.pointers.loading = true;
      vm.pointers.error = false;

      vm.$pointerService.getPointers({
        executionIds: [executionId],
        onlyUserAndPatch: true,
        limit: 100,
      })
        .then((ptrRes) => {
          vm.pointers.loading = false;
          vm.pointers.data = ptrRes.data.pointers;
          vm.pointers.totalCount = ptrRes.data.total_count;
        })
        .catch(() => {
          vm.pointers.loading = false;
          vm.pointers.error = true;
        });
    },

    fetchRecentPointers() {
      const vm = this;
      const executionId = vm.execution.data.id;

      vm.recentPointers.loading = true;
      vm.recentPointers.error = false;

      let minDate = null;
      const found = vm.pointers.data.find(x => x.finished_at);
      if (found) {
        minDate = moment(found.started_at).toISOString();
      } else {
        minDate = moment(vm.execution.started_at).toISOString();
      }

      vm.$pointerService.getPointers({
        executionIds: [executionId],
        minDate,
      }).then((ptrRes) => {
        const current = {};
        vm.pointers.data.forEach(x => (
          Object.assign(current, { [x.id]: x.state })
        ));

        if (
          ptrRes.data.pointers.length &&
          !ptrRes.data.pointers
            .filter(x => (
              ['validation', 'action'].includes(x.node.type) || x.patch || x.state === 'ongoing'
            ))
            .every(x => current[x.id] === x.state)
        ) {
          vm.reloadExecution();
        }

        ptrRes.data.pointers
          .filter(x => current[x.id] !== x.state)
          .forEach((ptr) => {
            vm.pointers.data.push(ptr);
          });

        vm.pointers.data.sort(
          (a, b) => ((a.started_at > b.started_at || a.finished_at > b.finished_at) ? -1 : 1),
        );
        vm.pointers.data = vm.pointers.data
          .filter((obj, index) => (
            vm.pointers.data.map(p => p.id).indexOf(obj.id) === index
          ))
          .filter(x => (
            ['validation', 'action'].includes(x.node.type) || x.patch || x.state === 'ongoing'
          ));
      }).catch(() => {
        vm.recentPointers.loading = false;
        vm.recentPointers.error = true;
      });
    },
  },

  watch: {
    executionId: {
      handler(newVal) {
        const vm = this;
        vm.fetchExecution(newVal);
      },
      immediate: true,
    },
  },
};
</script>
