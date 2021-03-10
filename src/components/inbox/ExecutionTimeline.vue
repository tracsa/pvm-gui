<template>
  <div>
    <app-execution-card
      :execution="execution.data"
      v-if="execution.data"
      :extended='true'
      :verbose='true'
    />

    <div v-for="item in pointers.data" :key="item.id">
      <component
        :is="itemComponent(item)"
        :pointer='item'
        :verbose='true'
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    executionId: {
      required: true,
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

    itemComponent(obj) {
      // case execution
      return obj.state === 'ongoing' ? 'timeline-pending' : 'timeline-action';
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
