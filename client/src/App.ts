// Geotoolkit
import '@int/geotoolkit/bootstrap/polyfill';
import {from as queryFromNode} from '@int/geotoolkit/selection/from';

import {Orientation} from '@int/geotoolkit/util/Orientation';
import {ImageCompression} from '@int/geotoolkit/pdf/ImageCompression';
import {FooterComponent} from '@int/geotoolkit/scene/exports/FooterComponent';
import {HeaderComponent} from '@int/geotoolkit/scene/exports/HeaderComponent';
import {CssStyle, PseudoClass} from '@int/geotoolkit/css/CssStyle';
import {Events} from '@int/geotoolkit/welllog/widgets/Events';
import {CssLayout} from '@int/geotoolkit/layout/CssLayout';
import {Group} from '@int/geotoolkit/scene/Group';
import {Plot} from '@int/geotoolkit/plot/Plot';
import {isInstanceOf, warn} from '@int/geotoolkit/base';
import {BrowserInfo} from '@int/geotoolkit/util/BrowserInfo';
import {TrackDirection} from '@int/geotoolkit/welllog/TrackDirection';
import {ColorUtil} from '@int/geotoolkit/util/ColorUtil';
import {DecimalFormat} from '@int/geotoolkit/util/DecimalFormat';
import {Events as NavigationEvents, Navigation} from '@int/geotoolkit/welllog/widgets/tools/Navigation';
import {Events as SelectionEvents, Selection} from '@int/geotoolkit/controls/tools/Selection';
import {ToolTipTool} from '@int/geotoolkit/controls/tools/ToolTipTool';
import {Selector} from '@int/geotoolkit/selection/Selector';
import {AnchorType} from '@int/geotoolkit/util/AnchorType';
import {LogReferenceLine} from '@int/geotoolkit/welllog/LogReferenceLine';
import {LogCurveVisualHeader} from '@int/geotoolkit/welllog/header/LogCurveVisualHeader';
import {LogVisualHeader} from '@int/geotoolkit/welllog/header/LogVisualHeader';
import {LogTrack} from '@int/geotoolkit/welllog/LogTrack';
import {LogMarker} from '@int/geotoolkit/welllog/LogMarker';
import {LogTrackVisualHeader} from '@int/geotoolkit/welllog/header/LogTrackVisualHeader';
import {TrackType} from '@int/geotoolkit/welllog/TrackType';
import {MathUtil} from '@int/geotoolkit/util/MathUtil';
import {LogCurve} from '@int/geotoolkit/welllog/LogCurve';
import {LogAbstractVisual} from '@int/geotoolkit/welllog/LogAbstractVisual';
import {WellLogWidget} from '@int/geotoolkit/welllog/widgets/WellLogWidget';
import {CompositeLogCurve} from '@int/geotoolkit/welllog/CompositeLogCurve';
import {AdaptiveLogCurveVisualHeader} from '@int/geotoolkit/welllog/header/AdaptiveLogCurveVisualHeader';
import {HeaderType, LogAxisVisualHeader} from '@int/geotoolkit/welllog/header/LogAxisVisualHeader';
import {LogAxis} from '@int/geotoolkit/welllog/LogAxis';
import {FillType as LogFillType} from '@int/geotoolkit/welllog/LogFill';
import {DataBindingRegistry} from '@int/geotoolkit/data/DataBindingRegistry';
import {Iterator} from '@int/geotoolkit/util/iterator';
import {NodeOrder} from '@int/geotoolkit/scene/CompositeNode';
import {LogBlock} from '@int/geotoolkit/welllog/LogBlock';
import {Annotation} from '@int/geotoolkit/widgets/overlays/Annotation';
import {Layer} from '@int/geotoolkit/scene/Layer';
import {AnnotationLocation} from '@int/geotoolkit/layout/AnnotationLocation';
import {SelectionEventArgs} from "@int/geotoolkit/controls/tools/SelectionEventArgs";
import {AlignmentStyle} from "@int/geotoolkit/attributes/TextStyle";
import {Node} from "@int/geotoolkit/scene/Node";
import {NodeExport} from "@int/geotoolkit/scene/exports/NodeExport";
import {Point} from "@int/geotoolkit/util/Point";
import {IndexType} from "@int/geotoolkit/welllog/IndexType";
import {LineStyle} from "@int/geotoolkit/attributes/LineStyle";
import {LogAbstractData} from "@int/geotoolkit/welllog/data/LogAbstractData";
import {VisualZIndexDirections} from './VisualZIndexDirections';
import {AwsLasSource, BindingFunction} from './data/awslassource';
import {debounce} from "./utils/debounce";
import {defaultTemplate} from './defaultWellLogTemplate';

const DEFAULT_HIGHLIGHT_CLASS = 'highlight';
const SAVE_TEMPLATE_TIMEOUT = 2000;
const DEFAULT_DARK_COLOR = '#757575';
const DEFAULT_LIGHT_COLOR = 'rgba(255, 255, 255, 0.85)';
const DEFAULT_CROSS_LINE_STYLE: LineStyle.Options = {
    'color': DEFAULT_DARK_COLOR,
    'width': 1,
    'pattern': null,
    'pixelsnapmode': true
};
const DEFAULT_WEST_LABEL_STYLE = {
    'visible': true,
    'linestyle': {
        'color': 'rgba(175, 175, 175, 0.9)',
        'pixelsnapmode': true,
        'width': 1
    },
    'fillstyle': {
        'color': DEFAULT_LIGHT_COLOR,
        'shadow': {
            'enable': true,
            'color': 'rgba(60, 60, 60, 0.5)',
            'blur': 6,
            'offsetx': 0,
            'offsety': 4
        }
    },
    'textstyle': {
        'font': '12px sans-serif',
        'color': '#252525'
    },
    'padding': 4,
    'offset': {
        'left': 4,
        'bottom': 8
    },
    'alignment': AnchorType.LeftBottom
};

