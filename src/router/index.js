import Vue from 'vue';
import Router from 'vue-router';
import { requireAuth, requireAnon } from '../utils/auth';
import { Routes } from './routes.constants';

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
            if (!Routes.map(x => x.feed).includes(to.query.feed)) {
              next({
                name: 'dashboard',
                query: {
                  ...to.query,
                  feed: Routes[0].feed,
                },
              });
            } else {
              next();
            }
          },
          props: (to) => {
            const actualRoute = Routes.find(x => x.feed === to.query.feed);

            const actualProp = {
              executionId: to.query.e,
              query: to.query.q,
              fixedPayload: {},
            };

            [
              'feed',
              'title',
              'description',
            ].forEach((k) => {
              if (typeof actualRoute[k] === 'function') {
                actualProp[k] = actualRoute[k](to);
              } else {
                actualProp[k] = actualRoute[k];
              }
            });

            Object.keys(actualRoute.fixedPayload).forEach((k) => {
              if (typeof actualRoute.fixedPayload[k] === 'function') {
                actualProp.fixedPayload[k] = actualRoute.fixedPayload[k](to);
              } else {
                actualProp.fixedPayload[k] = actualRoute.fixedPayload[k];
              }
            });

            return actualProp;
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
