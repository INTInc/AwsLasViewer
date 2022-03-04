<template>
  <v-dialog
    v-bind="$props"
    v-on="$listeners"
  >
    <v-card :style="absolute ? absoluteStyle : ''">
      <v-card-title
        class="headline"
      >
        {{ title }}
      </v-card-title>
      <v-card-text>
        <v-container>
          <slot />
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="displayOk"
          text
          @click="$emit('ok')"
        >
          Ok
        </v-btn>
        <v-btn
          text
          @click="$emit('input', false)"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// TODO: vuetify will implement the feature of setting custom position for dialog, current solution is temporary
// https://github.com/vuetifyjs/vuetify/issues/4807
export default {
    name: 'IntDialog',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: 'Title'
        },
        width: {
            type: String,
            default: '600px'
        },
        minWidth: {
            type: String,
            default: '600px'
        },
        maxWidth: {
            type: String,
            default: '600px'
        },
        absolute: {
            type: Boolean,
            default: false
        },
        position: {
            type: Object,
            default: () => {}
        },
        displayOk: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        absoluteStyle: function () {
            return {
                'position': 'absolute',
                'top': this.position.top,
                'bottom': this.position.bottom,
                'right': this.position.right,
                'left': this.position.left,
                'max-width': this.maxWidth,
                'min-width': this.minWidth,
                'width': this.width
            };
        }
    }
};
</script>

<style scoped>
  >>>.v-dialog {
    background-color: white;
  }
  >>>.v-card__text {
    padding-right: 10px!important;
    padding-left: 10px!important;
  }
</style>
