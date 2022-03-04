<template>
  <v-theme-provider root>
    <v-list>
      <v-list-item-group>
        <slot />
      </v-list-item-group>
    </v-list>
  </v-theme-provider>
</template>

<script>
import {VList} from 'vuetify/lib';
export default {
    name: 'IntList',
    components: {VList}
};
</script>

<style scoped>

</style>