const SIDEBAR_WIDTH = 200;
const DEFAULT_TRACK_WIDTH = 200;

const __date = new Date();
const getDateTime = function (stamp: number) {
    __date.setTime(stamp);
    return __date.toLocaleString();
};

const __formatTooltip = function (logCurve: LogCurve, pt?: Point) {
    if (pt == null) {
        return 'Name: ' + logCurve.getName() + '<br>' +
            'Min :' + logCurve.getMinimumNormalizationLimit() + '<br>' +
            'Max :' + logCurve.getMaximumNormalizationLimit();
    }
    const pos = logCurve.getSceneTransform().inverseTransform(pt);
    const rawValue = logCurve.getDataSource()
        .getValueAt(pos.getY(), 0, logCurve.getDataSource().getSize(), logCurve.getInterpolationType());
    const unit = logCurve.getDataSource().getValueUnit().getBaseUnitSymbol();
    const color = logCurve.getLineStyle().getColor();

    const format = new DecimalFormat();
    return '<span class="cg-tooltip-symbol" style="background-color: ' + color + '"></span>' +
        logCurve.getName() + ' ' +
        '<b>' + format.format(rawValue) + '</b> ' +
        '<i>(' + unit + ')</i>';
};



const widgetCssStyle = {
    'css': [
        '.geotoolkit.welllog.LogTrack:hover {',
        '   fillstyle: rgba(255,232,166,0.2);',
        '}',
        '.geotoolkit.welllog.LogTrack:highlight {',
        '   fillstyle: rgba(255,232,166,0.2);',
        '   linestyle-color: rgba(255,232,166,1);',
        '   linestyle-width: 2;',
        '}',
        '.geotoolkit.welllog.LogTrack:highlight {',
        '   fillstyle: rgba(255,232,166,0.2);',
        '   linestyle-color: rgba(255,232,166,1);',
        '   linestyle-width: 2;',
        '}',
        '.geotoolkit.welllog.LogCurve:highlight {',
        '   linestyle-width: 3;',
        '}',
        '.geotoolkit.welllog.LogCurve:hover {',
        '   linestyle-width: 3;',
        '}',
        '.geotoolkit.welllog.header.LogVisualHeader:highlight {',
        '   fillstyle: rgba(255,232,166,0.2);',
        '   borderlinestyle-color: rgba(255,232,166,1);',
        '   borderlinestyle-width: 2;',
        '}'
    ].join('')
};

type CurveSelect = {
    name: string;
    selected: boolean;
};
type Options = {
    host: HTMLDivElement;
    canvas: HTMLCanvasElement;
    data: AwsLasSource;
    template: HTMLInputElement;
};

export class LogDisplay {
    private _host: HTMLDivElement;
    private _canvas: HTMLCanvasElement;
    private _data: AwsLasSource;
    private _template: HTMLInputElement;
    private _selectedCurve: LogCurve = null;
    private _selectedTrack: LogTrack = null;
    private _selectedIndexTrack: LogAxisVisualHeader = null;
    private _tracksCountWithoutIndexTracks: number = null;
    private _oldTrackIndex: number = -1;
    private _resetScaleFactor = 1.0;
    private _sidebarIsDisplayed = false;
    private _hasHover = false;
    private _hasHighlight = false;
    private _canLoadData = false;
    private _curvesList: CurveSelect[] = [];
    private _selectedCurves: CurveSelect[] = [];
    private _curveBinding: BindingFunction = new BindingFunction();
    private _topsLayer = new Layer();
    private _widget: WellLogWidget;
    private _navigationWidget: WellLogWidget;
    private _navigationTool: Navigation;
    private _plot: Plot;
    private _loadData: () => void;
    private _onSelectEventHandler: (evt: SelectionEvents.onSelectionChanged, sender: Selection, eventArgs: SelectionEventArgs) => void;
    private _onEmptySelectHandler: (evt: SelectionEvents.onSelectionChanged, sender: Selection, eventArgs: SelectionEventArgs) => void;
    constructor (options: Options) {
        this._host = options.host;
        this._canvas = options.canvas;
        this._data = options.data;
        this._template = options.template;

        this._widget = this.createWellLogWidget();
        this._navigationWidget = this.createNavigationWidget();
        this._navigationTool = new Navigation({
            'layer': this._navigationWidget.getToolByName('cross-hair').getManipulatorLayer(),
            'background': 'rgba(155, 155, 155, 0.3)'
        });
        this._navigationTool.on(NavigationEvents.NavigationStart, this.adjustVisibleLimits.bind(this))
            .on(NavigationEvents.NavigationEnd, this.adjustVisibleLimits.bind(this));

        this._navigationWidget.getTool().add(this._navigationTool);

        this._plot = new Plot({
            'canvaselement': this._canvas,
            'root': new Group()
                .setAutoModelLimitsMode(true)
                .setLayout(new CssLayout())
                .addChild([
                    this._widget.setLayoutStyle({
                        'left': 50,
                        'top': 0,
                        'right': 0,
                        'bottom': 0
                    }),
                    this._navigationWidget.setLayoutStyle({
                        'left': 5,
                        'top': 5,
                        'width': 40,
                        'bottom': 5
                    })
                ]),
            'autosize': false,
            'autorootbounds': true
        });
        this._plot.setSize(this._canvas.clientWidth, this._canvas.clientHeight);
        this._navigationWidget.fitToHeight();
        this._navigationTool.setVisibleDepthLimits(this._widget.getVisibleDepthLimits());

        this._navigationTool.on(NavigationEvents.DepthRangeChanged,
            (event, sender, eventArgs) => {
                this._widget.setVisibleDepthLimits(eventArgs.getLimits());
            });

        this._widget.on(Events.DepthRangeChanged, this.setDepthLimits.bind(this));
        this._widget.on(Events.VisibleDepthLimitsChanged, this.setVisibleDepthLimits.bind(this));
        this._widget.on(Events.VisibleDepthLimitsChanged, this.loadData.bind(this));

        this._plot.getTool()
            .add([this._widget.getTool(), this._navigationWidget.getTool()]);

        this._widget.setCss(new CssStyle(widgetCssStyle));
        this.updateCurvesList();

        this._loadData = debounce(() => {
            const {depthLimits, step} = this.getDepthLimitsAndStep();
            AwsLasSource.dataset.fetch(depthLimits, step);
        }, 500);
    }

