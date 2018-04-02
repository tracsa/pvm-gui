<template>
  <div class="card task">
    <div class="card-body">
      <div
        class="task-close"
        @click="close">
        <icon :icon="['fas', 'times']" />
      </div>

      <h4>{{ name }}</h4>
      <div class="card-subtitle mb-2 text-muted">{{ description }}</div>
      <div
        v-for="form in form_array"
        :key="form.ref">
        <form>
          <div
            v-for="input in form.inputs"
            :key="input.name"
            class="form-group">
            <pre>{{ JSON.stringify(input, null, ' ') }}</pre>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      author: 'categulario',
      date: '2018-03-20',
      description: 'Este proceso es iniciado por un empleado que quiere salir temporalmente de la empresa (e.g. a comer). La autorizaci\u00f3n llega a su supervisor, quien autoriza o rechaza la salida, evento que es notificado de nuevo al empleado y finalmente a los guardias, uno de los cuales notifica que el empleado sali\u00f3 de la empresa.',
      form_array: [
        {
          inputs: [
            {
              name: 'reason',
              required: true,
              type: 'text',
            },
          ],
          ref: '#exit-form',
        },
      ],
      id: 'exit_request',
      name: 'Petici\u00f3n de salida',
      version: '2018-03-20',
      versions: [
        '2018-03-20',
      ],
    };
  },
  methods: {
    close: function close() {
      this.selected = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  border-radius: 3px 3px 0 0;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.15);
  border-color: #fff;
  flex: 1;
  overflow: hidden;
}

.task {
  position: relative;
}

.task-close {
  position: absolute;
  top: 0;
  right: 0;
  PADDING: 10Px;
  cursor: pointer;
}

</style>
