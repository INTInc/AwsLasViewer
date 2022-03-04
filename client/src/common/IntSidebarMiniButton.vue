<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="on">
        <v-btn
          class="int-sidebar-mini-button"
          :title="title"
          width="100%"
          min-width="100%"
          tile
          text
          height="110px"
          :ripple="false"
          v-on="on"
          @click="$emit('input', true)"
        >
          {{ title }}
        </v-btn>
      </template>
      <span>{{ title }}</span>
    </v-tooltip>
    <int-dialog
      absolute
      :title="title"
      :max-width="dialogWidth"
      :min-width="dialogWidth"
      :width="dialogWidth"
      :value="value"
      :position="absolutePosition"
      @input="$emit('input', $event)"
    >
      <slot name="dialog-content" />
    </int-dialog>
  </div>
</template>

<script>
import {VBtn, VTooltip} from 'vuetify/lib';
import IntDialog from './IntDialog.vue';
const SIDE_MARGIN = '45px';
const TOP_MARGIN = '190px';
export default {
    name: 'IntSidebarMiniButton',
    components: {VBtn, VTooltip, IntDialog},
    props: {
        title: {type: String, default: ''},
        right: {type: Boolean, default: false},
        value: {type: Boolean, default: false},
        dialogWidth: {type: [String, Number], default: '600px'}
    },
    computed: {
        absolutePosition: function () {
            return {
                top: TOP_MARGIN,
                left: this.right ? null : SIDE_MARGIN,
                right: this.right ? SIDE_MARGIN : null
            };
        }
    }
};
</script>

<style scoped>
  .int-sidebar-mini-button {
    font: bold 12px Arial;
    transition: none !important;
  }
  >>> .v-btn__content {
    transition: none !important;
    transform: rotate(-90deg);
  }
  >>> .v-btn.outlined {
    background-color: rgba(155, 155, 155, 0.5);
  }
</style>
