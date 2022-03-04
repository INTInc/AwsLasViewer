<template>
  <int-select
    custom-items
    :items="FONT_SIZES"
    :value="fontSize"
    v-on="$listeners"
    label='Font size'
  >
    <template v-slot:item="{ item }">
      <span>
        {{ item }}
      </span>
    </template>
  </int-select>
</template>

<script>
import IntSelect from './IntSelect.vue';

const FONT_SIZES = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 24, 30, 36, 48, 60, 72, 96];

export default {
    name: 'IntFontSize',
    components: {IntSelect},
    props: {
        fontSize: {
            type: Number,
            default: FONT_SIZES[0]
        }
    },
    data () {
        return {FONT_SIZES};
    }
};
</script>
