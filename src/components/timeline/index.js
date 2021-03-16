import Vue from 'vue';

import Action from './Action';
import Pending from './Pending';
import Summary from './Summary';
import PointerCard from './PointerCard';
import ExecutionCard from './ExecutionCard';

Vue.component('timeline-action', Action);
Vue.component('timeline-pending', Pending);
Vue.component('timeline-summary', Summary);
Vue.component('app-pointer-card', PointerCard);
Vue.component('app-execution-card', ExecutionCard);
