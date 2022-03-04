<template>
  <int-select
    custom-items
    custom-selection
    :items="BASELINE"
    :value="baseline"
    v-on="$listeners"
    label='Baseline'
  >
    <template v-slot:selection="{ item }">
      <span :style="{'text-transform': 'capitalize'}">
        {{ item }}
      </span>
    </template>
    <template v-slot:item="{ item }">
      <span :style="{'text-transform': 'capitalize'}">
        {{ item }}
      </span>
    </template>
  </int-select>
</template>

<script>
import IntSelect from './IntSelect.vue';
import {BaseLineStyle} from '@int/geotoolkit/attributes/TextStyle';

const BASELINE = Object.values(BaseLineStyle);
export default {
    name: 'IntTextBaseline',
    components: {IntSelect},
    props: {
        baseline: {
            type: String,
            default: BASELINE[0]
        }
    },
    data () {
        return {BASELINE};
    }
};
</script>

<style scoped>
  button {
    background-color: lightgrey!important;
  }
</style>
