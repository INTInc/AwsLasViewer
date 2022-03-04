<template>
  <div id="int-main-demo-nav">
    <v-app-bar
      v-if="!navbarHidden && !collapsed"
      prominent
      height="75px"
      color="#1d3d62"
    >
      <img
        class="int-logo-header"
        src="../../../../images/INT-logo-white.png"
        alt="INT"
      >

      <v-menu
        v-for="(moduleEntry, moduleIndex) in modulesList"
        :key="moduleIndex"
        open-on-hover
        bottom
        left
        light
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
            text
            dark
            style="margin: 15px"
            v-on="on"
          >
            {{ moduleEntry.props.module }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(demoEntry, demoIndex) in moduleDemos(moduleEntry.props.module)"
            :key="demoIndex"
            :to="demoEntry.path"
            link
          >
            <v-list-item-title>{{ demoEntry.props.demoName }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-spacer />
      <img
        class="vue-logo"
        src="../../../../images/vuelogo.png"
        width="50px"
      >
    </v-app-bar>
    <v-app-bar
      v-if="!navbarHidden && collapsed"
      prominent
      height="75px"
      color="#1d3d62"
    >
      <v-menu max-height="300px">
        <template v-slot:activator="{ on }">
          <v-app-bar-nav-icon v-on="on" dark/>
        </template>
        <v-list>
          <div
            v-for="(module, moduleIndex) in modulesList"
            :key="moduleIndex"
          >
            <v-subheader>{{ module.props.module }}</v-subheader>
            <v-list-item
              v-for="(demo, demoIndex) in moduleDemos(module.props.module)"
              :key="demoIndex"
              :to="demo.path"
              link
            >
              <v-list-item-title>{{ demo.props.demoName }}</v-list-item-title>
            </v-list-item>
            <v-divider />
          </div>
        </v-list>
      </v-menu>
      <v-spacer />
      <img
        class="int-logo-header"
        src="../../../../images/INT-logo-white.png"
        alt="INT"
      >
    </v-app-bar>
  </div>
</template>

<script>
import {routes} from 'routerconfig.js';

export default {
    name: 'IntMainNavigation',
    data () {
        return {
            routes
        };
    },
    computed: {
        navbarHidden: function () {
            return new URL(window.location.href).searchParams.get('collapsed') === 'true';
        },
        modulesList: function () {
            return this.routes.filter((route) =>
                route.redirect != null && route.props != null && route.props.module != null
            );
        },
        collapsed: function () {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs': return true;
                case 'sm': return true;
                case 'md': return false;
                case 'lg': return false;
                case 'xl': return false;
                default:
                    return false;
            }
        }
    },
    methods: {
        moduleDemos: function (moduleName) {
            return this.routes.filter((route) =>
                route.props != null &&
                    route.props.module === moduleName &&
                    route.component != null
            );
        }
    }
};


</script>

<style scoped>
.vue-logo {
    position: absolute;
    top: 1rem;
    right: .5rem;
}
</style>
