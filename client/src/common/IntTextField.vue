<template>
  <v-text-field
    v-bind="$props"
    v-on="$listeners"
  >
    <slot
      v-for="slot in Object.keys($slots)"
      :slot="slot"
      :name="slot"
    />
  </v-text-field>
</template>

<script>
export default {
    name: 'IntTextField',
    props: {
        label: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            default: ''
        }
    }
};
</script>
