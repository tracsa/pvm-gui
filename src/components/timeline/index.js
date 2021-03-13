import Vue from 'vue';

import Action from './Action';
import Pending from './Pending';
import PointerCard from './PointerCard';

Vue.component('timeline-action', Action);
Vue.component('timeline-pending', Pending);
Vue.component('app-pointer-card', PointerCard);
