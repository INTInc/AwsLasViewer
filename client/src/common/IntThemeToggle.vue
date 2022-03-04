<template>
  <v-switch
    v-model="$vuetify.theme.dark"
    class="int-theme-toggle"
    :label="themeName"
    @change="$emit('change', $event)"
  />
</template>

<script>
import {VSwitch} from 'vuetify/lib';
export default {
    name: 'IntThemeToggle',
    components: {VSwitch},
    computed: {
        themeName () {
            return this.$vuetify.theme.dark ? 'Dark' : 'Light';
        }
    }
};
</script>

<style scoped>
  .int-theme-toggle {
    margin-top: 17px;
  }
  >>>label {
    margin-top: 10px;
    margin-left: 10px;
  }
</style>
