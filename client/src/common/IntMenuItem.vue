<template>
  <v-list-item
    :inactive="!active"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <v-icon
      v-if="icon"
      class="pr-2"
    >
      {{ icon }}
    </v-icon>
    <v-list-item-title v-if="title !== ''">
      {{ title }}
    </v-list-item-title>
  </v-list-item>
</template>

<script>
import {VListItem, VIcon} from 'vuetify/lib';
import IntButtonMixin from './IntButtonMixin';
export default {
    name: 'IntMenuItem',
    components: {VListItem, VIcon},
    mixins: [IntButtonMixin]
};
</script>