    getDepthLimitsAndStep() {
        const depthLimits = this._widget.getVisibleDepthLimits();
        const deviceLimits = this._widget.getVisibleDeviceLimits();
        const step = Math.max(
            AwsLasSource.curveStep,
            (depthLimits.getHigh() - depthLimits.getLow()) / deviceLimits.getHeight() * 2
        );
        return {depthLimits, step};
    }

    set canLoadData(value: boolean) {
        this._canLoadData = value;
    }

    loadData() {
        if (!this._canLoadData) return;
        this._loadData();
    }

    /**
     * Configure headers for widget
     * @param {WellLogWidget} widget welllog widget
     */
    configureHeaders (widget: WellLogWidget) {
        const headerProvider = widget.getHeaderContainer().getHeaderProvider();

        // configure Depth ant Time axis header
        const logAxisVisualHeader = headerProvider.getHeaderProvider(LogAxis.getClassName()) as LogAxisVisualHeader;
        logAxisVisualHeader.setHeaderType(HeaderType.Simple);

        // configure curve header
        const header = new AdaptiveLogCurveVisualHeader()
            .setElement({
                'ScaleTo': {'horizontalpos': 'right', 'verticalpos': 'top'},
                'ScaleFrom': {'horizontalpos': 'left', 'verticalpos': 'top'},
                'Line': {'horizontalpos': 'center', 'verticalpos': 'center'},
                'Name': {'horizontalpos': 'center', 'verticalpos': 'top'},
                'Unit': {'horizontalpos': 'center', 'verticalpos': 'bottom'},
                'Tracking': {'horizontalpos': 'center', 'verticalpos': 'bottom'}
            })
            .setSection('middle', {
                'size': '2px'
            });
        headerProvider.registerHeaderProvider(CompositeLogCurve.getClassName(), header);

        headerProvider.registerHeaderProvider(LogTrack.getClassName(), new LogTrackVisualHeader()
            .setTextStyle({
                'color': DEFAULT_DARK_COLOR,
                'font': '12px sans-serif'
            }));
    }

    dispose () {
        DataBindingRegistry.getInstance()
            .remove(this._curveBinding);
        if (this._onSelectEventHandler != null) {
            this._widget.getToolByName('pick').off(SelectionEvents.onSelectionChanged, this._onSelectEventHandler);
        }
        if (this._onEmptySelectHandler != null) {
            this._widget.getToolByName('pick').off(SelectionEvents.onSelectionChanged, this._onEmptySelectHandler);
        }
        if (this._plot) {
            this._plot.dispose();
        }
        this._widget.dispose();
        if (this._navigationTool) {
            this._navigationTool.dispose();
        }
        if (this._navigationWidget) {
            this._navigationWidget.dispose();
        }
    }
    /**
     * Gets list of curves
     * @returns {Object} curves
     * @returns {string} curves.name curve name
     * @returns {string} curves.selected curve selected property
     */
    getCurvesList () {
        return this._curvesList;
    }

