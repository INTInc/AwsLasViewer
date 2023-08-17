import {UnitFactory} from '@int/geotoolkit/util/UnitFactory';

export default {
    props: {
        value: {
            type: Number,
            default: 0
        },
        title: {
            type: String,
            default: null
        },
        icon: {
            type: String,
            default: null
        },
        measure: {
            type: String,
            default: null
        },
        measures: {
            type: Array,
            default: null
        },
        step: {
            type: Number,
            default: 1
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 9999
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        convertValueToNewMeasure (newMeasure: string) {
            return UnitFactory.getInstance().getUnit(this.measure).convert(this.value, newMeasure);
        }
    }
};
