<template>
  <div>
    <b-nav
      class="mb-2"
      vertical
      pills
    >
      <b-nav-item
        href="#"
        v-on:click.prevent="$emit('click-feed', item.value)"
        v-for="(item, index) in searchOptions"
        :key="index"
        :active="item.value === selectedSearch"
      >{{ item.label }}</b-nav-item>
    </b-nav>
  </div>
</template>

<script>
export default {
  props: ['selectedSearch'],

  data() {
    return {
      searchOptions: [
        {
          value: 'myPendingTasks',
          label: 'Mis tareas pendientes',
        },
        {
          value: 'myTasks',
          label: 'Tareas relacionadas conmigo',
        },
        {
          value: 'allOngoingTasks',
          label: 'Todas las tareas pendientes',
        },
        {
          value: 'allOngoingExecutions',
          label: 'Todos los flujos de autorización en curso',
        },
        {
          value: 'executionHistory',
          label: 'Historial de flujos de autorización',
        },
        {
          value: 'taskHistory',
          label: 'Historial de tareas',
        },
        {
          value: 'general',
          label: 'Tablero general',
        },
      ],
    };
  },
};
</script>
