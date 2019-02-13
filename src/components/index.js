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
import TimeInput from './TimeInput';
import UserList from './UserList';
import ValueRender from './ValueRender';
import Hero from './Hero';
import Processes from './Processes';
import SignIn from './SignIn';
import LinkInput from './LinkInput';
import History from './History';
import TaskRedirect from './TaskRedirect';
import Inbox from './Inbox';
import InboxListItem from './InboxListItem';
import InboxItem from './InboxItem';

// Inbox
Vue.component('inbox', Inbox);
Vue.component('inbox-list-item', InboxListItem);
Vue.component('inbox-item', InboxItem);

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
Vue.component('history', History);

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

Vue.component('task-redirect', TaskRedirect);
