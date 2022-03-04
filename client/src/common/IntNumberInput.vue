<template>
  <div
    class="int-number-input-wrapper"
    :style="wrapperCss"
  >
    <div
      v-if="icon == null"
      class="int-number-input-text"
    >
      {{ title }}
    </div>
    <div
      class="int-number-input"
      :style="inputCss"
    >
      <v-text-field
        type="number"
        :step="step"
        :value="value"
        :min="min"
        :max="max"
        :prepend-icon="icon"
        :disabled="disabled"
        @input="onValueChange"
      >
        <template v-slot:prepend>
          <v-tooltip
            bottom
          >
            <template v-slot:activator="{ on }">
              <v-icon v-on="on">
                {{ icon }}
              </v-icon>
            </template>
            {{ title }}
          </v-tooltip>
        </template>
      </v-text-field>
      <v-select
        v-if="measure && measures"
        :items="measures"
        class="int-number-input-measure int-number-input-text"
        type="text"
        :value="measure"
        :disabled="disabled"
        @change="onMeasureChange"
      />
    </div>
  </div>
</template>

<script>
import {VTextField, VTooltip} from 'vuetify/lib';
import IntNumberInputMixin from './IntNumberInputMixin';
export default {
    name: 'IntNumberInput',
    components: {VTextField, VTooltip},
    mixins: [IntNumberInputMixin],
    computed: {
        inputCss () {
            return {
                '--min-width': this.icon ? '135px' : '105px'
            };
        },
        wrapperCss () {
            return {
                '--margin-left': this.icon ? '6px' : '0px'
            };
        }
    },
    methods: {
        onMeasureChange (event) {
            if (event === this.measure) {
                return;
            }
            const convertedValue = this.convertValueToNewMeasure(event);
            if (convertedValue != null) {
                this.$emit('input', convertedValue + event);
            } else {
                this.$emit('input', this.value + event);
            }
        },
        onValueChange (event) {
            if (event === this.value) {
                return;
            }
            this.$emit('input', event + this.measure);
        }
    }
};
</script>

<style scoped>
  .int-number-input-wrapper {
    display: inline-block;
    margin-left: var(--margin-left);
  }
  .int-number-input {
    width: 120px;
    display: flex;
    flex-direction: row;
  }
  .int-number-input-text {
    font-size: 13px;
  }
  .int-number-input-measure {
    min-width: 55px!important;
    margin-top: 10px;
    margin-left: 5px;
    margin-right: 20px;
  }
  .v-input {
    min-width: var(--min-width);
    margin-top: 0;
    padding-top: 0;
  }
</style>
