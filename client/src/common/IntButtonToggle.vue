<template>
  <v-btn-toggle
    :value="value"
    group
    :multiple="multiple"
    :mandatory="mandatory"
    @change="$emit('input', $event)"
  >
    <slot />
  </v-btn-toggle>
</template>

<script>
import {VBtnToggle} from 'vuetify/lib';
export default {
    name: 'IntButtonToggle',
    components: {VBtnToggle},
    props: {
        value: {
            type: [Number, Array],
            default: undefined
        },
        multiple: {
            type: Boolean,
            default: false
        },
        mandatory: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style scoped>

</style>
