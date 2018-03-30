import Vue from 'vue';
import Router from 'vue-router';
import Tasks from '@/components/Tasks';
import App from '@/components/App';
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
      ],
    },
    {
      path: '/signin',
      beforeEnter: requireAnon,
      component: SignIn,
    },
  ],
});
