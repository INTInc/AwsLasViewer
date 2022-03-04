<template>
  <div class="int-checked-number-input">
    <int-button
      :title="title"
      :icon="icon"
      :active="checked"
      @click="onChecked"
    />
    <int-number-input
      v-bind="{...$props, icon: ''}"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import IntNumberInput from './IntNumberInput.vue';
import IntButton from './IntButton.vue';
import IntNumberInputMixin from './IntNumberInputMixin';
export default {
    name: 'IntCheckedNumberInput',
    components: {IntNumberInput, IntButton},
    mixins: [IntNumberInputMixin],
    props: {
        checked: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onChecked (event) {
            this.$emit('input', !this.checked ? this.value + this.measure : null);
        }
    }
};
</script>

<style scoped>
  .int-checked-number-input {
    display: flex;
    flex-direction: row;
    margin-right: 5px;
  }
</style>
