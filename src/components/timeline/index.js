import Vue from 'vue';

import Action from './Action';
import Validation from './Validation';
import Pending from './Pending';
import Task from './Task';
import Patch from './Patch';

Vue.component('timeline-action', Action);
Vue.component('timeline-validation', Validation);
Vue.component('timeline-pending', Pending);
Vue.component('timeline-task', Task);
Vue.component('timeline-patch', Patch);
