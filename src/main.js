import Vue from 'vue';
import 'whatwg-fetch';
import App from './App';
import router from './router';
import './fontawesome';


Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
