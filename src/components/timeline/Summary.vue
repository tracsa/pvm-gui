<template>
  <div class="container-fluid">
    <hr/>

    <div class="row no-gutters mt-3">
      <div class="col">
        <b-collapse :id="collapseId" v-model="visible">
          <hero v-if="summary.loading"
            icon="spinner"
            title="commons.loading"
            spin
          />
          <div v-else-if="summary.error"
            class="text-center my-2"
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
</template>

<script>
export default {
  props: {
    executionId: {
      type: String,
      required: true,
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
  },

  methods: {
    showSummary() {
      const vm = this;

      if (vm.summary.loading || vm.visible) { return; }
      vm.summary.loading = true;
      vm.summary.error = false;

      vm.$executionService.getExecutionSummary(vm.executionId)
        .then((smmry) => {
          vm.summary.loading = false;
          vm.summary.html = smmry;
        }).catch(() => {
          vm.summary.loading = false;
          vm.summary.error = true;
        });
    },
  },
};
</script>
