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
        v-for="item in pointers.data" :key="item.id"
        v-else
      >
        <component
          :is="item.state === 'ongoing' ? 'timeline-pending' : 'timeline-action'"
          :pointer='item'
          :verbose='true'
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
      execution: {
        data: null,
        loading: false,
        error: false,
      },
      pointers: {
        data: [],
        loading: false,
        error: false,
        totalCount: 0,
      },
    };
  },

  methods: {
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
          vm.pointers.error = false;
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
