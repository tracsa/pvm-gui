import Datepicker from 'vuejs-datepicker';
import Vue from 'vue';

import Timeline from '@/components/Timeline';
import TimelineAction from '@/components/TimelineAction';
import Tasks from '@/components/Tasks';
import Task from '@/components/Task';
import Activity from './Activity';
import DatetimeInput from './DatetimeInput';
import DoqerCreate from './doqer/Create';
import DoqerSelect from './doqer/Select';
import DoqerSuggest from './doqer/Suggest';
import FormRender from './FormRender';
import Header from './Header';
import TimeInput from './TimeInput';
import Tracking from './Tracking';
import Loading from './Loading';
import MessageInfo from './MessageInfo';
import FormInstance from './FormInstance';

// Components
Vue.component('app-header', Header);
Vue.component('activity', Activity);
Vue.component('tasks', Tasks);
Vue.component('task', Task);
Vue.component('timeline', Timeline);
Vue.component('timeline-action', TimelineAction);
Vue.component('form-render', FormRender);
Vue.component('tracking', Tracking);
Vue.component('loading', Loading);
Vue.component('message-info', MessageInfo);

// From inputs
Vue.component('form-instance', FormInstance);
Vue.component('time-input', TimeInput);
Vue.component('date-input', Datepicker);
Vue.component('datetime-input', DatetimeInput);

// Doqer components
Vue.component('doqer-input', DoqerSelect);
Vue.component('doqer-create', DoqerCreate);
Vue.component('doqer-suggest', DoqerSuggest);
