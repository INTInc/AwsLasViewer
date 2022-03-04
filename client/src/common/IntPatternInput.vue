<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn
        height="25"
        class="no-radius v-menu"
        style="display: table-cell;flex: auto;"
        tile
        v-on="on"
      >
        <img
          :src="selectedPattern"
          alt="..."
        >
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, name) in patterns"
        :key="item"
        @click="choosePattern(name)"
      >
        <img
          :src="item"
          style="margin: auto;"
          alt="..."
        >
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import {VMenu, VBtn, VList, VListItem} from 'vuetify/lib';
export default {
    name: 'IntPatternInput',
    components: {VMenu, VBtn, VList, VListItem},
    props: {
        value: {
            type: String,
            required: true
        },
        patterns: {
            type: Object,
            default: () => {}
        },
        label: {
            type: String,
            default: 'Label'
        }
    },
    computed: {
        patternNames: function () {
            return Object.keys(this.patterns);
        },
        selectedPattern: function () {
            return this.patterns[this.value];
        }
    },
    methods: {
        choosePattern (patternName) {
            this.$emit('input', patternName);
        }
    }
};
</script>

<style scoped>
  .v-list-item {
   background-color: white;

    max-height: 32px !important;
    min-height: 32px !important;
  }

  button {
      background-color: lightgrey!important;
  }
  .v-list-item:hover {
   background: #DBDBDB;
  }
</style>