    /**
     * Create WellLog widget
     * @returns {module:geotoolkit/welllog/widgets/WellLogWidget~WellLogWidget}
     */
    createWellLogWidget () {
        if (this._data == null) {
            return null;
        }
        const range = this._data.getRange();
        const wellLogWidget: WellLogWidget = new WellLogWidget({
            'highlight': {
                'cssclass': DEFAULT_HIGHLIGHT_CLASS
            },
            'marker': {
                'linestyle': DEFAULT_CROSS_LINE_STYLE,
                'indexvisible': false,
                'indexformatter': (depth) => wellLogWidget.getIndexType() === 'time' ?
                    getDateTime(depth) : (isNaN(depth) ? '' : depth.toFixed(2))
            },
            'tools': {
                'crosshair': {
                    'horizontal': DEFAULT_CROSS_LINE_STYLE,
                    'west': DEFAULT_WEST_LABEL_STYLE
                },
                'cursortracking': {
                    'crosshair': {
                        'west': DEFAULT_WEST_LABEL_STYLE
                    }
                }
            },
            'range': range,
            'indent': 0,
            'header': {
                'visible': true
            },
            'track': {
                'header': {
                    'firsttolast': false
                }
            },
            'footer': {
                'visible': false
            },
            'trackcontainer': {
                'border': {'visible': true}
            },
            'border': {'visible': true},
            'indextype': IndexType.Depth,
            'indexunit': 'ft',
            'scroll': {
                'headerverticalscroll': {
                    'size': 11,
                    'visible': true,
                    'options': {
                        'rounded': true,
                        'resizable': false
                    }
                },
                'trackverticalscroll': {
                    'size': 11,
                    'visible': true,
                    'options': {
                        'rounded': true,
                        'resizable': false
                    }
                },
                'footerverticalscroll': {
                    'size': 11,
                    'visible': true,
                    'options': {
                        'rounded': true,
                        'resizable': false
                    }
                },
                'trackhorizontalscroll': {
                    'size': 11,
                    'visible': true,
                    'options': {
                        'rounded': true,
                        'resizable': false
                    }
                }
            },
            'nodefilter': function (node) {
                // to capture click events on axis header
                return node instanceof LogAbstractVisual || node instanceof LogAxis;
            }
        }).setLayoutStyle({'left': 0, 'top': 0, 'right': 0, 'bottom': 0});

        wellLogWidget.getTrackContainer().addLayer(this._topsLayer);
        this.configureHeaders(wellLogWidget);
        // Add data binding for curve
        (wellLogWidget.getDataBinding() as DataBindingRegistry)
            .add(this._curveBinding);
        wellLogWidget.setData(this._data);

        // Tools
        wellLogWidget.getToolByName('cross-hair')
            .setEnabled(true)
            .setLabelsTextConverter(AnnotationLocation.West, (x, y) => {
                if (wellLogWidget.getIndexType() === 'time') return getDateTime(y);
                return isNaN(y) ? '' : y.toFixed(2);
            });

        const selector = new Selector();
        wellLogWidget.connectTool(new ToolTipTool({
            'layer': wellLogWidget,
            'autoupdate': false,
            'autoflip': true,
            'callback': function (pt) {
                const nodes = selector.select(wellLogWidget, pt.x, pt.y, 2);
                if (nodes == null || nodes.length === 0) return '';

                const visualHeaders = nodes.filter((node) => node instanceof LogVisualHeader &&
                        node.getVisual() instanceof LogCurve) as LogVisualHeader[];
                if (visualHeaders != null && visualHeaders.length > 0 && (visualHeaders[0].getVisual() as LogCurve).getTrack()) {
                    return __formatTooltip(visualHeaders[0].getVisual() as LogCurve);
                }

                const logCurves = nodes.reverse()
                    .filter((node) => node instanceof LogCurve) as LogCurve[];
                if (logCurves != null && logCurves.length > 0 && logCurves[0].getTrack()) {
                    return __formatTooltip(logCurves[0], pt);
                }
                return '';
            }
        }));
        return wellLogWidget;
    }

    /**
     * Set callback for 'double click' event by tool name
     * @param {string} toolName tool name
     * @param {function} callback callback function for event
     * @returns {null|LogDisplay}
     */
    setToolDoubleClickCallback (toolName: string, callback: (selection: Node[]) => void) {
        if (this._widget == null || toolName == null || callback == null) {
            return null;
        }
        this._widget.getToolByName(toolName)
            .on(SelectionEvents.onDoubleClick, (event, sender, eventArgs) => {
                if (eventArgs.getSelection().length) {
                    callback(eventArgs.getSelection());
                }
            });
        return this;
    }

    /**
     * Set visible limits for navigation tool
     */
    setVisibleDepthLimits () {
        this._navigationTool.setVisibleDepthLimits(this._widget.getVisibleDepthLimits());
    }

    /**
     * Set depth limits for navigation widget
     */
    setDepthLimits () {
        this._navigationWidget.setDepthLimits(this._widget.getDepthLimits()).fitToHeight();
    }

    /**
     * Adds template to widget
     */
    loadTemplate (template: string) {
        if (this._widget != null && !this._widget.isDisposed()) {
            this._widget.loadTemplate(template);
        }
        this.calculateTracksCountWithoutIndexTrack();
    }

    loadTops (topsData: {
        tops: {
            color: string;
            depth: number;
            name: string;
        }[]
    }) {
        if (this._widget != null && !this._widget.isDisposed()) {
            const tops = topsData['tops'];
            this._topsLayer.clearChildren(true);
            for (let i=0; i < tops.length; ++i) {
                const top = tops[i];
                const marker = new LogMarker(top['depth']);
                marker.setName(top['name']);
                marker.setLineStyle({'color': top['color'], 'width': 2});
                marker.setTextStyle({
                    'color': top['color'],
                    'alignment': AlignmentStyle.Left,
                    'font': '12px sans-serif'
                });
                marker.setNameLabel(top['name']);
                marker.setDepthLabel(top['depth'].toString());
                marker.setNameLabelPosition(AnchorType.TopCenter);
                marker.setDepthLabelPosition(AnchorType.BottomCenter);
                this._topsLayer.addChild(marker)
            }
        }
    }
    /**
     * Adjust widget visible limits
     */
    adjustVisibleLimits () {
        // check if track container device size is smaller then widget
        const trackContainer = this._widget.getTrackContainer();
        const trackLimits = trackContainer.getVisibleDeviceLimits();
        const availableSpace = (trackContainer.getParent() as Group).getVisibleDeviceLimits();
        if (this._widget.getOrientation() === Orientation.Vertical) {
            if (availableSpace.getHeight() > (trackLimits.getHeight() + MathUtil.epsilon)) {
                this._widget.fitToHeight();
            }
        } else {
            if (availableSpace.getWidth() > (trackLimits.getWidth() + MathUtil.epsilon)) {
                this._widget.fitToHeight();
            }
        }
    }

