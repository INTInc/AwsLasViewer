<template>
  <int-toolbar>
    <template v-slot:right>
      <int-button
        :title="sidebarToggleTitle"
        :icon="sidebarToggleButton"
        @click="$emit('button-click', ToolbarActions.SidebarToggle)"
      />
      <int-button
        title="Export to PDF"
        icon="mdi-printer"
        @click="$emit('button-click', ToolbarActions.ExportToPDF)"
      />
      <int-toolbar-divider />
      <int-button
        title="Zoom In"
        icon="mdi-magnify-plus"
        @click="$emit('button-click', ToolbarActions.ZoomIn)"
      />
      <int-button
        title="Zoom Out"
        icon="mdi-magnify-minus"
        @click="$emit('button-click', ToolbarActions.ZoomOut)"
      />
      <int-button
        title="Reset Zoom"
        icon="mdi-refresh"
        @click="$emit('button-click', ToolbarActions.ResetZoom)"
      />
      <int-toolbar-divider />
      <int-button
        title="Fit to height"
        icon="mdi-arrow-expand-vertical"
        @click="$emit('button-click', ToolbarActions.FitToHeight)"
      />
      <int-toolbar-divider />
      <int-button
        title="Curve/Track Drag'n'Drop Mode"
        icon="mdi-swap-horizontal-bold"
        :active="isToolActive(Tools.CurveDragAndDrop)"
        @click="$emit('button-click', ToolbarActions.CurveDragAndDrop)"
      />
      <int-toolbar-divider />
      <int-menu
        title="Add Track"
        icon="mdi-menu"
      >
        <int-menu-item
          title="Linear"
          @click="$emit('button-click', ToolbarActions.AddTrack, 'linear')"
        />
        <int-menu-item
          title="Index"
          @click="$emit('button-click', ToolbarActions.AddTrack, 'index')"
        />
        <int-menu-item
          title="Logarithmic"
          @click="$emit('button-click', ToolbarActions.AddTrack, 'log')"
        />
        <int-menu-item
          title="Tangential"
          @click="$emit('button-click', ToolbarActions.AddTrack, 'tangential')"
        />
      </int-menu>
      <int-button
        title="Delete Selection"
        icon="mdi-window-close"
        :disabled="!isShapeSelected"
        @click="$emit('button-click', ToolbarActions.SelectionDelete)"
      />
      <int-button
        title="Show Properties"
        icon="mdi-wrench"
        :disabled="!isShapeSelected"
        @click="$emit('button-click', ToolbarActions.ShowProperties)"
      />
      <int-button
        title="Navigation Mode"
        icon="mdi-binoculars"
        :active="isNavigationMode"
        @click="$emit('button-click', ToolbarActions.NavigationToggle)"
      />
      <int-button
        title="Save Template"
        icon="mdi-file-export"
        @click="$emit('button-click', ToolbarActions.TemplateExport)"
      />
      <int-button
        title="Load Template from File"
        icon="mdi-file-download"
        @click="$emit('button-click', ToolbarActions.TemplateImport)"
      />
      <int-button
          title="Load LAS File from Server"
          icon="mdi-cloud-download"
          @click="$emit('button-click', ToolbarActions.LoadLasFileFromServer)"
      />
      <int-button
          title="Load Template File from Server"
          icon="mdi-download-box-outline"
          @click="$emit('button-click', ToolbarActions.LoadTemplateFileFromServer)"
      />
      <int-button
          title="Load Tops File from Server"
          icon="mdi-download-outline"
          @click="$emit('button-click', ToolbarActions.LoadTopsFileFromServer)"
      />
    </template>
  </int-toolbar>
</template>

<script>
import IntToolbar from 'common/IntToolbar.vue';
import IntToolbarDivider from 'common/IntToolbarDivider.vue';
import IntMenu from 'common/IntMenu.vue';
import IntMenuItem from 'common/IntMenuItem.vue';
import IntButton from 'common/IntButton.vue';
import ToolbarActions from './ToolbarActions';
import Tools from './Tools';
export default {
    name: 'IntWellLogToolbar',
    components: {IntToolbar, IntToolbarDivider, IntButton, IntMenu, IntMenuItem},
    props: {
        isHorizontalOrientation: {
            type: Boolean,
            default: false
        },
        isNavigationMode: {
            type: Boolean,
            default: false
        },
        isCursorTool: {
            type: Boolean,
            default: false
        },
        isShapeSelected: {
            type: Boolean,
            default: false
        },
        isSidebarOpened: {
            type: Boolean,
            default: false
        },
        activeTool: {
            type: String,
            default: null
        }
    },
    data () {
        return {ToolbarActions, Tools};
    },
    computed: {
        orientationIcon: function () {
            return this.isHorizontalOrientation ? 'mdi-arrow-left-right' : 'mdi-arrow-up-down';
        },
        sidebarToggleButton: function () {
            return this.isSidebarOpened ? 'mdi-chevron-down' : 'mdi-chevron-right';
        },
        sidebarToggleTitle: function () {
            return this.isSidebarOpened ? 'Close Sidebar' : 'Open Sidebar';
        }
    },
    methods: {
        isToolActive (name) {
            return this.activeTool === name;
        }
    }

};
</script>

<style scoped>

</style>
