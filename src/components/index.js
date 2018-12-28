import Datepicker from 'vuejs-datepicker';
import Vue from 'vue';
import './timeline';

import App from './App';
import AdminTracking from './AdminTracking';
import AllTasks from './AllTasks';
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
import Trackings from './Trackings';
import Tracking from './Tracking';
import UserList from './UserList';
import ValueRender from './ValueRender';
import Hero from './Hero';
import Processes from './Processes';
import SignIn from './SignIn';
import LinkInput from './LinkInput';


// Components
Vue.component('app', App);
Vue.component('app-header', Header);
Vue.component('activity', Activity);
Vue.component('tasks', Tasks);
Vue.component('task', Task);
Vue.component('timeline', Timeline);
Vue.component('form-render', FormRender);
Vue.component('trackings', Trackings);
Vue.component('tracking', Tracking);
Vue.component('linear-steps', LinearSteps);
Vue.component('value-render', ValueRender);
Vue.component('hero', Hero);
Vue.component('processes', Processes);
Vue.component('sign-in', SignIn);

// Admin
Vue.component('admin-tracking', AdminTracking);
Vue.component('all-tasks', AllTasks);
Vue.component('user-list', UserList);

// From inputs
Vue.component('form-instance', FormInstance);
Vue.component('time-input', TimeInput);
Vue.component('date-input', Datepicker);
Vue.component('datetime-input', DatetimeInput);
Vue.component('link-input', LinkInput);

// Doqer components
Vue.component('doqer-input', DoqerSelect);
Vue.component('doqer-create', DoqerCreate);
Vue.component('doqer-suggest', DoqerSuggest);

// Data validator
Vue.component('data-validator', DataValidator);
