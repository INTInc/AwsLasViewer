<template>
  <v-expansion-panels
    multiple
    accordion
    :value="openedPanels"
  >
    <slot />
  </v-expansion-panels>
</template>

<script>
import {VExpansionPanels} from 'vuetify/lib';
export default {
    name: 'IntExpansionPanels',
    components: {VExpansionPanels},
    props: {
        openedPanels: {
            type: Array,
            default: () => null
        }
    }
};
</script>
