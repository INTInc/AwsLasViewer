import {MementoDeserializationContext} from '@int/geotoolkit/persistence/MementoDeserializationContext';
import {MementoSerializationContext} from '@int/geotoolkit/persistence/MementoSerializationContext';
import {CirclePainter} from '@int/geotoolkit/scene/shapes/painters/CirclePainter';
import {CrossPainter} from '@int/geotoolkit/scene/shapes/painters/CrossPainter';
import {DiamondPainter} from '@int/geotoolkit/scene/shapes/painters/DiamondPainter';
import {PlusBarPainter} from '@int/geotoolkit/scene/shapes/painters/PlusBarPainter';
import {PlusPainter} from '@int/geotoolkit/scene/shapes/painters/PlusPainter';
import {SquarePainter} from '@int/geotoolkit/scene/shapes/painters/SquarePainter';
import {StarPainter} from '@int/geotoolkit/scene/shapes/painters/StarPainter';
import {TrianglePainter} from '@int/geotoolkit/scene/shapes/painters/TrianglePainter';
import {SymbolShape} from '@int/geotoolkit/scene/shapes/SymbolShape';
import {CompositeLogCurve} from '@int/geotoolkit/welllog/CompositeLogCurve';
import {LogCurve} from '@int/geotoolkit/welllog/LogCurve';
import {Log2DVisual} from '@int/geotoolkit/welllog/Log2DVisual';
import {LogMarker} from '@int/geotoolkit/welllog/LogMarker';
import {LogTrackVisualHeader} from '@int/geotoolkit/welllog/header/LogTrackVisualHeader';
import {LogAxisVisualHeader} from '@int/geotoolkit/welllog/header/LogAxisVisualHeader';

import {TrackType} from '@int/geotoolkit/welllog/TrackType';
import {HoldTitle} from '@int/geotoolkit/welllog/header/HoldTitle';
import {UIRegistry as WellLogRegistry} from '@int/geotoolkit/welllog/widgets/persistence/UIRegistry';
import {UIRegistry} from '@int/geotoolkit/persistence/UIRegistry';
import {KnownScales} from '@int/geotoolkit/util/ColorProvider';
import cloneDeep from 'lodash/cloneDeep';
import {createAjv as create} from '@jsonforms/core';
import set from 'lodash/set';
import schemas from '@int/geotoolkit/resources/schema';
import {FILL_PATTERNS} from './uischemas';
import {Annotation} from '@int/geotoolkit/widgets/overlays/Annotation';
import {isInstanceOf} from '@int/geotoolkit/base';
import {Node} from '@int/geotoolkit/scene/Node';

const painterLabels = {
    [SquarePainter.getClassName()]: 'Square',
    [CirclePainter.getClassName()]: 'Circle',
    [TrianglePainter.getClassName()]: 'Triangle',
    [DiamondPainter.getClassName()]: 'Diamond',
    [StarPainter.getClassName()]: 'Asterisk',
    [PlusPainter.getClassName()]: 'Plus',
    [PlusBarPainter.getClassName()]: 'Plus bar',
    [CrossPainter.getClassName()]: 'Cross'
};

function modify (schema, patch) {
    for (const id in patch) {
        if (schema['id'] === id || schema['$id'] === id) {
            for (const key in patch[id]) {
                const value = patch[id][key];
                if (value != null) {
                    set(schema, key, value);
                } else {
                    delete schema[key];
                }
            }
        }
    }
    for (const key in schema) {
        if (typeof schema[key] === 'object' && schema[key] != null) {
            schema[key] = modify(schema[key], patch);
        }
    }
    return schema;
}

