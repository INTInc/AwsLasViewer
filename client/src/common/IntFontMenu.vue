<template>
  <int-select
    custom-items
    custom-selection
    :items="FONTS"
    :value="fontName"
    v-on="$listeners"
    label='Font family'
  >
    <template v-slot:selection="{ item }">
      <span :style="{'font-family': item, 'text-transform': 'capitalize'}">
        {{ item }}
      </span>
    </template>
    <template v-slot:item="{ item }">
      <span :style="{'font-family': item, 'text-transform': 'capitalize'}">
        {{ item }}
      </span>
    </template>
  </int-select>
</template>

<script>
import IntSelect from './IntSelect.vue';
const FONTS = [
    'calibry',
    'lucida console',
    'times new roman',
    'impact',
    'courier new',
    'arial',
    'roboto',
    'sans-serif'
];
export default {
    name: 'IntFontMenu',
    components: {IntSelect},
    props: {
        fontName: {
            type: String,
            default: FONTS[0]
        }
    },
    data () {
        return {FONTS};
    }
};
</script>

<style scoped>
  button {
    background-color: lightgrey!important;
  }
</style>
