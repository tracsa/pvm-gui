import Vue from 'vue';
import Router from 'vue-router';
import { getAuthUser, requireAuth, requireAnon } from '../utils/auth';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      beforeEnter: requireAuth,
      component: Vue.component('app'),
      children: [
        {
          name: 'dashboard',
          path: 'dashboard',
          component: Vue.component('app-inbox'),
          beforeEnter: (to, from, next) => {
            if (![
              'myPendingTasks',
              'myTasks',
              'allOngoingTasks',
              'allOngoingExecutions',
              'executionHistory',
              'taskHistory',
              'userTasks',
              'allTasks',
            ].includes(to.query.feed)) {
              next({
                name: 'dashboard',
                query: {
                  ...to.query,
                  feed: 'myPendingTasks',
                },
              });
            } else {
              next();
            }
          },
          props: (to) => {
            const feed = to.query.feed;

            if (feed === 'myPendingTasks') {
              const userId = getAuthUser().username;

              return {
                selectedExecution: to.query.e,
                searchText: to.query.q,
                searchData: {
                  feed,
                  label: 'Mis tareas pendientes',
                  description: 'Aquí podrás ver las tareas que faltan por realizar',
                  objType: 'pointer',
                  payload: {
                    executionStatus: ['ongoing'],
                    pointerStatus: ['ongoing'],
                    notifiedUsers: [userId],
                  },
                },
              };
            }

            if (feed === 'myTasks') {
              const userId = getAuthUser().username;

              return {
                selectedExecution: to.query.e,
                searchText: to.query.q,
                searchData: {
                  feed,
                  label: 'Tareas relacionadas conmigo',
                  description: 'Estas son todas las tareas que te asignaron o realizaste',
                  objType: 'pointer',
                  payload: {
                    actoredUsers: [userId],
                    notifiedUsers: [userId],
                  },
                },
              };
            }

            if (feed === 'allOngoingTasks') {
              return {
                selectedExecution: to.query.e,
                searchText: to.query.q,
                searchData: {
                  feed,
                  label: 'Todas las tareas pendientes',
                  description: 'Estás viendo todas las tareas en curso, de todos los usuarios',
                  objType: 'pointer',
                  payload: {
                    executionStatus: ['ongoing'],
                    pointerStatus: ['ongoing'],
                  },
                },
              };
            }

            if (feed === 'allOngoingExecutions') {
              return {
                selectedExecution: to.query.e,
                searchText: to.query.q,
                searchData: {
                  feed,
                  label: 'Todos los flujos de autorización en curso',
                  description: '¿Quieres ver todos los procesos en curso? Aquí estan',
                  objType: 'execution',
                  payload: {
                    executionStatus: ['ongoing'],
                  },
                },
              };
            }

            if (feed === 'executionHistory') {
              return {
                selectedExecution: to.query.e,
                searchText: to.query.q,
                searchData: {
                  feed,
                  label: 'Historal de flujos de autorización',
                  description: '¿Buscas un proceso finalizado o cancelado? Este es el lugar correcto',
                  objType: 'execution',
                  payload: {
                    executionStatus: ['finished', 'cancelled'],
                  },
                },
              };
            }

            if (feed === 'taskHistory') {
              return {
                selectedExecution: to.query.e,
                searchText: to.query.q,
                searchData: {
                  feed,
                  label: 'Historal de tareas',
                  description: '¿En busca de tareas finalizadas o canceladas? Llegaste al lugar indicado',
                  objType: 'pointer',
                  payload: {
                    pointerStatus: ['finished', 'cancelled'],
                    onlyUserAndPatch: true,
                  },
                },
              };
            }

            if (feed === 'userTasks') {
              const userId = to.query.u;

              return {
                selectedExecution: to.query.e,
                searchText: to.query.q,
                searchData: {
                  feed,
                  label: `Tareas de ${userId}`,
                  description: 'Todas las tareas de un usuario',
                  objType: 'pointer',
                  payload: {
                    actoredUsers: [userId],
                    notifiedUsers: [userId],
                  },
                },
              };
            }

            if (feed === 'allTasks') {
              return {
                selectedExecution: to.query.e,
                searchText: to.query.q,
                searchData: {
                  feed,
                  label: 'Tablero de tareas',
                  description: 'Estas viendo todas las tareas, sin filtros',
                  objType: 'pointer',
                  payload: { },
                },
              };
            }

            // unreachable
            return {};
          },
        },
        {
          name: 'inbox',
          path: 'inbox',
          redirect: () => (
            {
              name: 'dashboard',
              query: {
                feed: 'myPendingTasks',
              },
            }
          ),
        },
        {
          name: 'inbox-item',
          path: 'inbox/:id',
          redirect: to => (
            {
              name: 'dashboard',
              query: {
                e: to.params.id,
                feed: 'myPendingTasks',
              },
            }
          ),
        },
        {
          name: 'inbox-item-pid',
          path: 'inbox/:id/:pid',
          redirect: to => (
            {
              name: 'dashboard',
              query: {
                e: to.params.id,
                feed: 'allTasks',
                highlight: to.params.pid,
                q: to.params.pid,
              },
            }
          ),
        },
        {
          name: 'history',
          path: 'history',
          redirect: () => (
            {
              name: 'dashboard',
              query: {
                feed: 'executionHistory',
              },
            }
          ),
        },
        {
          name: 'processes',
          path: 'process',
          component: Vue.component('app-processes'),
        },
        {
          name: 'process',
          path: 'process/:id',
          component: Vue.component('app-processes'),
        },
        {
          name: 'task-redirect',
          path: 'task/:id',
          redirect: to => (
            {
              name: 'dashboard',
              query: {
                feed: 'allTasks',
                highlight: to.params.id,
                q: to.params.id,
              },
            }
          ),
        },
        {
          name: 'default',
          path: '',
          redirect: 'dashboard',
        },
      ],
    },
    {
      path: '/signin',
      beforeEnter: requireAnon,
      component: Vue.component('sign-in'),
    },
  ],
});
