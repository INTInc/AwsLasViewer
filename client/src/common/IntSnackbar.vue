<template>
  <v-snackbar
    v-bind="$props"
    style="z-index: 1050;"
    v-on="$listeners"
  >
    {{ message }}
    <template v-slot:action>
      <v-btn
        text
        @click="$emit('input', false)"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
    name: 'IntSnackbar',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        message: {
            type: String,
            default: ''
        },
        timeout: {
            type: Number,
            default: 2000
        }
    }
};
</script>
