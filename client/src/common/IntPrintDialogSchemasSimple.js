import {PaperFormatFactory} from '@int/geotoolkit/scene/exports/PaperFormatFactory.js';
import {PaperOrientation} from '@int/geotoolkit/scene/exports/PaperOrientation.js';

const paperFormats = PaperFormatFactory.getInstance().getPaperList();
const units = ['Centimeter', 'Millimeter', 'Pixel', 'Inch'];

const schema = {
    'additionalProperties': true,
    'description': 'Schema describing Export to PDF dialog',
    'title': 'Export to PDF',
    'type': 'object',
    'properties': {
        'paperFormat': {
            'type': 'string',
            'enum': paperFormats
        },
        'width': {
            'type': 'number'
        },
        'height': {
            'type': 'number'
        },
        'orientation': {
            'type': 'string',
            'enum': Object.keys(PaperOrientation)
        },
        'unit': {
            'type': 'string',
            'enum': units
        },
        'top': {
            'type': 'number'
        },
        'bottom': {
            'type': 'number'
        },
        'left': {
            'type': 'number'
        },
        'right': {
            'type': 'number'
        }
    }
};
const uischema = {
    'type': 'VerticalLayout',
    'elements': [
        {
            'type': 'Control',
            'label': 'Paper format',
            'scope': '#/properties/paperFormat'
        },
        {
            'type': 'HorizontalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'label': 'Width',
                    'scope': '#/properties/width',
                    'rule': {
                        'effect': 'ENABLE',
                        'condition': {
                            'scope': '#/properties/paperFormat',
                            'schema': {
                                'const': 'Custom'
                            }
                        }
                    }
                },
                {
                    'type': 'Control',
                    'label': 'Height',
                    'scope': '#/properties/height',
                    'rule': {
                        'effect': 'ENABLE',
                        'condition': {
                            'scope': '#/properties/paperFormat',
                            'schema': {
                                'const': 'Custom'
                            }
                        }
                    }
                }
            ]
        },
        {
            'type': 'HorizontalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'label': 'Orientation',
                    'scope': '#/properties/orientation'
                }
            ]
        },
        {
            'type': 'Group',
            'label': 'Margins',
            'elements': [
                {
                    'type': 'Control',
                    'label': 'Units',
                    'scope': '#/properties/unit'
                },
                {
                    'type': 'HorizontalLayout',
                    'elements': [
                        {
                            'type': 'Control',
                            'label': 'Top',
                            'scope': '#/properties/top'
                        },
                        {
                            'type': 'Control',
                            'label': 'Bottom',
                            'scope': '#/properties/bottom'
                        }
                    ]
                },
                {
                    'type': 'HorizontalLayout',
                    'elements': [
                        {
                            'type': 'Control',
                            'label': 'Left',
                            'scope': '#/properties/left'
                        },
                        {
                            'type': 'Control',
                            'label': 'Right',
                            'scope': '#/properties/right'
                        }
                    ]
                }
            ]
        }
    ]
};

export {schema, uischema};
