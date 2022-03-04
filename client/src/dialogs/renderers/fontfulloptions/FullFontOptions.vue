<template>
  <v-row>
    <v-col>
      <IntFontSize
        :font-size="fontSize"
        @change="updateFontSize"
      />
      <IntFontMenu
        :font-name="fontFamily"
        @change="updateFontFamily"
      />
      <IntTextBaseline
        :baseline="baseline"
        @change="updateBaseline"
      />
    </v-col>
    <v-col>
      <v-row>
        <v-container>
          <TextColor
            :value="textColor"
            @input="updateTextColor"
          />
          <FontAttributes
            :font-weight="fontWeight"
            :font-style="fontStyle"
            :underline="underline"
            :strikethrough="strikethrough"
            @font-weight:updated="updateFontWeight"
            @font-style:updated="updateFontStyle"
            @underline:updated="updateUnderline"
            @strikethrough:updated="updateStrikethrough"
          />
          <TextAlignment
            :value="alignment"
            @change="updateAlignment"
          />
        </v-container>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import IntFontMenu from 'common/IntFontMenu.vue';
import IntFontSize from 'common/IntFontSize.vue';
import IntTextBaseline from 'common/IntTextBaseline.vue';
import TextColor from './TextColor.vue';
import TextAlignment from './TextAlignment.vue';
import FontAttributes from './FontAttributes.vue';

import {TextStyle} from '@int/geotoolkit/attributes/TextStyle';
import {Patterns as LinePatterns} from '@int/geotoolkit/attributes/LineStyle';

const DEFAULT_TEXT_STYLE = new TextStyle();

export default {
    name: 'FullFontOptions',
    components: {IntFontMenu, IntFontSize, IntTextBaseline, TextColor, TextAlignment, FontAttributes},
    props: {
        props: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            textStyle: null,

            // font attributes
            textColor: 'black',
            fontWeight: 'normal',
            fontStyle: 'normal',
            fontSize: null,
            fontFamily: null,
            alignment: null,
            baseline: null,

            // text decorations
            underline: null,
            strikethrough: null
        };
    },
    watch: {
        props () {
            this.loadTextTextProperties();
            this.extractTextStyle(this.textStyle);
        }
    },
    mounted () {
        this.loadTextTextProperties();
        this.extractTextStyle(this.textStyle);
    },
    methods: {
        loadTextTextProperties () {
            if (this.textStyle == null) {
                const data = this.props['data'];
                if (
                    data.strikethrough !== undefined &&
                    data.strikethrough.pattern !== undefined &&
                    typeof data.strikethrough.pattern === 'string'
                ) {
                    data.strikethrough.pattern = LinePatterns[data.strikethrough.pattern];
                }
                if (
                    data.underline !== undefined &&
                    data.underline.pattern !== undefined &&
                    typeof data.underline.pattern === 'string'
                ) {
                    data.underline.pattern = LinePatterns[data.underline.pattern];
                }
                this.textStyle = TextStyle.fromObject(this.props['data'] || DEFAULT_TEXT_STYLE);
            }
        },
        extractTextStyle (textStyle) {
            const processedFont = textStyle.getProcessedFont();
            this.textColor = textStyle.getColor();
            this.fontFamily = processedFont['fontfamily'];
            this.fontSize = this.extractFontSizeAsInt(processedFont['fontsize']);
            this.fontWeight = processedFont['fontweight'];
            this.fontStyle = processedFont['fontstyle'];
            this.alignment = textStyle.getAlignment();
            this.baseline = textStyle.getBaseLine();
            this.underline = textStyle.getUnderline();
            this.strikethrough = textStyle.getStrikethrough();
        },
        extractFontSizeAsInt (fontSizeString) {
            // use array destructuring to pull out first match
            const [fontSizeNoUnit] = fontSizeString.match(/\d+/g);
            return parseInt(fontSizeNoUnit);
        },
        updateFontSize (fontSize) {
            this.fontSize = fontSize;
            this.textStyle.setFontSize(fontSize + 'px');
            this.handleTextStyleChanged();
        },
        updateFontFamily (fontFamily) {
            this.fontFamily = fontFamily;
            this.textStyle.setFontFamily(fontFamily);
            this.handleTextStyleChanged();
        },
        updateAlignment (alignment) {
            this.alignment = alignment;
            this.textStyle.setAlignment(alignment);
            this.handleTextStyleChanged();
        },
        updateBaseline (baseline) {
            this.baseline = baseline;
            this.textStyle.setBaseLine(baseline);
            this.handleTextStyleChanged();
        },
        updateTextColor (color) {
            this.textColor = color;
            this.textStyle.setColor(color);
            this.handleTextStyleChanged();
        },
        updateFontWeight (fontWeight) {
            this.fontWeight = fontWeight;
            this.textStyle.setFontWeight(fontWeight);
            this.handleTextStyleChanged();
        },
        updateFontStyle (italic) {
            this.italic = italic;
            this.textStyle.setFontStyle(italic);
            this.handleTextStyleChanged();
        },
        updateUnderline (underline) {
            this.underline = underline;
            this.textStyle.setUnderline(underline);
            this.handleTextStyleChanged();
        },
        updateStrikethrough (strikethrough) {
            this.strikethrough = strikethrough;
            this.textStyle.setStrikethrough(strikethrough);
            this.handleTextStyleChanged();
        },
        handleTextStyleChanged () {
            this.props['handleChange'](
                this.props['path'],
                this.textStyle
            );
        }
    }
};
</script>

<style scoped>
  >>>.v-input__slot {
    background-color: white;
  }
</style>
