<template>
  <int-dialog
      :title="title"
      :value="show"
      max-width="600px"
      @input="$emit('close')"
  >
    <div v-if="loading" class="d-flex justify-center">
      <int-loader class="d-flex" />
    </div>

    <int-list v-if="!loading">
      <int-list-item
          v-for="(fileName, index) in files"
          :key="index"
          :title="fileName"
          icon="mdi-file"
          @click.native="$emit('selectFile', fileName)"
      />
    </int-list>
  </int-dialog>
</template>

<script>
import IntDialog from './IntDialog.vue';
import IntList from './IntList.vue';
import IntListItem from './IntListItem.vue';
import IntLoader from './IntLoader.vue';
export default {
  name: 'IntFileSelectDialog',
  components: {IntDialog, IntList, IntListItem, IntLoader},
  props: {
    title: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: false,
    },
    files: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
     this.$emit('openDialog');
  },
};
</script>

<style scoped>

</style>
