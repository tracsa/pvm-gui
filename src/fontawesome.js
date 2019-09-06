import Vue from 'vue';

import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import solid from '@fortawesome/fontawesome-free-solid';
import regular from '@fortawesome/fontawesome-free-regular';

fontawesome.library.add(solid); // Use any icon from the Solid style
fontawesome.library.add(regular); // Use any icon from the Solid style

Vue.component('icon', FontAwesomeIcon);

export default FontAwesomeIcon;
