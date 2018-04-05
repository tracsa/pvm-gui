import Vue from 'vue';
import Datepicker from 'vuejs-datepicker';
import Header from './Header';
import Activity from './Activity';
import Timepicker from './Timepicker';
import FormRender from './FormRender';


Vue.component('app-header', Header);
Vue.component('activity', Activity);
Vue.component('datepicker', Datepicker);
Vue.component('timepicker', Timepicker);
Vue.component('form-render', FormRender);
