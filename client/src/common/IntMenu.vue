<template>
  <v-menu
    transition="slide-y-transition"
    offset-y
    :max-height="maxHeight"
    fixed
    bottom
    :close-on-click="autoclose"
    :close-on-content-click="autoclose"
  >
    <template v-slot:activator="{ on: menu }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            :class="buttonCssClass"
            :disabled="disabled"
            :icon="isIconButton"
            :small="!isIconButton"
            elevation="0"
            tile
            v-on="{...menu, ...tooltip}"
          >
            <v-icon v-if="isIconButton">
              {{ icon }}
            </v-icon>
            <span v-else>{{ title }}</span>
          </v-btn>
        </template>
        <span>{{ tooltip != null ? tooltip : title }}</span>
      </v-tooltip>
    </template>
    <v-list>
      <slot />
    </v-list>
  </v-menu>
</template>
<script>
import intToolbarButtonMixin from './IntButtonMixin';

export default {
    name: 'IntMenu',
    mixins: [intToolbarButtonMixin],
    props: {
        autoclose: {
            type: Boolean,
            default: true
        },
        tooltip: {
            type: String,
            default: null
        }
    },

    data: () => ({
        height: 0
    }),

    computed: {
        maxHeight () {
            return this.height > 400 ? '380px' : 380 * this.height / 500 + 'px';
        }
    },

    mounted () {
        window.addEventListener('resize', this.updateHeight);
        this.updateHeight();
    },

    destroyed () {
        window.removeEventListener('resize', this.updateHeight);
    },

    methods: {
        updateHeight () {
            const offsetTop = window.document.getElementById('int-toolbar')?.getBoundingClientRect().top;
            this.height = window.innerHeight - offsetTop;
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
