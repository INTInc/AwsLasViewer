<template>
  <v-checkbox
    :label="label"
    :input-value="value"
    :disabled="disabled"
    v-on="$listeners"
  />
</template>

<script>
import {VCheckbox} from 'vuetify/lib';
export default {
    name: 'IntCheckbox',
    components: {VCheckbox},
    props: {
        label: {
            type: String,
            default: ''
        },
        value: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style scoped>
  .v-input {
    margin-top: 0!important;
  }
  >>>.v-input__slot {
    margin-bottom: 0;
  }
  >>> label {
    margin-bottom: 3px;
    margin-left: 5px;
  }
</style>
