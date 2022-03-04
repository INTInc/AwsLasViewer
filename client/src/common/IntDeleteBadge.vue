<template>
  <v-badge
    color="grey"
    overlap
    v-bind="$props"
  >
    <template v-slot:badge>
      <v-btn
        icon
        x-small
        tile
        max-height="4px"
        max-width="4px"
        v-on="$listeners"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <slot />
  </v-badge>
</template>

<script>
export default {
    name: 'IntDeleteBadge',
    props: {
        value: {
            type: Boolean,
            default: true
        },
        left: {
            type: Boolean,
            default: false
        }
    }
};
</script>
