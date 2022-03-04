import Vue from 'vue';
import {withJsonFormsControlProps} from 'jsonforms-vue';
import FontOptions from './FullFontOptions.vue';

const FontOptionsControl = Vue.component('FontOptions', {
    functional: true,
    render: function (createElement, context) {
        return createElement(FontOptions, context.data, context.children);
    }
});

export default withJsonFormsControlProps(FontOptionsControl);
