import Vue from 'vue';

import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import solid from '@fortawesome/fontawesome-free-solid';

fontawesome.library.add(solid); // Use any icon from the Solid style

Vue.component('icon', FontAwesomeIcon);
