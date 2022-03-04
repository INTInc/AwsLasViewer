<template>
  <v-carousel
    class="int-carousel"
    v-bind="$props"
    v-on="$listeners"
  >
    <slot />
  </v-carousel>
</template>

<script>
import {VCarousel} from 'vuetify/lib';
export default {
    name: 'IntCarousel',
    components: {VCarousel},
    props: {
        hideDelimiters: {type: Boolean, default: true},
        showArrows: {type: Boolean, default: false},
        value: {type: Number, default: 0},
        touchless: {type: Boolean, default: false}
    }
};
</script>

<style scoped>
  .int-carousel {
    height: 100% !important;
  }
  >>> .v-carousel__item {
    height: 100% !important;
  }
</style>
