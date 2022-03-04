<template>
  <IntTextField
    class="custom-input"
    :label="label"
    :value="value"
  >
    <template v-slot:prepend>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            class="custom-content"
            rounded
            :color="color"
            v-on="on"
          />
        </template>
        <v-sheet class="p-2">
          <int-color-picker
            :value="value"
            :swatches="[]"
            @input="update($event)"
          />
        </v-sheet>
      </v-menu>
    </template>
  </IntTextField>
</template>

<script>
import IntColorPicker from 'common/IntColorPicker.vue';
import IntTextField from 'common/IntTextField.vue';

export default {
    name: 'TextColor',
    components: {IntColorPicker, IntTextField},
    props: {
        value: {
            type: String,
            default: '#64646400'
        },
        label: {
            type: String,
            default: 'Text color'
        }
    },
    data () {
        return {
            color: this.value,
            menu: false
        };
    },
    watch: {
        value () {
            this.color = this.value;
        }
    },
    methods: {
        update (value) {
            this.color = value;
            this.$emit('input', value);
        }
    }
};
</script>

<style scoped>
.custom-input {
    position: relative;
    color: transparent;
}
.custom-input >>> .v-text-field__slot input {
    color: transparent;
}
.custom-content {
    position: absolute;
    z-index: 1;
    width: 100%;
}
</style>
