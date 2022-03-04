<template>
  <IntTextField
    class="custom-input"
    :label="label"
  >
    <template v-slot:prepend>
      <IntButtonToggle
        class="custom-content"
        :value="[
          isBold === true ? 0 : null,
          isItalic === true ? 1 : null,
          isUnderline === true ? 2 : null,
          isStrikethrough === true ? 3 : null,
        ]"
        multiple
      >
        <IntButton
          title="Bold"
          icon="mdi-format-bold"
          @change="updateFontWeight"
        />
        <IntButton
          title="Italic"
          icon="mdi-format-italic"
          @change="updateFontStyle"
        />
        <IntButton
          title="Underline"
          icon="mdi-format-underline"
          @change="updateUnderline"
        />
        <IntButton
          title="Strikethrough"
          icon="mdi-format-strikethrough"
          @change="updateStrikethrough"
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
    name: 'FontAttributes',
    components: {IntButton, IntButtonToggle, IntTextField},
    props: {
        fontWeight: {
            type: String,
            default: 'normal'
        },
        fontStyle: {
            type: String,
            default: 'normal'
        },
        underline: {
            type: [String, Object],
            default: null
        },
        strikethrough: {
            type: [String, Object],
            default: null
        },
        label: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikethrough: false
        };
    },
    watch: {
        fontWeight () {
            this.isBold = this.fontWeight === 'bold';
        },
        fontStyle () {
            this.isItalic = this.fontStyle === 'italic';
        },
        underline () {
            this.isUnderline = this.underline != null;
        },
        strikethrough () {
            this.isStrikethrough = this.strikethrough != null;
        }
    },
    emits: [
        'font-weight:updated',
        'font-style:updated',
        'underline:updated',
        'strikethrough:updated'
    ],
    methods: {
        updateFontWeight () {
            this.isBold = !this.isBold;
            this.$emit(
                'font-weight:updated',
                this.isBold === true ? 'bold' : 'normal'
            );
        },
        updateFontStyle () {
            this.isItalic = !this.isItalic;
            this.$emit(
                'font-style:updated',
                this.isItalic === true ? 'italic' : 'normal'
            );
        },
        updateUnderline () {
            this.isUnderline = !this.isUnderline;
            this.$emit(
                'underline:updated',
                this.isUnderline === true ? 'inherit' : null
            );
        },
        updateStrikethrough () {
            this.isStrikethrough = !this.isStrikethrough;
            this.$emit(
                'strikethrough:updated',
                this.isStrikethrough === true ? 'inherit' : null
            );
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
