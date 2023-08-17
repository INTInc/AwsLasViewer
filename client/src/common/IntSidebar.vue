<template>
  <v-navigation-drawer
    class="int-navigation-drawer"
    permanent
    clipped
    app
    touchless
    :width="computedWidth"
    :min-width="computedWidth"
    mini-variant-width="40"
    :mini-variant="collapsed"
    :right="right"
  >
    <v-btn
      v-if="collapse"
      :class="right ? 'float-left' : 'float-right'"
      icon
      :title="collapsed ? 'Show Panel' : 'Hide Panel'"
      @click.stop="onCollapseClick()"
    >
      <v-icon>{{ chevronIcon }}</v-icon>
    </v-btn>
    <slot
      v-if="!collapsed"
      name="default"
    />
    <slot
      v-else
      name="collapsed"
    />
  </v-navigation-drawer>
</template>

<script>

import {VNavigationDrawer} from 'vuetify/lib';
import PlotHostHeightUtil from 'utils/PlotHostHeightUtil';
export default {
    name: 'IntSidebar',
    components: {VNavigationDrawer},
    props: {
        right: {
            type: Boolean,
            default: false
        },
        collapse: {
            type: Boolean,
            default: false
        },
        isCollapsed: {
            type: Boolean,
            default: false
        },
        closable: {
            type: Boolean,
            default: false
        },
        width: {
            type: [Number, String],
            default: 236
        }
    },
    data () {
        return {
            collapsed: this.isCollapsed
        };
    },
    computed: {
        chevronIcon: function () {
            const collapsedIcon = this.right ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right';
            const defaultIcon = this.right ? 'mdi-chevron-double-right' : 'mdi-chevron-double-left';
            return this.collapsed ? collapsedIcon : defaultIcon;
        },
        computedWidth: function () {
            // TODO: Should also accept string, but because of a bug in vuetify resize doesn't work or
            //  because the navigation drawer is inside v-content which is forbidden by docs
            return parseInt(this.width);
        }
    },
    watch: {
        isCollapsed (val) {
            this.collapsed = val;
        }
    },
    methods: {
        onCollapseClick: function () {
            this.collapsed = !this.collapsed;
            this.$emit('collapse', this.collapsed);
        },
        plotHostHeight () {
            return new PlotHostHeightUtil().plotHostHeight;
        }
    }
};
</script>
<style scoped>
  .int-navigation-drawer {
    top: auto !important;
    vertical-align: top;
  }
  .int-navigation-drawer.v-navigation-drawer--mini-variant {
    width: 40px !important;
    min-width: 40px;
  }
  .int-navigation-drawer >>> button {
    outline: none;
  }
  .int-navigation-drawer.theme--dark {
    background-color: #272727;
  }
</style>
