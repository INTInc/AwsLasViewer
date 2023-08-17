import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';

import INTViewer from './main.vue';

import '@mdi/font/css/materialdesignicons.css';
import './assets/css/geotoolkit.css';
import './assets/css/toolbar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

Vue.use(Vuetify);
Vue.use(Vuex);

const store = new Vuex.Store({});

new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    components: {INTViewer},
    template: '<INTViewer />',
    store
});
