<template>
  <v-menu
    v-model="showMenu"
    absolute
    offset-y
    style="max-height: 100%"
  >
    <template v-slot:activator="{ on }">
      <div
        :style="{pointerEvents: showMenu ? 'none' : 'auto'}"
        style="width: 100%"
        @mousedown="showMenu = false"
        @contextmenu.prevent="visible && on.click($event)"
      >
        <slot name="canvas" />
      </div>
    </template>
    <v-list
      width="180"
      dense
    >
      <slot name="list" />
    </v-list>
  </v-menu>
</template>

<script>
import {VMenu, VList} from 'vuetify/lib';
const listener = function (e) {
    e.preventDefault();
};
export default {
    name: 'IntContextMenu',
    components: {VMenu, VList},
    props: {
        visible: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            showMenu: false
        };
    },
    watch: {
        showMenu: function (val) {
            // we should disable contextmenu when this menu is shown
            if (val) {
                window.addEventListener('contextmenu', listener, false);
            } else {
                window.removeEventListener('contextmenu', listener, false);
            }
        }
    }
};
</script>
