import Datepicker from 'vuejs-datepicker';
import Vue from 'vue';
import './timeline';
import './inbox';

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
import SignIn from './SignIn';
import LinkInput from './LinkInput';

import UsersPopover from './misc/UsersPopover';
import MdRender from './misc/MdRender';

Vue.component('app-users-popover', UsersPopover);
Vue.component('app-md-render', MdRender);

// Components
Vue.component('app', App);
Vue.component('app-header', Header);
Vue.component('activity', Activity);
Vue.component('form-render', FormRender);
Vue.component('linear-steps', LinearSteps);
Vue.component('value-render', ValueRender);
Vue.component('hero', Hero);
Vue.component('sign-in', SignIn);

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
