<template>
  <v-color-picker
    :value="value"
    flat
    :hide-canvas="hideCanvasValue"
    :hide-sliders="hideSlidersValue"
    :hide-inputs="hideInputsValue"
    class="ma-2"
    :swatches="colors"
    show-swatches
    @input="$emit('input', $event)"
  />
</template>

<script>
import {VColorPicker} from 'vuetify/lib';
const SWATCHES = [
    ['#FF0000', '#AA0000', '#550000'],
    ['#FFFF00', '#AAAA00', '#555500'],
    ['#00FF00', '#00AA00', '#005500'],
    ['#00FFFF', '#00AAAA', '#005555'],
    ['#0000FF', '#0000AA', '#000055']
];
// TODO: Performance issue, when changing color
export default {
    name: 'IntColorPicker',
    components: {VColorPicker},
    props: {
        value: {
            type: String,
            default: '#64646400'
        },
        hideCanvas: {
            type: Boolean,
            default: false
        },
        hideInputs: {
            type: Boolean,
            default: false
        },
        hideSliders: {
            type: Boolean,
            default: false
        },
        swatches: {
            type: [Array, String],
            default: () => ''
        }
    },
    data () {
        return {SWATCHES};
    },
    computed: {
        hideCanvasValue: function () {
            return this.hideCanvas;
        },
        hideInputsValue: function () {
            return this.hideInputs;
        },
        hideSlidersValue: function () {
            return this.hideSliders;
        },
        colors: function () {
            return this.swatches || SWATCHES;
        }
    }
};
</script>
