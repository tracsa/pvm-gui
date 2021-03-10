import Datepicker from 'vuejs-datepicker';
import Vue from 'vue';
import './timeline';

import App from './App';
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
import TimeInput from './TimeInput';
import ValueRender from './ValueRender';
import Hero from './Hero';
import Processes from './Processes';
import SignIn from './SignIn';
import LinkInput from './LinkInput';

import BaseLayout from './BaseLayout';

import ExecutionCard from './ExecutionCard';

import UsersPopover from './misc/UsersPopover';
import MdRender from './misc/MdRender';
import InboxSidebar from './inbox/Sidebar';
import InboxExecutionTimeline from './inbox/ExecutionTimeline';

Vue.component('app-users-popover', UsersPopover);
Vue.component('app-md-render', MdRender);
Vue.component('app-inbox-sidebar', InboxSidebar);
Vue.component('app-inbox-execution-timeline', InboxExecutionTimeline);

Vue.component('app-execution-card', ExecutionCard);

// Components
Vue.component('app', App);
Vue.component('app-header', Header);
Vue.component('activity', Activity);
Vue.component('form-render', FormRender);
Vue.component('linear-steps', LinearSteps);
Vue.component('value-render', ValueRender);
Vue.component('hero', Hero);
Vue.component('processes', Processes);
Vue.component('sign-in', SignIn);

Vue.component('base-layout', BaseLayout);

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
