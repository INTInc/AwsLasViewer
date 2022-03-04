<template>
  <div class="int-pattern-picker">
    <int-pattern-input
      :patterns="patterns"
      :value="pattern"
      @input="$emit('update', {...$props, pattern: $event})"
    />
    <int-color-picker-menu
      class="int-pattern-color-menu"
      :value="color"
      @input="$emit('update', {...$props, color: $event})"
    />
  </div>
</template>

<script>
import IntColorPickerMenu from './IntColorPickerMenu.vue';
import IntPatternInput from './IntPatternInput.vue';
export default {
    name: 'IntPatternPicker',
    components: {IntPatternInput, IntColorPickerMenu},
    props: {
        pattern: {
            type: String,
            default: 'None'
        },
        patterns: {
            type: Object,
            required: true
        },
        color: {
            type: String,
            default: '#64646400'
        }
    }
};
</script>
<style scoped>
  .int-pattern-picker {
    display: flex;
  }

  .int-pattern-color-menu {
    display: table-cell;
    padding-left: 10px;
  }
</style>