    /**
     * Create navigation widget for demo
     * @returns {module:geotoolkit/welllog/widgets/WellLogWidget~WellLogWidget} widget navigation widget
     */
    createNavigationWidget () {
        const widget = new WellLogWidget({
            'horizontalscrollable': false,
            'verticalscrollable': false,
            'trackcontainer': {
                'border': {'visible': false}
            },
            'header': {
                'visible': false
            },
            'border': {'visible': true}
        })
            .setDataBinding(null)
            .setDepthLimits(this._widget.getDepthLimits());

        widget.addTrack(TrackType.IndexTrack)
            .setWidth(40)
            .addChild([
                new LogCurve(null)
            ]);

        // initializing tools
        // do not allow user to select visuals
        widget.getToolByName('pick')
            .setEnabled(false);
        // do not allow user to pinchzoom index track
        widget.getToolByName('TrackZoom')
            .setEnabled(false);
        // do not allow user resize tracks
        widget.getToolByName('splitter')
            .setEnabled(false);
        // disable cross-hair
        widget.getToolByName('cross-hair')
            .setEnabled(false);
        widget.getToolByName('cursor-tracking')
            .setEnabled(false);
        // and change scale
        widget.getToolByName('TrackPanning')
            .setEnabled(false);

        this._widget.getToolByName('pick')
            .on(SelectionEvents.onSelectionChanged, (event, sender, eventArgs) => {
                if (eventArgs.getSelection().length === 0) {
                    return;
                }
                eventArgs.getSelection()
                    .forEach((selection) => {
                        if (selection instanceof LogCurve) {
                            queryFromNode(this._navigationWidget)
                                .where((node) => node instanceof LogCurve)
                                .select((curve) => {
                                    curve.setLineStyle(selection.getLineStyle())
                                        .setData(selection.getDataSource(), true, true);
                                });
                        }
                    });
            });
        return widget;
    }

    /**
     * Adds curve to track
     * @param {module:geotoolkit/welllog/data/LogAbstractData~LogAbstractData} curveData data for curve
     * @param {module:geotoolkit/welllog/LogTrack~logTrack} track track
     */
    addCurveToTrack (curveData: LogAbstractData, track: LogTrack) {
        const randomColor = ColorUtil.parseColor(ColorUtil.getRandomColorRgba(0.9, true));

        const logCurve = new CompositeLogCurve(curveData)
            .setLineStyle({'color': randomColor.toRgbaString(), 'width': 2})
            .setId(curveData.getName());

        track.addChild(logCurve);
    }
    /**
     * Gets selected visual in all selection
     */
    getSelectedVisual (selection: Node[] | Annotation[]) {
        let visual = null;

        for (let i = selection.length - 1; i >= 0; i--) {
            visual = selection[i];
            if (visual instanceof LogMarker) {
                return visual;
            }
            if (visual instanceof LogCurve ||
                (visual instanceof LogTrack) || isInstanceOf(visual, Annotation)) {
                return visual;
            } else if (visual instanceof LogCurveVisualHeader) {
                return visual.getVisual();
            } else if (visual instanceof LogAxis) {
                const headerProvider = this._widget.getHeaderContainer().getHeaderProvider();
                return headerProvider.getHeader(visual);
            }
        }
        return null;
    }

    /**
     * Gets name for property dialog for selection
     * @param {module:geotoolkit/welllog/LogTrack|module:geotoolkit/welllog/LogAbstractVisual~LogAbstractVisual|module:geotoolkit/welllog/header/LogVisualHeader~LogVisualHeader|null} selectedVisual selected visual
     * @returns {?string} dialog name
     */
    getPropertyDialogName (selectedVisual: Node | Annotation) {
        let dialogName = null;
        if (selectedVisual instanceof LogMarker) {
            dialogName = 'Marker';
        }
        if (selectedVisual instanceof CompositeLogCurve) {
            let leftLogRef = null;
            let rightLogRef = null;
            if (selectedVisual.getLeftFill() == null) {
                selectedVisual.setLeftReferencePointSet((leftLogRef = new LogReferenceLine(0.0)));
                leftLogRef.setName('leftReferenceLine');
                selectedVisual.getLeftFill().setVisible(false).setFillType(LogFillType.Right);
            }
            if (selectedVisual.getRightFill() == null) {
                selectedVisual.setRightReferencePointSet((rightLogRef = new LogReferenceLine(1)));
                rightLogRef.setName('rightReferenceLine');
                selectedVisual.getRightFill().setVisible(false).setFillType(LogFillType.Left);
            }

            const track = selectedVisual.getTrack();
            if (track instanceof LogTrack) {// needs to add references line to the track as well
                const idx = track.indexOfChild(selectedVisual);
                if (leftLogRef !== null) {
                    track.insertChild(idx + 1, leftLogRef);
                }
                if (rightLogRef !== null) {
                    track.insertChild(idx + 2, rightLogRef);
                }
            }
            dialogName = 'Curve';
            this._selectedCurve = selectedVisual;
        } else if (selectedVisual instanceof LogTrack) {
            dialogName = 'Track';
            this._selectedTrack = selectedVisual;
        } else if (selectedVisual instanceof LogAxisVisualHeader) {
            dialogName = 'Index track';
            this._selectedIndexTrack = selectedVisual;
        } else if (isInstanceOf(selectedVisual, Annotation)) {
            dialogName = 'Annotation';
        }
        return dialogName;
    }

