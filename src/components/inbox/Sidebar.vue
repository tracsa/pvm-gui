<template>
  <div>
    <b-nav
      class="mb-2"
      vertical
      pills
    >
      <b-nav-item
        v-for="(item, index) in listOptions"
        :key="index"
        :active="item.value === selectedList"
        @click="selectedList = item.value; selectOption(item.value)"
      >{{ item.label }}</b-nav-item>
    </b-nav>
  </div>
</template>

<script>
import { getAuthUser } from '../../utils/auth';

export default {
  data() {
    return {
      selectedList: null,
      listOptions: [
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
          label: 'Historal de flujos de autorización',
        },
        {
          value: 'taskHistory',
          label: 'Historal de tareas',
        },
      ],
    };
  },

  methods: {
    selectOption(opt) {
      const vm = this;

      const searchParams = {};

      if (opt === 'myPendingTasks') {
        const user = getAuthUser();

        searchParams.objType = 'pointer';
        searchParams.payload = {
          executionStatus: ['ongoing'],
          pointerStatus: ['ongoing'],
          notifiedUsers: [user.username],
        };
      } else if (opt === 'myTasks') {
        const user = getAuthUser();

        searchParams.objType = 'pointer';
        searchParams.payload = {
          actoredUsers: [user.username],
          notifiedUsers: [user.username],
        };
      } else if (opt === 'allOngoingTasks') {
        searchParams.objType = 'pointer';
        searchParams.payload = {
          executionStatus: ['ongoing'],
          pointerStatus: ['ongoing'],
        };
      } else if (opt === 'allOngoingExecutions') {
        searchParams.objType = 'execution';
        searchParams.payload = {
          executionStatus: ['ongoing'],
        };
      } else if (opt === 'executionHistory') {
        searchParams.objType = 'execution';
        searchParams.payload = {
          executionStatus: ['finished', 'cancelled'],
        };
      } else if (opt === 'taskHistory') {
        searchParams.objType = 'pointer';
        searchParams.payload = {
          pointerStatus: ['finished', 'cancelled'],
          onlyUserAndPatch: true,
        };
      }

      vm.$emit(
        'select-search',
        searchParams,
      );
    },
  },
};
</script>
