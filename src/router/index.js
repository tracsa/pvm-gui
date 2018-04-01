import Vue from 'vue';
import Router from 'vue-router';
import Tasks from '@/components/Tasks';
import Task from '@/components/Task';
import App from '@/components/App';
import Processes from '@/components/Processes';
import SignIn from '@/components/SignIn';
import { requireAuth, requireAnon } from '@/utils/auth';
import '@/components';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      beforeEnter: requireAuth,
      component: App,
      children: [
        { path: 'tasks', component: Tasks },
        { path: 'process', component: Processes },
        {
          name: 'process',
          path: 'process/:id',
          component: Processes,
        },
        { path: 'task', component: Task },
      ],
    },
    {
      path: '/signin',
      beforeEnter: requireAnon,
      component: SignIn,
    },
  ],
});
