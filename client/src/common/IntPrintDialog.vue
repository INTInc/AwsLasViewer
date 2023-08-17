<template>
  <v-dialog
    v-model="showDialog"
    max-width="600px"
    persistent
    style="z-index: 1005;"
    @keydown.esc="onClose"
  >
    <v-card
      min-height="600px"
      class="d-flex flex-column"
    >
      <v-card-title
        class="headline"
      >
        {{ title }}
      </v-card-title>
      <v-card-text>
        <v-container>
          <json-forms
            :schema="schema"
            :uischema="uischema"
            :data="dialogData"
            :renderers="materialRenderers"
            :on-change="onChange"
          />
          <slot />
        </v-container>
      </v-card-text>
      <v-spacer />
      <int-loader
        v-if="exportPending"
        label="Exporting..."
        style="margin: auto"
      />
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          :disabled="exportPending || errors"
          @click="onExport"
        >
          Export
        </v-btn>
        <v-btn
          text
          :disabled="exportPending"
          @click="onClose"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>

import {PaperFormatFactory} from '@int/geotoolkit/scene/exports/PaperFormatFactory.js';
import {PaperOrientation} from '@int/geotoolkit/scene/exports/PaperOrientation.js';
import {ScalingOptions} from '@int/geotoolkit/scene/exports/ScalingOptions.js';

import {VContainer, VDialog} from 'vuetify/lib';
import {materialRenderers} from 'jsonforms-vue-material';
import {JsonForms} from 'jsonforms-vue';

import IntLoader from './IntLoader.vue';
import {schema, uischema} from './IntPrintDialogSchemas';

export default {
    name: 'PrintDialog',
    components: {VDialog, VContainer, JsonForms, IntLoader},
    props: {
        showDialog: {
            type: Boolean,
            default: false
        },
        exportPending: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: 'Export to PDF'
        },
        paperFormat: {
            type: String,
            default: 'Letter'
        },
        orientation: {
            type: String,
            default: PaperOrientation.Portrait
        },
        top: {
            type: [Number, String],
            default: 1
        },
        bottom: {
            type: [Number, String],
            default: 1
        },
        left: {
            type: [Number, String],
            default: 0.5
        },
        right: {
            type: [Number, String],
            default: 0.5
        },
        keepAspectRatio: {
            type: [Boolean, String],
            default: false
        },
        scaling: {
            type: [String],
            default: ScalingOptions.AsIs
        },
        continuous: {
            type: [Boolean, String],
            default: false
        },
        drawWestToEast: {
            type: [Boolean, String],
            default: false
        },
        units: {
            type: String,
            default: 'cm'
        }
    },
    data () {
        return {
            schema: null,
            uischema: null,
            materialRenderers: Object.freeze(materialRenderers),
            ajv: null,
            papers: [],
            dialogData: {},
            errors: false
        };
    },
    created () {
        this.schema = schema;
        this.uischema = uischema;
        this.papers = PaperFormatFactory.getInstance();
        this.dialogData = {
            'paperFormat': this.paperFormat,
            'orientation': this.orientation,
            'top': Number(this.top),
            'bottom': Number(this.bottom),
            'left': Number(this.left),
            'right': Number(this.right),
            'scaling': this.scaling,
            'keepAspectRatio': this.keepAspectRatio === 'true' || this.keepAspectRatio,
            'continuous': this.continuous === 'true' || this.continuous,
            'units': this.units,
            'drawWestToEast': this.drawWestToEast === 'true' || this.drawWestToEast,
            'width': 10,
            'height': 15
        };
    },
    methods: {
        getPaper () {
            const {paperFormat, units, orientation} = this.dialogData;
            return this.papers.getPaper(paperFormat, units, orientation);
        },
        onChange (value) {
            this.errors = value.errors.length > 0;
            if (this.errors) return;
            this.dialogData = value.data;
            const paper = this.getPaper();
            this.$set(this.dialogData, 'width', +paper.getWidth().toFixed('1'));
            this.$set(this.dialogData, 'height', +paper.getHeight().toFixed('1'));
        },
        onExport () {
            const settings = {
                ...this.dialogData,
                'paperFormat': this.getPaper()
            };
            this.$emit('save', {'printSettings': settings});
        },
        onClose () {
            this.$emit('close');
        }
    }
};
</script>

