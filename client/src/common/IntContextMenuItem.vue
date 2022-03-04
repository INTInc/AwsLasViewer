<template>
  <div>
    <v-list-item
      oncontextmenu="return false"
      :disabled="disabled"
      @click="$emit('click')"
    >
      <v-icon small>
        {{ icon }}
      </v-icon>
      <v-list-item-title>{{ title }}</v-list-item-title>
      <v-list-item-title
        v-if="shortcut"
        style="text-align: end; color: rgba(0,0,0,.25)"
      >
        {{ shortcut }}
      </v-list-item-title>
    </v-list-item>
  </div>
</template>

<script>
import IntContextMenuItemMixin from './IntContextMenuItemMixin';
export default {
    name: 'IntContextMenuItem',
    mixins: [IntContextMenuItemMixin]
};
</script>

<style scoped>
  >>> i {
    margin-right: 5px;
  }

</style>
