<template>
  <v-select
    v-bind="$props"
    v-on="$listeners"
  >
    <template
      v-if="customSelection"
      v-slot:selection="{ item }"
    >
      <slot
        name="selection"
        :item="item"
      />
    </template>
    <template
      v-if="customItems"
      v-slot:item="{ item }"
    >
      <slot
        name="item"
        :item="item"
      />
    </template>
  </v-select>
</template>

<script>
// TODO: remove custom items flag, don't know how to ignore slot if its not used by parent
import {VSelect} from 'vuetify/lib';
export default {
    name: 'IntSelect',
    components: {VSelect},
    props: {
        items: {
            type: Array,
            default: () => []
        },
        value: {
            type: [String, Number],
            default: ''
        },
        label: {
            type: String,
            default: ''
        },
        customItems: {
            type: Boolean,
            default: false
        },
        customSelection: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style scoped>
  >>>.v-icon {
    color: black!important;
  }
  >>>.v-select__selection--comma {
    color: black!important;
  }
  >>>.v-select__selection{
    margin-left: 4px;
  }
  >>>.v-input__slot {
    background-color: #d3d3d3;
  }
  >>> .v-list-item {
    text-align: center;
    min-height: 28px!important;
    max-height: 28px!important;
  }
</style>
