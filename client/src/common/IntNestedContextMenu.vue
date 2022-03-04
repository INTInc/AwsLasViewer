<template>
  <div>
    <v-menu
      offset-x
      max-height="100%"
      :max-width="maxWidth"
    >
      <template v-slot:activator="{ on }">
        <v-list-item
          oncontextmenu="return false"
          :disabled="disabled"
          v-on="on"
        >
          <v-icon small>
            {{ icon }}
          </v-icon>
          <v-list-item-title>{{ title }}</v-list-item-title>
          <v-icon
            color="white"
            style="text-align: end; color: rgba(0,0,0,.25)"
          >
            mdi-menu-right
          </v-icon>
        </v-list-item>
      </template>
      <v-list>
        <slot />
      </v-list>
    </v-menu>
  </div>
</template>

<script>
// TODO: Cannot create open-on-hover nested menus with vuetify right now
// https://github.com/vuetifyjs/vuetify/issues/1877
import IntContextMenuItemMixin from './IntContextMenuItemMixin';
export default {
    name: 'IntNestedContextMenu',
    mixins: [IntContextMenuItemMixin],
    props: {
        maxWidth: {
            type: String,
            default: '500px'
        }
    }
};
</script>

<style scoped>
    >>> i {
        margin-right: 5px;
    }

</style>
