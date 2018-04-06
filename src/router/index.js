import Vue from 'vue';
import Router from 'vue-router';
import { requireAuth, requireAnon } from '@/utils/auth';
import App from '@/components/App';

import Activities from '@/components/Activities';
import Processes from '@/components/Processes';
import Timeline from '@/components/Timeline';
import Tasks from '@/components/Tasks'

import SignIn from '@/components/SignIn';
import '@/components';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      beforeEnter: requireAuth,
      component: App,
      children: [
        {
          name: 'activities',
          path: 'activity',
          component: Activities,
        },
        {
          name: 'activity',
          path: 'activity/:id',
          component: Activities,
        },
        {
          name: 'timeline',
          path: 'timeline/:id',
          component: Activities,
        },
        {
          name: 'Tasks',
          path: 'tasks',
          component: Tasks,
        },
        {
          name: 'processes',
          path: '',
          component: Processes,
        },
        {
          name: 'process',
          path: 'process/:id',
          component: Processes,
        },
      ],
    },
    {
      path: '/signin',
      beforeEnter: requireAnon,
      component: SignIn,
    },
  ],
});
