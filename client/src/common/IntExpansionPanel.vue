<template>
  <v-expansion-panel>
    <v-expansion-panel-header
      class="int-expansion-header"
      expand-icon="mdi-menu-down"
    >
      {{ title }}
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <slot />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import {VExpansionPanel} from 'vuetify/lib';
export default {
    name: 'IntExpansionPanel',
    components: {VExpansionPanel},
    props: {
        title: {
            type: String,
            default: ''
        }
    }
};
</script>

<style scoped>
  .int-expansion-header {
    padding: 4px 8px 4px 12px !important;
    flex-direction: row;
    justify-content: flex-end;
    min-height: 32px !important;
  }
  .theme--dark.v-expansion-panels .v-expansion-panel {
    background-color: #272727;
  }
</style>