function createAjv (patch) {
    let schema = JSON.parse(JSON.stringify(schemas));
    patch = JSON.parse(JSON.stringify(patch));
    if (patch) {
        schema = modify(schema, patch);
    }
    const ajv = create({
        multipleOfPrecision: 3,
        addUsedSchema: false
    });
    ajv.addFormat('color', /^((0x){0,1}|#{0,1})([0-9A-F]{8}|[0-9A-F]{6})$/i);
    ajv.addSchema(Object.freeze(schema));
    return ajv;
}

const getAjv = function () {
    return createAjv({
        '/geotoolkit.scene.shapes.AnchoredShape/properties/width': {
            'minimum': 2,
            'maximum': 15,
            'default': 5
        },
        '/geotoolkit.attributes.LineStyle/properties/width': {
            'minimum': 0,
            'maximum': 5,
            'default': 0
        },
        '/geotoolkit.attributes.FillStyle/properties/pattern': {
            'type': 'string',
            'enum': Object.keys(FILL_PATTERNS),
            'oneOf': null
        },
        '/geotoolkit.welllog.LogCurve/properties/microposleft': {
            'minimum': 0,
            'maximum': 100
        },
        '/geotoolkit.welllog.LogCurve/properties/microposright': {
            'minimum': 0,
            'maximum': 100
        },
        '/geotoolkit.welllog.Log2DVisual/properties/microposleft': {
            'minimum': 0,
            'maximum': 100
        },
        '/geotoolkit.welllog.Log2DVisual/properties/microposright': {
            'minimum': 0,
            'maximum': 100
        },
        '/geotoolkit.welllog.Log2DVisual/properties/offsets': {
            'type': 'number',
            'minimum': 0,
            'maximum': 360,
            'default': 0,
            'multipleOf': 1
        },
        '/geotoolkit.util.DefaultColorProvider/properties/scale': {
            'type': 'string',
            'enum': Object.values(KnownScales)
        },
        '/geotoolkit.scene.shapes.SymbolShape/properties/painter': {
            'enum': Object.values(painterLabels)
        },
        '/geotoolkit.welllog.LogCurve/properties/interpolationtype': {
            'enum': ['Linear', 'Start Step', 'Middle Step', 'End Step']
        },
        '/geotoolkit.welllog.CompositeLogCurve/properties/calculated': {
            'properties': {
                'rightfill': {
                    'type': 'object',
                    'properties': {
                        'refLine': {
                            'type': 'string'
                        },
                        'baseLineValue': {
                            'type': 'number',
                            'minimum': 0,
                            'maximum': 1,
                            'default': 0,
                            'multipleOf': 0.05
                        }
                    }
                },
                'leftfill': {
                    'type': 'object',
                    'properties': {
                        'refLine': {
                            'type': 'string'
                        },
                        'baseLineValue': {
                            'type': 'number',
                            'minimum': 0,
                            'maximum': 1,
                            'default': 0,
                            'multipleOf': 0.05
                        }
                    }
                },
                'markerVisible': {
                    'type': 'boolean'
                },
                'autoScaling': {
                    'type': 'boolean'
                },
                'limits': {
                    'type': 'object',
                    'properties': {
                        'from': {
                            'type': 'number'
                        },
                        'to': {
                            'type': 'number'
                        }
                    }
                }
            }
        },
        '/geotoolkit.welllog.LogTrack/properties/calculated': {
            'properties': {
                'general': {
                    'type': 'object',
                    'properties': {
                        'tracktype': {
                            'type': 'string',
                            'enum': [TrackType.LinearTrack, TrackType.LogTrack, TrackType.TangentialTrack]
                        },
                        'verticalmajorcount': {
                            'type': 'integer'
                        },
                        'verticalminorcount': {
                            'type': 'integer'
                        },
                        'verticaldecade': {
                            'type': 'integer'
                        },
                        'horizontalmajoraxiscolor': {
                            'type': 'string',
                            'format': 'color'
                        },
                        'horizontalminoraxiscolor': {
                            'type': 'string',
                            'format': 'color'
                        },
                        'verticalmajoraxiscolor': {
                            'type': 'string',
                            'format': 'color'
                        },
                        'verticalminoraxiscolor': {
                            'type': 'string',
                            'format': 'color'
                        }
                    }
                },
                'title': {
                    'type': 'object',
                    'properties': {
                        'visible': {
                            'type': 'boolean'
                        },
                        'title': {
                            'type': 'string'
                        },
                        'holdtitle': {
                            'type': 'string',
                            'enum': [HoldTitle.None, HoldTitle.Top, HoldTitle.Bottom]
                        },
                        'automultiplelines': {
                            'type': 'boolean'
                        },
                        'autotitlerotation': {
                            'type': 'boolean'
                        },
                        'rotationangle': {
                            'type': 'number',
                            'minimum': 0,
                            'maximum': 360,
                            'default': 0
                        }
                    }
                }
            }
        }
    });
};

const registry = new UIRegistry();
WellLogRegistry.register(registry);

const getNodeProps = function (node, schema) {
    if (node instanceof LogCurve && !node.getSymbol()) {
        node.setSymbol(new SymbolShape({
            'width': 10,
            'height': 10,
            'linestyle': 'black',
            'fillstyle': 'black'
        })); // fill properties with defaults
    }
    const context = new MementoSerializationContext(null, registry);
    context.setObject(node);
    const props = context.getMemento();
    if (node instanceof CompositeLogCurve) {
        props.microposleft = Math.ceil(props.microposleft * 100);
        props.microposright = Math.ceil(props.microposright * 100);
        schema.allOf[1].properties.calculated.properties.leftfill.properties.refLine.enum = props.calculated.leftfill.enum;
        schema.allOf[1].properties.calculated.properties.rightfill.properties.refLine.enum = props.calculated.rightfill.enum;
        props.symbol.painter = painterLabels[props.symbol.painter];
        props.interpolationtype = props.interpolationtype.replace(/([a-z])([A-Z])/g, '$1 $2');
        return props;
    }
    if (node instanceof Log2DVisual) {
        props.minangle = +props.minangle.toFixed(2);
        props.maxangle = +props.maxangle.toFixed(2);
        props.microposleft = Math.ceil(props.microposleft * 100);
        props.microposright = Math.ceil(props.microposright * 100);
        props.offsets = Math.ceil(props.offsets * 180 / Math.PI);
        return props;
    }
    if (node instanceof LogMarker) {
        props.linedecoration = props.linedecoration ? node.getLineDecoration().getName() : 'solid';
        return props;
    }
    if (isInstanceOf(node, Annotation)) {
        const options = node.getProperties();
        const textStyle = options['textstyle'];

        props.textstyle.alignment = textStyle.getAlignment();
        props.textstyle.baseline = textStyle.getBaseLine();
        props.textstyle.multiline = textStyle.getMultiLine();
    }
    if (node instanceof LogTrackVisualHeader ||
        node instanceof LogAxisVisualHeader) {
        props.labelrotationangle = Math.ceil(props.labelrotationangle * 180 / Math.PI);
    }
    return props;
};

const setNodeProps = function (node, props) {
    props = cloneDeep(props);
    if (node instanceof CompositeLogCurve) {
        props.microposleft = props.microposleft / 100;
        props.microposright = props.microposright / 100;
        let index = Object.values(painterLabels).findIndex((x) => x === props.symbol.painter);
        if (index === -1) {
            index = 0;
        }
        props.symbol.painter = Object.keys(painterLabels)[index];
        props.symbol.height = props.symbol.width; // we have to change both dimensions
        props.interpolationtype = props.interpolationtype.replace(' ', '');
    } else if (node instanceof Log2DVisual) {
        props.microposleft = props.microposleft / 100;
        props.microposright = props.microposright / 100;
        props.offsets = props.offsets / 180 * Math.PI;
    } else if (isInstanceOf(node, Annotation)) {
        props.linestyle.width = props.linestyle.width + 'px';
    }
    if (node instanceof LogTrackVisualHeader ||
        node instanceof LogAxisVisualHeader) {
        props.labelrotationangle = props.labelrotationangle / 180 * Math.PI;
    }

    const context = new MementoDeserializationContext(props, registry);
    const deserializer = context.getRegistry().getSerializer(node.getClassName());
    if (deserializer != null) {
        deserializer.load(context, node);
        if (isInstanceOf(node, Node)) {
            node.invalidate();
        }
    }
};

export {getNodeProps, setNodeProps, getAjv};
