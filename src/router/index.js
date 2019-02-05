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
