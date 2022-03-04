<template>
  <v-dialog
    :value="value"
    max-width="290"
    @keydown.stop
    @keydown.esc="$emit('input', false)"
  >
    <v-card>
      <v-card-title class="headline">
        {{ title }}
      </v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="#6c757d"
          text
          @click="onNoClick"
        >
          No
        </v-btn>
        <v-btn
          color="#007bff"
          text
          @click="onOkClick"
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
    name: 'IntConfirmDialog',
    props: {
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            default: ''
        },
        value: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onOkClick () {
            this.$emit('input', false);
            this.$emit('ok');
        },
        onNoClick () {
            this.$emit('input', false);
            this.$emit('no');
        }
    }
};
</script>
