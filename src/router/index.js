import Vue from 'vue';
import Router from 'vue-router';
import { requireAuth, requireAnon } from '../utils/auth';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/admin/',
      beforeEnter: requireAuth,
      component: Vue.component('app'),
      children: [
        {
          name: 'all-tasks',
          path: 'tracking',
          component: Vue.component('all-tasks'),
        },
        {
          name: 'admin-tracking',
          path: 'tracking/:id',
          component: Vue.component('all-tasks'),
        },
        {
          name: 'admin-default',
          path: '',
          component: Vue.component('all-tasks'),
        },
      ],
    },
    {
      path: '/',
      beforeEnter: requireAuth,
      component: Vue.component('app'),
      children: [
        {
          name: 'inbox',
          path: 'inbox',
          component: Vue.component('inbox'),
        },
        {
          name: 'inbox-item',
          path: 'inbox/:id',
          component: Vue.component('inbox'),
        },
        {
          name: 'inbox-item-pid',
          path: 'inbox/:id/:pid',
          component: Vue.component('inbox'),
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
          name: 'task-redirect',
          path: 'task/:id',
          component: Vue.component('task-redirect'),
        },
        {
          name: 'default',
          path: '',
          component: Vue.component('inbox'),
        },
        {
          name: 'history',
          path: 'history',
          component: Vue.component('history'),
        },
        {
          name: 'history-item',
          path: 'history/:id',
          component: Vue.component('history'),
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