    /**
     * Resize plot
     * @returns {this}
     */
    resizePlot () {
        const newWidth = this._sidebarIsDisplayed ? this._host.clientWidth - SIDEBAR_WIDTH : this._host.clientWidth;
        this._plot.setSize(newWidth, this._host.clientHeight);
        return this;
    }

    /**
     * Resize widgets
     * @returns {this}
     */
    resize () {
        if (this._plot) {
            this.resizePlot();
            this._navigationWidget.fitToHeight();
        }
        return this;
    }

    /**
     * Adds track to widget
     * @param {TrackType} type track type
     * @param {TrackDirection} direction track direction
     * @returns {?LogTrack} track
     */
    addTrack (type: TrackType, direction: TrackDirection) {
        if (this._widget == null) {
            return null;
        }
        let width = 0;
        if (type === TrackType.IndexTrack) {
            width = (this._widget.getTracksCount() === 0) ? 70 : 50;
        } else {
            width = DEFAULT_TRACK_WIDTH;
        }
        let track;
        const selectedTracks = this._widget.getSelectedTracks();
        if (direction !== TrackDirection.Last && selectedTracks && selectedTracks.length > 0) {
            const index = this._widget.getTrackIndex(selectedTracks[selectedTracks.length - 1]) + 1;
            track = this._widget.insertTrack(index, {
                'type': type, 'width': width
            });
        } else {
            track = this._widget.addTrack({
                'type': type, 'width': width
            });
        }
        if (type !== TrackType.IndexTrack) {
            track.setName('Track' + ' # ' + ++this._tracksCountWithoutIndexTracks);
            this._widget.getTrackHeader(track).setVisibleTrackTitle(true);
        }
        this._widget.panToTrack(track);
        return track;
    }

    getSelectedTrackCount () {
        return this._widget ? this._widget.getToolByName('pick').getSelection().length : null;
    }

    /**
     * Delete selection
     */
    deleteSelection () {
        if (this._widget == null) {
            return;
        }
        const selector = this._widget.getToolByName('pick');
        const currentSelection = selector.getSelection();
        // Check visuals
        let visualDeleted = false;
        currentSelection.forEach((visual) => {
            if (visual instanceof LogAbstractVisual) {
                const track = visual.getParent() as LogTrack;
                if (track == null) {
                    return;
                }

                track.removeChild(visual);
                visualDeleted = true;
            }
        });
        if (!visualDeleted) {
            // check tracks if visual is not deleted
            currentSelection.forEach((visual) => {
                if (visual instanceof LogTrack) {
                    this._widget.removeTrack(visual);
                }
            });
        }
        queryFromNode(this._navigationWidget)
            .where((node) => node instanceof LogCurve)
            .select((curve) => {
                curve.setLineStyle('transparent');
            });
        // clear selection after deleting selected
        selector.setSelection([]);
    }

    setDragAndDrop (enabled: boolean) {
        if (this._widget == null) {
            return;
        }
        this._widget.getToolByName('drag-and-drop').setEnabled(enabled);
    }

    zoomIn () {
        if (this._widget != null) {
            this._widget.scale(2);
            this._resetScaleFactor /= 2;
        }
    }

    zoomOut () {
        if (this._widget != null) {
            this._widget.scale(0.5);
            this._resetScaleFactor *= 2;
        }
    }

    zoomReset () {
        if (this._widget != null) {
            this._widget.scale(this._resetScaleFactor);
            this._resetScaleFactor = 1.0;
        }
    }

    fitToHeight () {
        if (this._widget != null) {
            this._widget.fitToHeight();
        }
    }

    exportToPDF (settings: {printSettings: NodeExport.PrintDocumentSettings}): string {
        const limits = this._widget.getDepthLimits();
        const compression = BrowserInfo.isFirefox() !== true;
        let warningMessage = null;
        this._widget.exportToPdf({
            'output': 'Widget',
            'printsettings': settings['printSettings'],
            'limits': {
                'start': limits.getLow(),
                'end': limits.getHigh()
            },
            'header': new HeaderComponent(600, 20, 'PDF Output'),
            'footer': new FooterComponent(600, 20),
            'imagecompression': {
                'mode': ImageCompression.NONE
            },
            'streamcompression': compression
        }).catch((fail) => {
            warningMessage = fail.message;
        });
        return warningMessage;
    }
    getSelection () {
        let selection = null;
        if (selection == null) {
            selection = this._widget.getSelectedVisuals();
            if (selection == null || selection.length === 0) {
                selection = this._widget.getSelectedTracks();
            }
        }

        selection = (selection == null) ? [] : (Array.isArray(selection) ? selection : [selection]);
        return selection;
    }
    saveTemplateToFile () {
        if (this._widget == null) {
            return;
        }
        const fileName = 'int_template.json';
        try {
            const template = this._widget.saveTemplate();
            const data = new Blob([template], {type: 'text/plain'});

            // MOZ CHROME SUPPORT
            const file = window.URL.createObjectURL(data);

            const save = document.createElement('a');
            save.href = file;
            save.target = '_blank';
            save.download = fileName;
            const evt = document.createEvent('MouseEvents');
            evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
            save.dispatchEvent(evt);
            setTimeout(() => {
                window.URL.revokeObjectURL(file);// remove previous objecturl
            }, SAVE_TEMPLATE_TIMEOUT);
        } catch (e) {
            warn('ERROR cannot save the template');
        }
    }

