<template>
  <div id="app">
    <v-app data-app>
        <LogViewer/>
    </v-app>
  </div>
</template>

<script>
import Vuetify from 'vuetify';
import LogViewer from './LogViewer.vue';
export default {
    name: 'INTViewer',
    components: {LogViewer},
    vuetify: new Vuetify({
        theme: {
            dark: false
        }
    }),
    // Workaround for IE 11
    mounted: function () {
        if (!!window.MSInputMethodContext && !!document.documentMode) {
            window.addEventListener('hashchange', this.hashChangeHandler);
        }
    },
    destroyed: function () {
        if (!!window.MSInputMethodContext && !!document.documentMode) {
            window.removeEventListener('hashchange', this.hashChangeHandler);
        }
    },
    methods: {
        hashChangeHandler: function () {
            const target = window.location.hash;
            this.$router.push(target.substring(1, target.length));
        }
    }
};
</script>

<style scoped>

</style>
