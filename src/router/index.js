import Vue from 'vue';
import Router from 'vue-router';
import { requireAuth, requireAnon } from '../utils/auth';

import '../components';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      beforeEnter: requireAuth,
      component: Vue.component('app'),
      children: [
        {
          name: 'trackings',
          path: 'tracking',
          component: Vue.component('trackings'),
        },
        {
          name: 'tracking',
          path: 'tracking/:id',
          component: Vue.component('trackings'),
        },
        {
          name: 'tasks',
          path: 'task',
          component: Vue.component('tasks'),
        },
        {
          name: 'task',
          path: 'task/:id',
          component: Vue.component('tasks'),
        },
        {
          name: 'processes',
          path: 'process',
          component: Vue.component('processes'),
        },
        {
          name: 'process',
          path: 'process/:id',
          component: Vue.component('processes'),
        },
        {
          name: 'default',
          path: '',
          component: Vue.component('tasks'),
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
