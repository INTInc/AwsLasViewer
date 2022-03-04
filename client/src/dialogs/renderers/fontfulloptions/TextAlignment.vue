<template>
  <IntTextField
    class="custom-input"
    :label="label"
    :value="value"
  >
    <template v-slot:prepend>
      <IntButtonToggle
        class="custom-content"
        :value="alignmentModel"
        mandatory
      >
        <IntButton
          title="Left"
          icon="mdi-format-align-left"
          @change="() => update('left')"
        />
        <IntButton
          title="Center"
          icon="mdi-format-align-center"
          @change="() => update('center')"
        />
        <IntButton
          title="Right"
          icon="mdi-format-align-right"
          @change="() => update('right')"
        />
      </IntButtonToggle>
    </template>
  </IntTextField>
</template>

<script>
import IntTextField from 'common/IntTextField.vue';
import IntButton from 'common/IntButton.vue';
import IntButtonToggle from 'common/IntButtonToggle.vue';

export default {
    name: 'TextAlignment',
    components: {IntButton, IntButtonToggle, IntTextField},
    props: {
        value: {
            type: String,
            default: 'left'
        },
        label: {
            type: String,
            default: 'Alignment'
        }
    },
    data () {
        return {
            alignmentModel: 0,
            alignment: 'left'
        };
    },
    watch: {
        value (value) {
            this.alignment = value;
            this.updateAlignmentModel();
        }
    },
    methods: {
        update (value) {
            this.alignment = value;
            this.$emit('change', value);
        },
        updateAlignmentModel () {
            switch (this.alignment) {
                case 'left':
                    this.alignmentModel = 0;
                    break;
                case 'center':
                    this.alignmentModel = 1;
                    break;
                case 'right':
                    this.alignmentModel = 2;
                    break;
            }
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
