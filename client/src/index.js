import 'babel-polyfill';
import 'core-js/stable/object';
import 'core-js/stable/symbol';
import 'core-js/stable/array/from';
import 'core-js/stable/url';

import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify/lib';

import INTViewer from './main.vue';

import '@mdi/font/css/materialdesignicons.css';
import './assets/css/geotoolkit.css';
import './assets/css/toolbar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

Vue.use(Vuetify);
Vue.use(Vuex);

const store = new Vuex.Store();

new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    components: {INTViewer},
    template: '<INTViewer />',
    store
});
