<template>
  <v-list-item>
    <v-list-item-icon>
      <v-icon v-text="icon" />
    </v-list-item-icon>
    <v-list-item-title>{{ title }}</v-list-item-title>
  </v-list-item>
</template>

<script>
import {VListItem} from 'vuetify/lib';
export default {
    name: 'IntListItem',
    components: {VListItem},
    props: {
        title: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: ''
        }
    }
};
</script>

<style scoped>

</style>
