<template>
  <div style="user-select: none;">
    <int-well-log-toolbar
      :is-horizontal-orientation="isHorizontalOrientation"
      :is-navigation-mode="isNavigationMode"
      :is-shape-selected="isShapeSelected"
      :is-sidebar-opened="sidebarIsDisplayed"
      :active-tool="activeTool"
      @button-click="onButtonClick(...arguments)"
    />
    <int-content id="content">
      <int-sidebar
        v-if="sidebarIsDisplayed"
        width="200px"
        closable
        @close="sidebarIsDisplayed = false"
      >
        <template v-slot:default>
          <div id="curvesSideBar">
            <int-list>
              <draggable
                :list="curvesList"
                @move="drag"
                @start="startDrag"
                @end="endDrag"
              >
                <int-list-item
                  v-for="(curve, index) in curvesList"
                  :key="index"
                  :title="curve.name"
                  icon="mdi-chart-bell-curve-cumulative"
                  @click="toggleCurveSelect(index)"
                />
              </draggable>
            </int-list>
          </div>
        </template>
      </int-sidebar>
      <int-plot-host
        ref="host"
        @dragover="drag"
      >
        <int-context-menu :visible="isShapeSelected">
          <template v-slot:canvas>
            <int-plot ref="plot" />
          </template>
          <template v-slot:list>
            <int-well-log-context-menu @button-click="onButtonClick(...arguments)" />
          </template>
        </int-context-menu>
      </int-plot-host>
    </int-content>
    <div
      id="contextMenu"
      class="dropdown clearfix"
    />

    <int-print-dialog
      :show-dialog="showExportDialog"
      @save="exportToPdf"
      @close="showExportDialog = false"
    />
    <v-dialog
      v-model="propertiesDialogActive"
      max-width="600px"
      persistent
      style="z-index: 1005;"
      @keydown.esc="closePropertiesDialog()"
    >
      <v-card
        min-height="680px"
        class="d-flex flex-column"
      >
        <v-card-title
          class="headline pb-0"
        >
          {{ title }}
        </v-card-title>
        <v-card-text class="pb-0">
          <v-container>
            <JsonForms
              :schema="schema"
              :ajv="ajv"
              :uischema="uischema"
              :data="propertiesDialogData"
              :renderers="renderers"
              :on-change="onChange"
            />
          </v-container>
        </v-card-text>
        <v-spacer />
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="closePropertiesDialog()"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <int-snackbar
      v-model="warningDialog"
      :message="warningMessage"
    />
    <input
      id="tpl"
      ref="tpl"
      type="file"
      style="position: absolute; visibility: hidden;"
      accept=".json"
    >
  </div>
</template>

<script>

import {LogDisplay} from './App';
import {AwsLasSource} from './data/awslassource';

import IntPlotHost from 'common/IntPlotHost.vue';
import IntPlot from 'common/IntPlot.vue';
import IntContent from 'common/IntContent.vue';
import IntSidebar from 'common/IntSidebar.vue';
import IntList from 'common/IntList.vue';
import IntListItem from 'common/IntListItem.vue';
import IntContextMenu from 'common/IntContextMenu.vue';
import IntWellLogContextMenu from './IntWellLogContextMenu.vue';
import IntWellLogToolbar from './IntWellLogToolbar.vue';
import ToolbarActions from './ToolbarActions';
import VisualZIndexDirections from './VisualZIndexDirections';
import Tools from './Tools';
import draggable from 'vuedraggable';
import {materialRenderers} from 'jsonforms-vue-material';
import {JsonForms} from 'jsonforms-vue';
import {uischemas} from './dialogs/uischemas.js';

import IntPrintDialog from 'common/IntPrintDialog.vue';
import {setNodeProps, getNodeProps, getAjv} from './dialogs/DialogPropertyUtils.js';
import defaultRenderers from './dialogs/renderers/defaultRenderers.js';
import IntSnackbar from 'common/IntSnackbar.vue';