    /**
     * Reads file as text
     * @param {file} file file
     * @param {function} callback function callback
     */
    getAsText (file: File, callback: (event: ProgressEvent) => void) {
        const reader = new FileReader();
        reader.readAsText(file, 'utf-8');

        reader.onerror = function () {
            warn('ERROR cannot read the file');
        };
        reader.onload = callback;
    }

    /**
     * Loads template from file
     */
    loadTemplateFromFile () {
        if (this._widget == null || this._template == null) {
            return;
        }
        const callback = () => {
            if (this._widget != null) {
                try {
                    const orientation = this._widget.getOrientation();

                    const files = this._template.files;
                    if (files == null || files.length === 0) {
                        return;
                    }
                    this.getAsText(files[0], (event) => {
                        if (event == null) {
                            return;
                        }
                        const template = (event.target as FileReader).result as string;
                        JSON.parse(template);
                        this._widget.loadTemplate(template);
                       this.calculateTracksCountWithoutIndexTrack();
                    });
                } catch (e) {
                    warn('ERROR cannot load the template');
                }
            }
        };
        this._template.addEventListener('change', callback);
        this._template.click();
    }

    /**
     * Save template to browser local storage
     */
    saveTemplateToLocalStorage () {
        if (this._widget == null) {
            return;
        }
        let template;
        try {
            template = this._widget.saveTemplate();
        } catch (e) {
            warn('ERROR cannot save the template');
            return;
        }
        localStorage.setItem('template_saved', template);
    }

    /**
     * Loads default template
     */
    loadDefaultTemplate () {
        if (this._widget == null) {
            return;
        }
        try {
            this._widget.loadTemplate(defaultTemplate);
        } catch (e) {
            warn('ERROR cannot load the template');
        }
    }

    /**
     * Loads template from local storage
     */
    loadTemplateFromLocalStorage () {
        if (this._widget == null) {
            return;
        }
        let template;
        try {
            template = localStorage.getItem('template_saved');
            this._widget.loadTemplate(template);
        } catch (e) {
            warn('ERROR cannot load the template');
        }
    }

    /**
     * Set widget navigation visibility
     * @param {boolean} visible navigation visibility
     * @returns {this}
     */
    setNavigationVisible (visible: boolean) {
        this._navigationWidget.setVisible(visible);
        if (visible) {
            this._navigationWidget.fitToHeight();
        }
        this._widget.setLayoutStyle({
            'left': this._widget.getOrientation() === Orientation.Vertical && this._navigationWidget.getVisible() ? 50 : 0,
            'top': 0,
            'right': 0,
            'bottom': this._widget.getOrientation() === Orientation.Horizontal && this._navigationWidget.getVisible() ? 50 : 0
        });
        (this._widget.getRoot() as Group).updateLayout();
        return this;
    }

    /**
     * Sets sidebar visible
     * @param {boolean} visibility sidebar visibility
     */
    setSidebarVisible (visibility: boolean) {
        this._sidebarIsDisplayed = visibility;
        this.resizePlot();
    }

    getSelectedCurve () {
        return this._selectedCurve;
    }

    getSelectedTrack () {
        return this._selectedTrack;
    }
    getSelectedIndexTrack () {
        return this._selectedIndexTrack;
    }

    /**
     * Gets the drag position
     * @returns {{x: number, y: number}} position
     */
    getDragPosition (event: DragEvent) {
        const rect = this._plot.getBoundingClientRect();
        return {
            x: event.pageX - rect.left,
            y: event.pageY - rect.top
        };
    }

    /**
     * Update curves list
     * @returns {this}
     */
    updateCurvesList () {
        this._curvesList = [];
        if (this._widget != null && this._widget.getData() != null) {
            const data = this._widget.getData() as AwsLasSource;
            const curves = data.getCurves();
            for (let i = 0; i < curves.length; i++) {
                this._curvesList.push({
                    'name': curves[i].title,
                    'selected': false
                });
            }
        }
        return this;
    }

    /**
     * Calculate selected curves in curves list
     */
    calculateSelectedCurves () {
        this._selectedCurves = [];
        for (const index in this._curvesList) {
            if (this._curvesList[index].selected) {
                this._selectedCurves.push(this._curvesList[index]);
            }
        }
    }

    /**
     * Start drag curve
     * @param {object} event draggable curve event
     */
    startDrag (event: Event & {oldIndex: number}) {
        const index = event.oldIndex;
        this.calculateSelectedCurves();
        if (this._selectedCurves.length === 0) {
            this._curvesList[index].selected = true;
            this.calculateSelectedCurves();
        }
    }

    /**
     * End drag (drop) curve
     * @param {object} event event
     */
    async endDrag (event: Event & {originalEvent: DragEvent}) {
        const data = this._widget.getData() as AwsLasSource;
        const position = this.getDragPosition(event.originalEvent);

        if (position.x < 0 || position.y < 0) {
            return;
        }

        let track = this._widget.getTrackAtPosition(position.x, position.y);

        if (track == null) {
            track = this.addTrack(null, TrackDirection.Last);
        }

        for (const index in this._selectedCurves) {
            const {source} = await data.getCurveSource(this._selectedCurves[index].name);
            this.addCurveToTrack(source, track);
        }

        if (this._oldTrackIndex !== -1) {
            const oldTrack = this._widget.getTrackAt(this._oldTrackIndex);
            if (oldTrack) {
                this._widget.highlightVisual(oldTrack, false);
            }
        }
        this.updateCurvesList();
    }

