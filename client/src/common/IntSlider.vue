<template>
  <v-slider
    class="int-slider"
    :input-value="value"
    v-bind="$props"
    v-on="$listeners"
  >
    <template v-slot:prepend>
      <slot name="prepend" />
    </template>
    <template v-slot:append>
      <slot name="append" />
    </template>
  </v-slider>
</template>

<script>
import {VSlider} from 'vuetify/lib';
export default {
    name: 'IntSlider',
    components: {VSlider},
    props: {
        label: {
            type: String,
            default: ''
        },
        max: {
            type: [String, Number],
            default: 0
        },
        min: {
            type: [String, Number],
            default: 0
        },
        step: {
            type: Number,
            default: 1
        },
        value: {
            type: Number,
            default: 1
        }
    }
};
</script>

<style scoped>
  .int-slider {
    max-height: 30px;
    max-width: 200px;
  }
</style>
