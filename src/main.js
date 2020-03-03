import Vue from 'vue';
import moment from 'moment';
import 'whatwg-fetch';
import App from './App';
import './components';
import router from './router';
import './fontawesome';
import './bootstrapvue';
import i18n from './i18n';

Vue.config.productionTip = false;

moment.locale(process.env.LOCALE);

// show env vars
/* eslint-disable no-console */
console.info('process.env', process.env);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App/>',
});
