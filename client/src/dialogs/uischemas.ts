import {PatternFactory} from '@int/geotoolkit/attributes/PatternFactory';
import {LineStyle, Patterns as LineStylePatterns} from '@int/geotoolkit/attributes/LineStyle';
import {Line} from '@int/geotoolkit/scene/shapes/Line';
import {Point} from '@int/geotoolkit/util/Point.js';
import {NodeExport} from '@int/geotoolkit/scene/exports/NodeExport';
import {Rect} from '@int/geotoolkit/util/Rect';
import {CompositeLogCurve} from '@int/geotoolkit/welllog/CompositeLogCurve';
import {Log2DVisual} from '@int/geotoolkit/welllog/Log2DVisual';
import {LogAxisVisualHeader} from '@int/geotoolkit/welllog/header/LogAxisVisualHeader';
import {LogTrack} from '@int/geotoolkit/welllog/LogTrack';
import {LogMarker} from '@int/geotoolkit/welllog/LogMarker';
import {TrackType} from '@int/geotoolkit/welllog/TrackType';
import {KnownScales} from '@int/geotoolkit/util/ColorProvider';
import {DiscreteGradientColorProvider} from '@int/geotoolkit/util/DiscreteGradientColorProvider';
import {Annotation} from '@int/geotoolkit/widgets/overlays/Annotation';
import painterImages from './painterImages';

const generateLineStyleImage = (style: 'Solid' | 'Dash' | 'Dot' | 'DashDot' | 'ShortDash' | 'LongDash' | 'DashDotDot' | 'DashLongDash') => {
    const line = new Line({
        'from': new Point(2, 8),
        'to': new Point(130, 8)
    });
    line.setLineStyle(new LineStyle('#000000', 3).setPattern(LineStylePatterns[style]));
    return NodeExport.exportToImageUrl(line, 132, 16, false, false, new Rect(0, 0, 132, 16));
};

const generateLineDecorationImage = (style: string) => {
    const line = new Line({
        'from': new Point(2, 14),
        'to': new Point(130, 14)
    });
    line.setLineStyle(new LineStyle('#000000', 3)).setLineDecoration(style);
    return NodeExport.exportToImageUrl(line, 132, 28, false, false, new Rect(0, 0, 132, 28));
};