let wellLogWidget, currentNode;
export default {
    name: 'LogViewer',
    components: {
        IntPrintDialog,
        draggable,
        JsonForms,
        IntWellLogToolbar, IntPlotHost, IntPlot, IntList, IntListItem,
        IntSidebar, IntContent, IntContextMenu, IntWellLogContextMenu,
        IntSnackbar
    },
    data () {
        return {
            sidebarIsDisplayed: false,
            propertiesDialogData: null,
            curvesList: [],
            navigationMode: true,
            warningMessage: null,
            warningDialog: false,
            sidebarTopOffset: 90,
            propertiesDialogActive: false,
            schema: null,
            uischema: null,
            renderers: Object.freeze([...materialRenderers, ...defaultRenderers]),
            ajv: null,
            title: '',
            isShapeSelected: false,
            isNavigationMode: true,
            isHorizontalOrientation: false,
            activeTool: null,
            showExportDialog: false
        };
    },
    computed: {
        isDragAndDropMode: function () {
            return this.activeTool === Tools.CurveDragAndDrop;
        }
    },
    created () {
        this.componentDidResize = false;
    },
    destroyed () {
        wellLogWidget.dispose();
        window.removeEventListener('resize', this.resize);
    },
    updated () {
        if (!this.componentDidResize) {
            this.resize();
            this.componentDidResize = true;
        }
    },
    mounted () {
        window.addEventListener('resize', this.resize);
        AwsLasSource.create('by11.las').then((data) => {
            wellLogWidget = new LogDisplay({
                'data': data,
                'host': this.$refs.host.native,
                'canvas': this.$refs.plot.native,
                'tooltip': this.$refs.tooltipContainer,
                'template': this.$refs.tpl
            }).setToolDoubleClickCallback('pick', this.showPropertiesDialogForSelection);
            this.sidebarTopOffset = new URL(window.location.href).searchParams.get('collapsed') ? 90 : 180;
            this.curvesList = wellLogWidget.getCurvesList();
            this.resize();
            wellLogWidget.onSelect(() => {
                this.isShapeSelected = true;
            });
            wellLogWidget.onEmptySelect(() => {
                this.isShapeSelected = false;
            });
        }, (error) => {

        });
    },
    methods: {
        onButtonClick: function (event, value) {
            switch (event) {
                case ToolbarActions.SidebarToggle:
                    this.sidebarIsDisplayed = !this.sidebarIsDisplayed;
                    // TODO: temp, figure out why transitionend on sidebar is not working
                    setTimeout( () => {
                        this.resize();
                    }, 200);
                    break;
                case ToolbarActions.ExportToPDF:
                    this.openPrintDialog();
                    break;
                case ToolbarActions.ZoomIn:
                    this.zoomIn();
                    break;
                case ToolbarActions.ZoomOut:
                    this.zoomOut();
                    break;
                case ToolbarActions.ResetZoom:
                    this.zoomReset();
                    break;
                case ToolbarActions.FitToHeight:
                    this.fitToHeight();
                    break;
                case ToolbarActions.AddTrack:
                    this.addTrack(value);
                    break;
                case ToolbarActions.CurveDragAndDrop:
                    this.disableAllTools();
                    this.activeTool = this.isDragAndDropMode ? null : Tools.CurveDragAndDrop;
                    this.setDragAndDropTool(this.isDragAndDropMode);
                    break;
                case ToolbarActions.SelectionDelete:
                    this.deleteSelection();
                    break;
                case ToolbarActions.ShowProperties:
                    this.showProperties();
                    break;
                case ToolbarActions.NavigationToggle:
                    this.isNavigationMode = !this.isNavigationMode;
                    this.toggleNavigation();
                    break;
                case ToolbarActions.TemplateExport:
                    this.saveTemplateToFile();
                    break;
                case ToolbarActions.TemplateImport:
                    this.loadTemplateFromFile();
                    break;
                case ToolbarActions.MoveVisualUp:
                    this.changeVisualZIndex(VisualZIndexDirections.Up);
                    break;
                case ToolbarActions.MoveVisualDown:
                    this.changeVisualZIndex(VisualZIndexDirections.Down);
                    break;
                case ToolbarActions.MoveVisualTop:
                    this.changeVisualZIndex(VisualZIndexDirections.Top);
                    break;
                case ToolbarActions.MoveVisualBottom:
                    this.changeVisualZIndex(VisualZIndexDirections.Bottom);
                    break;
            }
        },
        disableAllTools: function () {
            this.toggleAnnotationTool(false);
            this.setDragAndDropTool(false);
        },
        onChange: function (value) {
            if (!this.propertiesDialogActive || value.errors.length > 0) return;
            setNodeProps(currentNode, value.data);
            this.propertiesDialogData = getNodeProps(currentNode, this.schema);
            wellLogWidget.buildDocumentView();
        },
        showPropertiesDialogForSelection: function (selection) {
            currentNode = wellLogWidget.getSelectedVisual(selection);
            if (currentNode == null) return;
            this.ajv = getAjv();
            this.schema = Object.freeze(this.ajv.getSchema('/' + currentNode.getClassName()).schema);
            this.uischema = Object.freeze(uischemas[currentNode.getClassName()]);
            this.title = wellLogWidget.getPropertyDialogName(currentNode);
            wellLogWidget.savePseudoClasses(currentNode);
            this.propertiesDialogData = getNodeProps(currentNode, this.schema);
            this.propertiesDialogActive = true;
        },
        closePropertiesDialog: function () {
            this.propertiesDialogActive = false;
            wellLogWidget.restorePseudoClasses(currentNode);
        },
        resize: function () {
            if (wellLogWidget) {
                wellLogWidget.resize();
                this.componentDidResize = false;
                this.$forceUpdate();
            }
        },
        addTrack: function (type) {
            wellLogWidget.addTrack(type);
            return null;
        },
        deleteSelection: function () {
            if (wellLogWidget.getSelectedTrackCount()) {
                wellLogWidget.deleteSelection();
            } else {
                this.showWarningDialog('You must select curve, track or index');
            }
        },
        setDragAndDropTool: function (enabled) {
            wellLogWidget.setDragAndDrop(enabled);
        },
        toggleAnnotationTool: function (enabled) {
            wellLogWidget.toggleAnnotationTool(enabled);
        },
        zoomIn: function () {
            wellLogWidget.zoomIn();
        },
        zoomOut: function () {
            wellLogWidget.zoomOut();
        },
        zoomReset: function () {
            wellLogWidget.zoomReset();
        },
        fitToHeight: function () {
            wellLogWidget.fitToHeight();
        },
        openPrintDialog: function () {
            this.showExportDialog = true;
        },
        exportToPdf: function (settings) {
            this.showExportDialog = false;
            const errorMessage = wellLogWidget.exportToPDF(settings);
            if (errorMessage) {
                this.showWarningDialog(errorMessage);
            }
        },
        showProperties: function () {
            const selection = wellLogWidget.getSelection();
            this.showPropertiesDialogForSelection(selection);
        },
        saveTemplateToFile: function () {
            wellLogWidget.saveTemplateToFile();
        },
        loadTemplateFromFile: function () {
            wellLogWidget.loadTemplateFromFile();
        },
        saveTemplateToLocalStorage: function () {
            wellLogWidget.saveTemplateToLocalStorage();
        },
        loadTemplateFromLocalStorage: function () {
            wellLogWidget.loadTemplateFromLocalStorage();
        },
        toggleNavigation: function () {
            this.navigationMode = !this.navigationMode;
            wellLogWidget.setNavigationVisible(this.navigationMode);
        },
        toggleDataTree: function () {
            this.sidebarIsDisplayed = !this.sidebarIsDisplayed;
            wellLogWidget.setSidebarVisible(this.sidebarIsDisplayed);
        },
        updateCurvesList: function () {
            this.curvesList = wellLogWidget.getCurvesList();
        },
        startDrag: function (index) {
            wellLogWidget.startDrag(index);
        },
        endDrag: function (event) {
            wellLogWidget.endDrag(event);
            this.updateCurvesList();
        },
        drag: function (event) {
            if (!event) return;
            wellLogWidget.drag(event);
            event.preventDefault();
        },
        toggleCurveSelect: function (index) {
            wellLogWidget.toggleCurveSelect(index);
            this.updateCurvesList();
        },
        changeVisualZIndex: function (direction) {
            wellLogWidget.moveSelectedVisual(direction);
        },
        showWarningDialog (message) {
            this.warningMessage = message;
            this.warningDialog = true;
        }
    }
};
</script>

<style>
    #curvesSideBar {
        position: absolute;
        background: rgba(248, 248, 248, 1.0);
        left: 0px;
        top: 3px;
        bottom: 260px;
        width: 200px;
        overflow: auto;
        border-color: #e7e7e7;
        border-radius: 4px;
    }
    .cg-tooltip-symbol {
      border-radius: 4px;
      margin-right: 5px;
      height: 8px;
      width: 8px;
      display: inline-block;
    }

    .cg-tooltip-container {
      position: absolute;
      padding: 2px 12px 3px 7px;
      border: solid 1px #AFB0B0;
      border-radius: 2px;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      margin-left: 5px;
      background: white !important;
      opacity: 0.9;
      text-align: left;
      color: #252525 !important;
      font-family: Roboto, Helvetica, Arial, sans-serif;
      font-size: 13px;
    }
</style>
