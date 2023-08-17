import {PaperFormatFactory} from '@int/geotoolkit/scene/exports/PaperFormatFactory.js';
import {PaperOrientation} from '@int/geotoolkit/scene/exports/PaperOrientation.js';
import {ScalingOptions} from '@int/geotoolkit/scene/exports/ScalingOptions.js';

const paperFormats = PaperFormatFactory.getInstance().getPaperList();
const uints = ['cm', 'mm', 'px', 'inch'];
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
        },
        'scaling': {
            'type': 'string',
            'enum': Object.keys(ScalingOptions)
        },
        'keepAspectRatio': {
            'type': 'boolean'
        },
        'continuous': {
            'type': 'boolean'
        },
        'units': {
            'type': 'string',
            'enum': uints
        },
        'drawWestToEast': {
            'type': 'boolean'
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
                },
                {
                    'type': 'Control',
                    'label': 'Scaling',
                    'scope': '#/properties/scaling'
                }
            ]
        },
        {
            'type': 'HorizontalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'label': 'Keep proportions',
                    'scope': '#/properties/keepAspectRatio'
                },
                {
                    'type': 'Control',
                    'label': 'Continuous',
                    'scope': '#/properties/continuous'
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
                    'scope': '#/properties/units'
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
