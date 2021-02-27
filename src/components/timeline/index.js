import Vue from 'vue';

import Action from './Action';
import Pending from './Pending';
import Task from './Task';
import UserAssignment from './UserAssignment';
import ExecutionDelete from './ExecutionDelete';
import BaseLayout from './BaseLayout';

Vue.component('timeline-action', Action);
Vue.component('timeline-pending', Pending);
Vue.component('timeline-task', Task);
Vue.component('timeline-user-assignment', UserAssignment);
Vue.component('timeline-execution-delete', ExecutionDelete);
Vue.component('timeline-item-base', BaseLayout);
