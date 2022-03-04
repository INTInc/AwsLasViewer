<template>
  <div id="int-toolbar">
    <v-toolbar
      v-if="!collapsed"
      class="elevation-0"
      dense
      :dark="darkMode"
      max-height="48"
    >
      <slot name="right" />
      <v-spacer />
      <slot name="left" />
    </v-toolbar>
    <v-toolbar
      v-else
      max-height="48"
      class="elevation-0"
      dense
    >
      <int-menu
        title="Menu"
        icon="mdi-menu"
        :autoclose="false"
      >
        <v-list-item-group
          v-if="collapsed"
          multiple
          :value="activeButtons"
        >
          <int-menu-item
            v-for="{props, listeners} in buttonsData"
            :key="props.title"
            v-bind="props"
            v-on="listeners"
          />
        </v-list-item-group>
        <div style="display: none">
          <slot name="right" />
        </div>
      </int-menu>
      <v-spacer />
      <slot name="left" />
    </v-toolbar>
  </div>
</template>

<script>
import {VToolbar, VSpacer} from 'vuetify/lib';
import IntMenu from './IntMenu.vue';
import IntMenuItem from './IntMenuItem.vue';
export default {
    name: 'IntToolbar',
    components: {VToolbar, VSpacer, IntMenu, IntMenuItem},
    data () {
        return {
            darkMode: false
        };
    },
    computed: {
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
        },
        buttonsData: function () {
            return this.$slots.right
                .filter((slot) => slot.componentOptions && slot.componentOptions.propsData)
                .map((slot) => ({
                    props: slot.componentOptions.propsData,
                    listeners: slot.componentOptions.listeners
                }));
        },
        activeButtons: function () {
            const result = [];
            this.buttonsData.forEach(({props}, index) => {
                if (props.active) {
                    result.push(index);
                }
            });
            return result;
        }
    },
    methods: {
        setDarkMode (mode) {
            this.darkMode = mode;
        }
    }
};
</script>
