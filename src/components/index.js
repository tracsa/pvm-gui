import Datepicker from 'vuejs-datepicker';
import Vue from 'vue';

import './timeline';
import Activity from './Activity';
import DataValidator from './DataValidator';
import DatetimeInput from './DatetimeInput';
import DoqerCreate from './doqer/Create';
import DoqerSelect from './doqer/Select';
import DoqerSuggest from './doqer/Suggest';
import FormInstance from './FormInstance';
import FormRender from './FormRender';
import Header from './Header';
import LinearSteps from './LinearSteps';
import Task from './Task';
import Tasks from './Tasks';
import TimeInput from './TimeInput';
import Timeline from './Timeline';
import Tracking from './Tracking';
import ValueRender from './ValueRender';
import Hero from './Hero';


// Components
Vue.component('app-header', Header);
Vue.component('activity', Activity);
Vue.component('tasks', Tasks);
Vue.component('task', Task);
Vue.component('timeline', Timeline);
Vue.component('form-render', FormRender);
Vue.component('tracking', Tracking);
Vue.component('linear-steps', LinearSteps);
Vue.component('value-render', ValueRender);
Vue.component('hero', Hero);

// From inputs
Vue.component('form-instance', FormInstance);
Vue.component('time-input', TimeInput);
Vue.component('date-input', Datepicker);
Vue.component('datetime-input', DatetimeInput);

// Doqer components
Vue.component('doqer-input', DoqerSelect);
Vue.component('doqer-create', DoqerCreate);
Vue.component('doqer-suggest', DoqerSuggest);

// Data validator
Vue.component('data-validator', DataValidator);
