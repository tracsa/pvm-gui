import Vue from 'vue';
import Datepicker from 'vuejs-datepicker';
import Header from './Header';
import Activity from './Activity';
import Timeline from '@/components/Timeline';
import Timepicker from './Timepicker';

Vue.component('app-header', Header);
Vue.component('activity', Activity);
Vue.component('timeline', Timeline);
Vue.component('datepicker', Datepicker);
Vue.component('timepicker', Timepicker);
