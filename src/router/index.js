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
              'general',
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
                title: 'Mis tareas pendientes',
                description: 'Aquí podrás ver las tareas que te faltan por realizar',
                feed,
                executionId: to.query.e,
                query: to.query.q,
                fixedPayload: {
                  objType: 'pointer',
                  executionStatus: ['ongoing'],
                  pointerStatus: ['ongoing'],
                  notifiedUsers: [userId],
                },
              };
            }

            if (feed === 'myTasks') {
              const userId = getAuthUser().username;

              return {
                title: 'Tareas relacionadas conmigo',
                description: 'Estas son todas las tareas que te asignaron o realizaste',
                feed,
                executionId: to.query.e,
                query: to.query.q,
                fixedPayload: {
                  objType: 'pointer',
                  actoredUsers: [userId],
                  notifiedUsers: [userId],
                  pointerStatus: null,
                  executionStatus: null,
                },
              };
            }

            if (feed === 'allOngoingTasks') {
              return {
                title: 'Todas las tareas pendientes',
                description: 'Estás viendo todas las tareas en curso, de todos los usuarios',
                feed,
                executionId: to.query.e,
                query: to.query.q,
                fixedPayload: {
                  objType: 'pointer',
                  executionStatus: ['ongoing'],
                  pointerStatus: ['ongoing'],
                },
              };
            }

            if (feed === 'allOngoingExecutions') {
              return {
                title: 'Todos los flujos de autorización en curso',
                description: '¿Quieres ver todos los procesos en curso? Aquí estan',
                feed,
                executionId: to.query.e,
                query: to.query.q,
                fixedPayload: {
                  objType: 'execution',
                  executionStatus: ['ongoing'],
                },
              };
            }

            if (feed === 'executionHistory') {
              return {
                title: 'Historal de flujos de autorización',
                description: '¿Buscas un proceso finalizado o cancelado? Este es el lugar correcto',
                feed,
                executionId: to.query.e,
                query: to.query.q,
                fixedPayload: {
                  objType: 'execution',
                  executionStatus: ['finished', 'cancelled'],
                },
              };
            }

            if (feed === 'taskHistory') {
              return {
                title: 'Historal de tareas',
                description: '¿En busca de tareas finalizadas o canceladas? Llegaste al lugar indicado',
                feed,
                executionId: to.query.e,
                query: to.query.q,
                fixedPayload: {
                  objType: 'pointer',
                  pointerStatus: ['finished', 'cancelled'],
                  onlyUserAndPatch: true,
                },
              };
            }

            if (feed === 'userTasks') {
              const userId = to.query.u;

              return {
                title: `Tareas de ${userId}`,
                description: 'Todas las tareas de un usuario',
                feed,
                executionId: to.query.e,
                query: to.query.q,
                fixedPayload: {
                  objType: 'pointer',
                  actoredUsers: [userId],
                  notifiedUsers: [userId],
                },
              };
            }

            if (feed === 'general') {
              return {
                title: 'Tablero general',
                description: 'Aquí tienes todos los filtros para buscar',
                feed,
                executionId: to.query.e,
                query: to.query.q,
                fixedPayload: { },
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
                feed: 'myPendingTasks',
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
