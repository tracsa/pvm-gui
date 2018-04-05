import Vue from 'vue';
import Header from './Header';
import Activity from './Activity';
import FormRender from './FormRender';


Vue.component('app-header', Header);
Vue.component('activity', Activity);
Vue.component('form-render', FormRender);


// form inputs
import TimeInput from './TimeInput';
import Datepicker from 'vuejs-datepicker';
import DatetimeInput from './DatetimeInput';

Vue.component('time-input', TimeInput);
Vue.component('date-input', Datepicker);
Vue.component('datetime-input', DatetimeInput);
