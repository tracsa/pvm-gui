import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Tasks from '@/components/Tasks';
import Header from '@/components/Header';

Vue.component('app-header', Header);

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
      path: '/tasks',
      name: 'Tasks',
      component: Tasks,
    },
  ],
});
