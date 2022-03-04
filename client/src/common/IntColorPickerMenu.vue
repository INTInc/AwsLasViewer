<template>
  <v-menu
    v-model="menu"
    class="int-fill-style-color-menu"
    transition="scale-transition"
    :close-on-content-click="false"
    offset-x
  >
    <template v-slot:activator="{ on }">
      <!-- TODO Temporary switch off: need to port from paint demo
      <v-badge
        class="eyedropper-badge"
        icon="mdi-eyedropper"
        bottom
        overlap
      > -->
      <div style="width:25px; height: 25px">
        <!--
          first one is unselectable background 'v-btn' with same size and style except, it has 'white' background
          to render color v-btn over the 'white' and resolve issue with color==rgba(r,g,b, 0.a)
        -->
        <v-btn
          style="position: absolute;user-select: none"
          color="white"
          retain-focus-on-click
          fab
          height="25"
          width="25"
          v-on="on"
        />
        <v-btn
          style="z-index: 999"
          :color="color"
          retain-focus-on-click
          fab
          height="25"
          width="25"
          @click.native.stop
          v-on="on"
        />
      </div>
      <!--     </v-badge> -->
    </template>
    <v-sheet class="p-2">
      <int-delete-badge @click="menu = false">
        <int-color-picker
          :value="value"
          @input="update($event)"
        />
      </int-delete-badge>
    </v-sheet>
  </v-menu>
</template>

<script>
import IntColorPicker from './IntColorPicker.vue';
import IntDeleteBadge from './IntDeleteBadge.vue';
export default {
    name: 'IntColorPickerMenu',
    components: {IntColorPicker, IntDeleteBadge},
    props: {
        value: {
            type: String,
            default: '#64646400'
        }
    },
    data () {
        return {
            color: this.value,
            menu: false
        };
    },
    watch: {
        value () {
            this.color = this.value;
        }
    },
    methods: {
        update (value) {
            this.color = value;
            this.$emit('input', value);
        }
    }
};
</script>

<style scoped>
  .v-badge {
    height: 100%;
  }
  .eyedropper-badge >>> i.mdi-eyedropper {
    color: white !important;
    cursor: pointer;
  }
  .v-badge.eyedropper-badge >>> .v-badge__badge:after {
    border-color: red;
  }
  >>>.v-badge__badge {
    bottom: unset!important;
    left: calc(100% - 20px)!important;
  }
</style>