    /**
     * Drag curve over widget and highlight it
     * @param {object} event event
     */
    drag (event: DragEvent) {
        const position = this.getDragPosition(event);
        if (position.x < 0 || position.y < 0) {
            return;
        }
        const track = this._widget.getTrackAtPosition(position.x, position.y);
        const trackIndex = this._widget.getTrackIndex(track);

        if (trackIndex !== -1 && trackIndex !== this._oldTrackIndex) {
            this._widget.highlightVisual(track, true);
            if (this._oldTrackIndex !== -1) {
                const oldTrack = this._widget.getTrackAt(this._oldTrackIndex);
                if (oldTrack) {
                    this._widget.highlightVisual(oldTrack, false);
                }
            }
            this._oldTrackIndex = trackIndex;
        }
    }

    /**
     * Toggle 'select' curve in curves list
     * @param {number} index selected curve index
     */
    toggleCurveSelect (index: number) {
        this._curvesList[index].selected = !this._curvesList[index].selected;
        this.calculateSelectedCurves();
    }

    /**
     * Calculate track w/o index track in widget tracks
     */
    calculateTracksCountWithoutIndexTrack () {
        this._tracksCountWithoutIndexTracks = 0;
        for (let i = 0; i < this._widget.getTracksCount(); i++) {
            if (this._widget.getTrackAt(i).getCssClass() !== 'INDEX_TRACK') {
                this._tracksCountWithoutIndexTracks++;
            }
        }
    }

    /**
     * Add event on select.
     * @param {function} callback Callback function
     */
    onSelect (callback: () => void) {
        if (this._onSelectEventHandler != null) {
            this._widget.getToolByName('pick').off(SelectionEvents.onSelectionChanged, this._onSelectEventHandler);
        }
        this._onSelectEventHandler = (event, sender, eventArgs) => {
            if (eventArgs.getSelection().length === 0) {
                return;
            }
            callback();
        };
        this._widget.getToolByName('pick').on(SelectionEvents.onSelectionChanged, this._onSelectEventHandler);
    }

    /**
     * Event for empty select
     * @param {function} callback Callback function
     */
    onEmptySelect (callback: () => void) {
        if (this._onEmptySelectHandler != null) {
            this._widget.getToolByName('pick').off(SelectionEvents.onSelectionChanged, this._onEmptySelectHandler);
        }
        this._onEmptySelectHandler = (event, sender, eventArgs) => {
            if (eventArgs.getSelection().length !== 0) {
                return;
            }
            callback();
        };
        this._widget.getToolByName('pick').on(SelectionEvents.onSelectionChanged, this._onEmptySelectHandler);
    }

    moveSelectedVisual (direction: VisualZIndexDirections) {
        const visual = this._widget.getSelectedVisuals().pop();
        if (visual instanceof LogAbstractVisual) {
            const track = visual.getTrack() as LogTrack;
            const idx = this.getNewVisualIndexAndOrder(visual, track, direction);
            if (idx === null) return;
            track.changeChildOrder(visual, idx.order, track.getChild(idx.index));
        }
    }

    getNewVisualIndexAndOrder (currentVisual: LogAbstractVisual, track: LogTrack, direction: VisualZIndexDirections) {
        const idx = track.indexOfChild(currentVisual);
        const children = Iterator.toArray(track.getChildren());
        let i;
        switch (direction) {
            case VisualZIndexDirections.Down: {
                for (i = idx + 1; i < track.getChildrenCount(); i++) {
                    if (this.isRegularVisual(children[i])) {
                        return {
                            'index': i,
                            'order': NodeOrder.After
                        };
                    }
                }
                break;
            }
            case VisualZIndexDirections.Up: {
                for (i = idx - 1; i > 0; i--) {
                    if (this.isRegularVisual(children[i])) {
                        return {
                            'index': i,
                            'order': NodeOrder.Before
                        };
                    }
                }
                break;
            }
            case VisualZIndexDirections.Bottom: {
                for (i = 0; i < idx; i++) {
                    if (this.isRegularVisual(children[i])) {
                        return {
                            'index': i,
                            'order': NodeOrder.Before
                        };
                    }
                }
                break;
            }
            case VisualZIndexDirections.Top: {
                for (i = track.getChildrenCount(); i > idx; i--) {
                    if (this.isRegularVisual(children[i])) {
                        return {
                            'index': i,
                            'order': NodeOrder.After
                        };
                    }
                }
                break;
            }
        }
        return null;
    }

    isRegularVisual (visual: Node) {
        return (visual instanceof LogAbstractVisual &&
            !(visual instanceof LogReferenceLine) &&
            !(visual instanceof LogBlock));
    }

    savePseudoClasses (visual: LogAbstractVisual | LogAxisVisualHeader | LogTrack) {
        if (typeof visual.hasCssClass !== 'function') {
            return;
        }
        this._hasHover = visual.hasCssClass(PseudoClass.Hover);
        this._hasHighlight = visual.hasCssClass(PseudoClass.Highlight);
        // Remove class to restore original styles
        if (this._hasHover || this._hasHighlight) {
            visual.removeCssClass([PseudoClass.Hover, PseudoClass.Highlight]);
        }
        return;
    }

    restorePseudoClasses (visual: LogAbstractVisual | LogAxisVisualHeader | LogTrack) {
        if (this._hasHover) {
            visual.addCssClass(PseudoClass.Hover);
        }
        if (this._hasHighlight) {
            visual.addCssClass(PseudoClass.Highlight);
        }
    }
}
