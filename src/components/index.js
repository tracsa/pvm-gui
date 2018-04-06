import Datepicker from 'vuejs-datepicker';
import Vue from 'vue';

import Activity from './Activity';
import DatetimeInput from './DatetimeInput';
import FormRender from './FormRender';
import Header from './Header';
import TimeInput from './TimeInput';
import DoqerSelect from './doqer/Select';
import DoqerCreate from './doqer/Create';
import DoqerSuggest from './doqer/Suggest';


// Components
Vue.component('app-header', Header);
Vue.component('activity', Activity);
Vue.component('form-render', FormRender);

// From inputs
Vue.component('time-input', TimeInput);
Vue.component('date-input', Datepicker);
Vue.component('datetime-input', DatetimeInput);

// Doqer components
Vue.component('doqer-input', DoqerSelect);
Vue.component('doqer-create', DoqerCreate);
Vue.component('doqer-suggest', DoqerSuggest);