const FILL_PATTERNS = {
    None: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAUCAYAAABvecQxAAAACXBIWXMAAAsTAAALEwEA' +
        'mpwYAAAAI0lEQVRo3u3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAA4NMALvQAAcBp9gUAAAAASUVORK5CYII=',
    Slashes: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAQCAYAAADeWHeIAAAACXBIWXMAAAsTAAALE' +
        'wEAmpwYAAAAB3RJTUUH3QMLExQSMaLjtAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAQ' +
        'ElEQVRo3u3YoQ0AMAzEQO+/dDpEUKozN3hHKmjVtIN/2xeBLwJfBL4IfBH4AOB55BvPN55vPF88x+f7DwDwHw/QIl+hx' +
        'bQizgAAAABJRU5ErkJggg==',
    Carets: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAQCAYAAADeWHeIAAAACXBIWXMAAAsTAAALEw' +
        'EAmpwYAAAAB3RJTUUH3QMLEjoOL2bc4AAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAi0' +
        'lEQVRo3u3Yuw7AIAxDUTv//8/pVKn0MUAXotzOHJUhwmBnpiTJdmamtfjha/q4Ytv55+f4et6ShsmZnaT7enwxf0bAyn' +
        'HytQ5fx78OADnZxwc52dvH7OSsbAK/r4+VY2NmE/i9/XAHICP7+SAje/sgI3v7RxHEW7qZpwegByAj6QHISHoA3tEt/Q' +
        'E3/yx0VeBQeAAAAABJRU5ErkJggg==',
    SlantedBricks: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAQCAYAAADeWHeIAAAACXBIWXMAAAs' +
        'TAAALEwEAmpwYAAAAB3RJTUUH3QMLEyMJK8CKbAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmU' +
        'HAAAAYklEQVRo3u2YMQ7AQAjDkvv/n9O9U3VTJTu7FwQG0W35mrbb1lxG/n/8sXhs/sSg0ySzDOAGeN8AqpLFuwLgOU4' +
        'Pm9cAGsDYAOoTy2sA/wD+AfwDqEos7wrwCHR6yLwGgOcBOnvrEXE9DjwAAAAASUVORK5CYII=',
    Bricks: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAQCAYAAADeWHeIAAAACXBIWXMAAAsTAAALEw' +
        'EAmpwYAAAAB3RJTUUH3QMLEycezH/KrwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAWE' +
        'lEQVRo3u3YMQrAMAwDQLv//7OyZiydCrrbtQSBHW+SeWt3k2TnI/n/5Z+hmgKU25mJZyguwL0DmJF9eSPADoACoAAoAA' +
        'qAOwC9dwD/5L68EWAHQAGodQBBP2sRRcxVCAAAAABJRU5ErkJggg==',
    Dots: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAQCAYAAADeWHeIAAAACXBIWXMAAAsTAAALEwEA' +
        'mpwYAAAAB3RJTUUH3QMLEzszb9fLhwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAQklE' +
        'QVRo3u3VMREAAAjDQPybLgY4BMBnT8e0ChgI/7W/Dof/1ofc8+WeL/dwGfxrvmRKPiCXfLnkQ/L5ki95fNymAfsld4mS' +
        'pFpOAAAAAElFTkSuQmCC',
    Squiggles: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAQCAYAAADeWHeIAAAACXBIWXMAAAsTAAA' +
        'LEwEAmpwYAAAAB3RJTUUH3QMLFAcybmyUawAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAA' +
        'AMElEQVRo3u3XoQEAAAjDsP3/NLyAHolB1cyRAPDcHK++sDfe7x4AAMCLpDeeHoBuC8Gmn2G8cxHgAAAAAElFTkSuQmCC',
    SquiggleDots: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAQCAYAAADeWHeIAAAABmJLR0QA/wD/' +
        'AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QMLFBAp4YrZEQAAAB1pVFh0Q29tbWVudAAAAAAAQ3Jl' +
        'YXRlZCB3aXRoIEdJTVBkLmUHAAAAO0lEQVRo3u3XsQ0AIAwDQe+/dNgAIVFh7ppU37hLsje5o3+7B6DfHF59YW+8v3sA' +
        '/7EeALxIeuPpgXoL9QevUTTjWCQAAAAASUVORK5CYII='
};

const patternValues = Object.values(FILL_PATTERNS);
Object.keys(FILL_PATTERNS).forEach((patternName, index) => {
    PatternFactory.getInstance()
        .addPattern(patternValues[index], {'name': patternName, 'category': 'fillPatterns'});
});

const colorBarItems: Record<string, string> = {};
const colorScaleNames = Object.values(KnownScales);

colorScaleNames.forEach((scaleName) => {
    colorBarItems[scaleName.toUpperCase()] = new DiscreteGradientColorProvider({bins: 320})
        .setScale(scaleName)
        .exportToImage(240, 20, false)
        .getBase64();
});

