<template>
  <div>
    <int-context-menu-item
      title="Move visual up"
      icon="mdi-chevron-up"
      @click="$emit('button-click', ToolbarActions.MoveVisualUp)"
    />
    <int-context-menu-item
      title="Move visual down"
      icon="mdi-chevron-down"
      @click="$emit('button-click', ToolbarActions.MoveVisualDown)"
    />
    <int-context-menu-item
      title="Move visual top"
      icon="mdi-arrow-up-drop-circle"
      @click="$emit('button-click', ToolbarActions.MoveVisualTop)"
    />
    <int-context-menu-item
      title="Move visual bottom"
      icon="mdi-arrow-down-drop-circle"
      @click="$emit('button-click', ToolbarActions.MoveVisualBottom)"
    />
    <int-divider />
    <int-context-menu-item
      title="Delete"
      icon="mdi-window-close"
      @click="$emit('button-click', ToolbarActions.SelectionDelete)"
    />
    <int-context-menu-item
      title="Properties"
      icon="mdi-wrench"
      @click="$emit('button-click', ToolbarActions.ShowProperties)"
    />
  </div>
</template>

<script>
import IntContextMenuItem from 'common/IntContextMenuItem.vue';
import IntDivider from 'common/IntDivider.vue';
import ToolbarActions from './ToolbarActions';
export default {
    name: 'IntWellLogContextMenu',
    components: {IntContextMenuItem, IntDivider},
    data () {
        return {ToolbarActions};
    }
};
</script>

<style scoped>

</style>
