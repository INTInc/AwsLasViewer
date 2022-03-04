<template>
  <!-- without span v-menu doesn't work properly on this element  -->
  <span>
    <v-tooltip bottom>
      <template v-slot:activator="{ on: tooltip }">
        <v-btn
          :class="buttonCssClass"
          :icon="isIconButton"
          :disabled="disabled"
          :small="!isIconButton"
          :color="buttonColor"
          :x-large="large"
          elevation="0"
          tile
          v-on="{...$listeners, ...tooltip}"
        >
          <v-icon v-if="isIconButton">
            {{ icon }}
          </v-icon>
          <span v-else>{{ title }}</span>
        </v-btn>
      </template>
      <span>{{ title }}</span>
    </v-tooltip>
  </span>
</template>

<script>
import {VIcon, VBtn, VTooltip} from 'vuetify/lib';
import intToolbarButtonMixin from './IntButtonMixin';
export default {
    name: 'IntButton',
    components: {VIcon, VBtn, VTooltip},
    mixins: [intToolbarButtonMixin],
    props: {
        large: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        buttonColor: function () {
            if (this.isIconButton) {
                return '';
            }
            return this.$vuetify.theme.dark ? '#424242' : 'lightgrey';
        }
    }
};
</script>
<style scoped>
  button {
    outline: 0 !important;
  }
  .int-active-button.theme--light {
    background-color: lightgrey!important;
  }
  .int-active-button.theme--dark {
    background-color: grey!important;
  }
</style>
