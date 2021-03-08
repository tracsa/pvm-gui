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
          description: 'Aquí podrás ver las tareas que faltan por realizar',
        },
        {
          value: 'myTasks',
          label: 'Tareas relacionadas conmigo',
          description: 'Estas son todas las tareas que te asignaron o realizaste',
        },
        {
          value: 'allOngoingTasks',
          label: 'Todas las tareas pendientes',
          description: 'Estás viendo todas las tareas en curso, de todos los usuarios',
        },
        {
          value: 'allOngoingExecutions',
          label: 'Todos los flujos de autorización en curso',
          description: '¿Quieres ver todos los procesos en curso? Aquí estan',
        },
        {
          value: 'executionHistory',
          label: 'Historal de flujos de autorización',
          description: '¿Buscas un proceso finalizado o cancelado? Este es el lugar correcto',
        },
        {
          value: 'taskHistory',
          label: 'Historal de tareas',
          description: '¿En busca de tareas finalizadas o canceladas? Llegaste al lugar indicado',
        },
      ],
    };
  },

  methods: {
    selectOption(opt) {
      const vm = this;

      const searchParams = {
        ...this.listOptions.find(x => x.value === opt),
      };

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
