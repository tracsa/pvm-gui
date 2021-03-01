import Vue from 'vue';

import Action from './Action';
import Pending from './Pending';
import BaseLayout from './BaseLayout';

Vue.component('timeline-action', Action);
Vue.component('timeline-pending', Pending);
Vue.component('timeline-item-base', BaseLayout);