const curve = {
    'type': 'Categorization',
    'elements': [
        {
            'type': 'Category',
            'label': 'Curve',
            'elements': [
                {
                    'type': 'HorizontalLayout',
                    'elements': [
                        {
                            'type': 'Control',
                            'label': 'Visible',
                            'scope': '#/properties/visible'
                        },
                        {
                            'type': 'Control',
                            'label': 'Auto Scaling',
                            'scope': '#/properties/calculated/properties/autoScaling'
                        }
                    ]
                },
                {
                    'type': 'HorizontalLayout',
                    'elements': [
                        {
                            'type': 'Control',
                            'label': 'Limits From',
                            'scope': '#/properties/calculated/properties/limits/properties/from',
                            'options': {
                                'precision': 2
                            },
                            'rule': {
                                'effect': 'DISABLE',
                                'condition': {
                                    'scope': '#/properties/calculated/properties/autoScaling',
                                    'schema': {
                                        'const': true
                                    }
                                }
                            }
                        },
                        {
                            'type': 'Control',
                            'label': 'Limits To',
                            'scope': '#/properties/calculated/properties/limits/properties/to',
                            'options': {
                                'precision': 2
                            },
                            'rule': {
                                'effect': 'DISABLE',
                                'condition': {
                                    'scope': '#/properties/calculated/properties/autoScaling',
                                    'schema': {
                                        'const': true
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
                            'label': 'Micro Position Left',
                            'scope': '#/properties/microposleft',
                            'options': {
                                'suffix': '%'
                            }
                        },
                        {
                            'type': 'Control',
                            'label': 'Micro Position Right',
                            'scope': '#/properties/microposright',
                            'options': {
                                'suffix': '%'
                            }
                        }
                    ]
                },
                {
                    'type': 'HorizontalLayout',
                    'elements': [
                        {
                            'type': 'Control',
                            'label': 'Scale Type',
                            'scope': '#/properties/scaletype'
                        },
                        {
                            'type': 'Control',
                            'label': 'Wrap',
                            'scope': '#/properties/wrapping'
                        }
                    ]
                },
                {
                    'type': 'Control',
                    'label': 'Interpolation',
                    'scope': '#/properties/interpolationtype'
                },
                {
                    'type': 'HorizontalLayout',
                    'elements': [
                        {
                            'type': 'Control',
                            'label': 'Line Pattern',
                            'scope': '#/properties/linestyle/properties/pattern',
                            'options': {
                                'images': true,
                                'items': {
                                    'Solid': generateLineStyleImage('Solid'),
                                    'Dash': generateLineStyleImage('Dash'),
                                    'Dot': generateLineStyleImage('Dot'),
                                    'DashDot': generateLineStyleImage('DashDot'),
                                    'ShortDash': generateLineStyleImage('ShortDash'),
                                    'LongDash': generateLineStyleImage('LongDash'),
                                    'DashDotDot': generateLineStyleImage('DashDotDot'),
                                    'DashLongDash': generateLineStyleImage('DashLongDash')
                                }
                            }
                        },
                        {
                            'type': 'Control',
                            'label': 'Line Color',
                            'scope': '#/properties/linestyle/properties/color'
                        },
                        {
                            'type': 'Control',
                            'label': 'Line Width',
                            'scope': '#/properties/linestyle/properties/width'
                        }
                    ]
                }
            ]
        },
        {
            'type': 'Category',
            'label': 'Left Fill',
            'elements': [
                {
                    'type': 'Control',
                    'label': 'Visible',
                    'scope': '#/properties/leftfill/properties/visible'
                },
                {
                    'type': 'Control',
                    'label': 'Reference Line',
                    'scope': '#/properties/calculated/properties/leftfill/properties/refLine'
                },
                {
                    'type': 'Control',
                    'label': 'Base Line Value',
                    'scope': '#/properties/calculated/properties/leftfill/properties/baseLineValue',
                    'options': {
                        'slider': true
                    },
                    'rule': {
                        'effect': 'SHOW',
                        'condition': {
                            'scope': '#/properties/calculated/properties/leftfill/properties/refLine',
                            'schema': {
                                'enum': ['BaseLine']
                            }
                        }
                    }
                },
                {
                    'type': 'HorizontalLayout',
                    'elements': [
                        {
                            'type': 'Control',
                            'scope': '#/properties/leftfill/properties/fillstyle/properties/pattern',
                            'options': {
                                'images': true,
                                'items': FILL_PATTERNS
                            }
                        },
                        {
                            'type': 'Control',
                            'label': 'Fill Color',
                            'scope': '#/properties/leftfill/properties/fillstyle/properties/color'
                        },
                        {
                            'type': 'Control',
                            'label': 'Foreground Color',
                            'scope': '#/properties/leftfill/properties/fillstyle/properties/foreground'
                        }
                    ]
                }
            ]
        },
        {
            'type': 'Category',
            'label': 'Right Fill',
            'elements': [
                {
                    'type': 'Control',
                    'label': 'Visible',
                    'scope': '#/properties/rightfill/properties/visible'
                },
                {
                    'type': 'Control',
                    'label': 'Reference Line',
                    'scope': '#/properties/calculated/properties/rightfill/properties/refLine'
                },
                {
                    'type': 'Control',
                    'label': 'Base Line Value',
                    'scope': '#/properties/calculated/properties/rightfill/properties/baseLineValue',
                    'options': {
                        'slider': true
                    },
                    'rule': {
                        'effect': 'SHOW',
                        'condition': {
                            'scope': '#/properties/calculated/properties/rightfill/properties/refLine',
                            'schema': {
                                'enum': ['BaseLine']
                            }
                        }
                    }
                },
                {
                    'type': 'HorizontalLayout',
                    'elements': [
                        {
                            'type': 'Control',
                            'scope': '#/properties/rightfill/properties/fillstyle/properties/pattern',
                            'options': {
                                'images': true,
                                'items': FILL_PATTERNS
                            }
                        },
                        {
                            'type': 'Control',
                            'label': 'Fill Color',
                            'scope': '#/properties/rightfill/properties/fillstyle/properties/color'
                        },
                        {
                            'type': 'Control',
                            'label': 'Foreground Color',
                            'scope': '#/properties/rightfill/properties/fillstyle/properties/foreground'
                        }
                    ]
                }
            ]
        },
        {
            'type': 'Category',
            'label': 'Marker',
            'elements': [
                {
                    'type': 'Control',
                    'label': 'Visible',
                    'scope': '#/properties/calculated/properties/markerVisible'
                },
                {
                    'type': 'HorizontalLayout',
                    'elements': [
                        {
                            'type': 'Control',
                            'label': 'Type',
                            'scope': '#/properties/symbol/properties/painter',
                            'options': {
                                'images': true,
                                'showLabels': true,
                                'items': painterImages
                            }
                        },
                        {
                            'type': 'Control',
                            'label': 'Size',
                            'scope': '#/properties/symbol/properties/width',
                            'options': {
                                'slider': true
                            }
                        }
                    ]
                },
                {
                    'type': 'HorizontalLayout',
                    'elements': [
                        {
                            'type': 'Control',
                            'label': 'Fill Color',
                            'scope': '#/properties/symbol/properties/fillstyle/properties/color'
                        },
                        {
                            'type': 'Control',
                            'label': 'Line Color',
                            'scope': '#/properties/symbol/properties/linestyle/properties/color'
                        },
                        {
                            'type': 'Control',
                            'label': 'Line Width',
                            'scope': '#/properties/symbol/properties/linestyle/properties/width',
                            'options': {
                                'slider': true
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

const log2DVisual = {
    'type': 'VerticalLayout',
    'elements': [
        {
            'type': 'HorizontalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'label': 'Visible',
                    'scope': '#/properties/visible'
                },
                {
                    'type': 'Control',
                    'label': 'WebGL',
                    'scope': '#/properties/webglrendering'
                }
            ]
        },
        {
            'type': 'HorizontalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'label': 'Wrap',
                    'scope': '#/properties/wrapinterpolation'
                },
                {
                    'type': 'Control',
                    'label': 'Auto Angle Limits',
                    'scope': '#/properties/autoanglelimits'
                }
            ]
        },
        {
            'type': 'HorizontalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'label': 'Min angle',
                    'scope': '#/properties/minangle',
                    'options': {
                        'precision': 2
                    },
                    'rule': {
                        'effect': 'DISABLE',
                        'condition': {
                            'scope': '#/properties/autoanglelimits',
                            'schema': {
                                'const': true
                            }
                        }
                    }
                },
                {
                    'type': 'Control',
                    'label': 'Max angle',
                    'scope': '#/properties/maxangle',
                    'options': {
                        'precision': 2
                    },
                    'rule': {
                        'effect': 'DISABLE',
                        'condition': {
                            'scope': '#/properties/autoanglelimits',
                            'schema': {
                                'const': true
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
                    'label': 'Micro Position Left',
                    'scope': '#/properties/microposleft',
                    'options': {
                        'suffix': '%'
                    }
                },
                {
                    'type': 'Control',
                    'label': 'Micro Position Right',
                    'scope': '#/properties/microposright',
                    'options': {
                        'suffix': '%'
                    }
                }
            ]
        },
        {
            'type': 'HorizontalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'label': 'Plot Type',
                    'scope': '#/properties/plotmode'
                },
                {
                    'type': 'Control',
                    'label': 'Rows Interpolation',
                    'scope': '#/properties/rowsinterpolation'
                }
            ]
        },
        {
            'type': 'HorizontalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'label': 'Column Alignment',
                    'scope': '#/properties/columnalignment'
                },
                {
                    'type': 'Control',
                    'label': 'Row Alignment',
                    'scope': '#/properties/rowalignment'
                }
            ]
        },
        {
            'type': 'HorizontalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'label': 'Offsets',
                    'scope': '#/properties/offsets',
                    'options': {
                        'slider': true
                    }
                },
                {
                    'type': 'Control',
                    'label': 'Color Provider',
                    'scope': '#/properties/colorprovider/properties/scale',
                    'options': {
                        'images': true,
                        'showLabels': true,
                        'items': colorBarItems
                    }
                }
            ]
        }
    ]
};

const indexTrack = {
    'type': 'VerticalLayout',
    'label': 'Axis header properties',
    'elements': [
        {
            'type': 'Control',
            'scope': '#/properties/headertype'
        },
        {
            'type': 'Control',
            'scope': '#/properties/autolabelrotation'
        },
        {
            'type': 'Control',
            'scope': '#/properties/labelrotationangle',
            'rule': {
                'effect': 'HIDE',
                'condition': {
                    'scope': '#/properties/autolabelrotation',
                    'schema': {
                        'const': true
                    }
                }
            },
            'options': {
                'slider': true
            }
        }
    ]
};

const track = {
    'type': 'Categorization',
    'elements': [
        {
            'type': 'Category',
            'label': 'General',
            'elements': [
                {
                    'type': 'Control',
                    'label': 'Track type',
                    'scope': '#/properties/calculated/properties/general/properties/tracktype'
                },
                {
                    'type': 'Control',
                    'label': 'Vertical decade',
                    'scope': '#/properties/calculated/properties/general/properties/verticaldecade',
                    'rule': {
                        'effect': 'SHOW',
                        'condition': {
                            'scope': '#/properties/calculated/properties/general/properties/tracktype',
                            'schema': {
                                'const': TrackType.LogTrack
                            }
                        }
                    }
                },
                {
                    'type': 'HorizontalLayout',
                    'rule': {
                        'effect': 'SHOW',
                        'condition': {
                            'scope': '#/properties/calculated/properties/general/properties/tracktype',
                            'schema': {
                                'enum': [TrackType.LinearTrack, TrackType.TangentialTrack]
                            }
                        }
                    },
                    'elements': [
                        {
                            'type': 'Control',
                            'label': 'Vertical major count',
                            'scope': '#/properties/calculated/properties/general/properties/verticalmajorcount'
                        },
                        {
                            'type': 'Control',
                            'label': 'Vertical minor count',
                            'scope': '#/properties/calculated/properties/general/properties/verticalminorcount'
                        }
                    ]
                },
                {
                    'type': 'HorizontalLayout',
                    'elements': [
                        {
                            'type': 'Control',
                            'label': 'Horizontal major axis',
                            'scope': '#/properties/calculated/properties/general/properties/horizontalmajoraxiscolor'
                        },
                        {
                            'type': 'Control',
                            'label': 'Horizontal minor axis',
                            'scope': '#/properties/calculated/properties/general/properties/horizontalminoraxiscolor'
                        }
                    ]
                },
                {
                    'type': 'HorizontalLayout',
                    'elements': [
                        {
                            'type': 'Control',
                            'label': 'Vertical major axis',
                            'scope': '#/properties/calculated/properties/general/properties/verticalmajoraxiscolor'
                        },
                        {
                            'type': 'Control',
                            'label': 'Vertical minor axis',
                            'scope': '#/properties/calculated/properties/general/properties/verticalminoraxiscolor'
                        }
                    ]
                }
            ]
        },
        {
            'type': 'Category',
            'label': 'Title',
            'elements': [
                {
                    'type': 'Control',
                    'label': 'Visible',
                    'scope': '#/properties/calculated/properties/title/properties/visible'
                },
                {
                    'type': 'VerticalLayout',
                    'rule': {
                        'effect': 'SHOW',
                        'condition': {
                            'scope': '#/properties/calculated/properties/title/properties/visible',
                            'schema': {
                                'const': true
                            }
                        }
                    },
                    'elements': [
                        {
                            'type': 'Control',
                            'label': 'Title',
                            'scope': '#/properties/calculated/properties/title/properties/title'
                        },
                        {
                            'type': 'Control',
                            'label': 'Hold title',
                            'scope': '#/properties/calculated/properties/title/properties/holdtitle'
                        },
                        {
                            'type': 'Control',
                            'label': 'Auto multiple lines',
                            'scope': '#/properties/calculated/properties/title/properties/automultiplelines'
                        },
                        {
                            'type': 'Control',
                            'label': 'Auto title rotation',
                            'scope': '#/properties/calculated/properties/title/properties/autotitlerotation'
                        },
                        {
                            'type': 'Control',
                            'label': 'Rotation angle',
                            'scope': '#/properties/calculated/properties/title/properties/rotationangle',
                            'options': {
                                'slider': true
                            },
                            'rule': {
                                'effect': 'SHOW',
                                'condition': {
                                    'scope': '#/properties/calculated/properties/title/properties/autotitlerotation',
                                    'schema': {
                                        'const': false
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

const logMarker = {
    'type': 'VerticalLayout',
    'label': 'Marker properties',
    'elements': [
        {
            'type': 'HorizontalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'scope': '#/properties/visiblenamelabel'
                },
                {
                    'type': 'Control',
                    'scope': '#/properties/visiblenameborder'
                }
            ]
        },
        {
            'type': 'HorizontalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'scope': '#/properties/visibledepthlabel'
                },
                {
                    'type': 'Control',
                    'scope': '#/properties/visibledepthborder'
                }
            ]
        },
        {
            'type': 'Control',
            'label': 'Font color',
            'scope': '#/properties/textstyle/properties/color'
        },
        {
            'type': 'HorizontalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'scope': '#/properties/linedecoration',
                    'options': {
                        'images': true,
                        'items': {
                            'solid': generateLineDecorationImage('solid'),
                            'wavy': generateLineDecorationImage('wavy'),
                            'double': generateLineDecorationImage('double'),
                            'double-wavy': generateLineDecorationImage('double-wavy')
                        }
                    }
                },
                {
                    'type': 'Control',
                    'label': 'Line Pattern',
                    'scope': '#/properties/linestyle/properties/pattern',
                    'options': {
                        'images': true,
                        'items': {
                            'Solid': generateLineStyleImage('Solid'),
                            'Dash': generateLineStyleImage('Dash'),
                            'Dot': generateLineStyleImage('Dot'),
                            'DashDot': generateLineStyleImage('DashDot'),
                            'ShortDash': generateLineStyleImage('ShortDash'),
                            'LongDash': generateLineStyleImage('LongDash'),
                            'DashDotDot': generateLineStyleImage('DashDotDot'),
                            'DashLongDash': generateLineStyleImage('DashLongDash')
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
                    'label': 'Line Color',
                    'scope': '#/properties/linestyle/properties/color'
                },
                {
                    'type': 'Control',
                    'label': 'Line Width',
                    'scope': '#/properties/linestyle/properties/width'
                }
            ]
        }
    ]
};

const annotation = {
    'type': 'VerticalLayout',
    'label': 'Annotation properties',
    'elements': [
        {
            'type': 'Control',
            'label': 'Text',
            'scope': '#/properties/text'
        },
        {
            'type': 'HorizontalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'scope': '#/properties/textstyle',
                    'label': 'Font Options',
                    'options': {
                        'fullfontoptions': true
                    }
                }
            ]
        },
        {
            'type': 'HorizontalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'label': 'Multiline',
                    'scope': '#/properties/textstyle/properties/multiline'
                }
            ]
        },
        {
            'type': 'HorizontalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'label': 'Fill Color',
                    'scope': '#/properties/fillstyle/properties/color'
                },
                {
                    'type': 'Control',
                    'label': 'Line Color',
                    'scope': '#/properties/linestyle/properties/color'
                },
                {
                    'type': 'Control',
                    'label': 'Line Width',
                    'scope': '#/properties/linestyle/properties/width',
                    'options': {
                        'suffix': 'px'
                    }
                }
            ]
        }
    ]
};

const uischemas = {
    [CompositeLogCurve.getClassName()]: curve,
    [Log2DVisual.getClassName()]: log2DVisual,
    [LogAxisVisualHeader.getClassName()]: indexTrack,
    [LogTrack.getClassName()]: track,
    [LogMarker.getClassName()]: logMarker,
    [Annotation.getClassName()]: annotation
};

export {uischemas, FILL_PATTERNS};
