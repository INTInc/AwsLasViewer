import {DataSource} from '@int/geotoolkit/data/DataSource';
import {obfuscate} from '@int/geotoolkit/lib';
import {LogCurveDataSource} from '@int/geotoolkit/welllog/data/LogCurveDataSource';
import {LogCurve, LimitsType as LogCurveLimitsType} from '@int/geotoolkit/welllog/LogCurve';
import {DataTable} from '@int/geotoolkit/data/DataTable';
import {Range} from '@int/geotoolkit/util/Range';
import {MathUtil} from '@int/geotoolkit/util/MathUtil';
import {DataSet} from '@int/geotoolkit/data/DataSet';
import {Events as DataEvents} from '@int/geotoolkit/data/Events';
import {getCurvesData, getCurvesLimits, getLasInfo} from "../api";

export class BindingFunction {
    accept (node) {
        return node instanceof LogCurve;
    }
    async bind (curve, data) {
        if (data == null || curve.isDisposed()) {
            return;
        }
        const curveName = curve.getName();
        try {
            const source = await data.getCurveSource(curveName);
            if (source != null) {
                if (curve.isCustomLimits() === true) {
                    curve.setData(source, false, true);
                } else {
                    curve.setData(source, true, true);
                    const curvesLimits = AwsLasSource.curvesLimits;
                    if (curvesLimits != null) {
                        if (curvesLimits[curveName] != null) {
                            const min = curvesLimits[curveName]['min'];
                            const max = curvesLimits[curveName]['max'];
                            if (min != null && max != null) {
                                const curveNeatLimits = MathUtil.calculateNeatLimits(min, max);
                                curve.setNormalizationLimits(curveNeatLimits.getLow(), curveNeatLimits.getHigh());
                            }
                        }
                    }
                }
                if (!AwsLasSource.visibleCurves.includes(curveName)) {
                    AwsLasSource.visibleCurves.push(curveName);
                }
                if (AwsLasSource.dataset != null && AwsLasSource.getDepthLimitsAndStep != null) {
                    const {depthLimits, step} = AwsLasSource.getDepthLimitsAndStep();
                    AwsLasSource.dataset.invalidateRange(AwsLasSource.dataset.getIndexRange(0), false);
                    AwsLasSource.dataset.fetch(depthLimits, step);
                }
            }
        } catch(error) {
            curve.setData(null);
        }
    }
    unbind(curve) {
        const curveName = curve.getName();
        AwsLasSource.visibleCurves = AwsLasSource.visibleCurves.filter(v => v !== curveName);
    }
}
export class AwsLasSource extends DataSource {
    static curvesLimits = null;
    static getDepthLimitsAndStep = null;
    static visibleCurves = [];
    static dataset = null;

    constructor(options) {
        super();
        this.range = options.range;
        this.curves = options.curves;
        this.index = options.index;
        this.file = options.file;
        this.indexType = this.index.title;
        AwsLasSource.dataset = new DataSet({
            requestwindowmultiplier: 0,
            includerequestlimits: true,
            decimation: true,
            cleartableonscale: false
        });
        AwsLasSource.visibleCurves = [];

        this.dataTable = new DataTable({
            cols: [
                ...this.curves.map(curve => ({'name': curve.title, 'type': 'number', 'unit': curve.unit}))
            ],
            meta: {
                range: this.range,
                index: this.indexType
            }
        });

        AwsLasSource.dataset.addTable(this.dataTable, this.range, this.index.title);
        AwsLasSource.dataset.on(DataEvents.DataFetching, async (event, sender, args) => {
            if (args.limits.getLow() >= args.limits.getHigh() || AwsLasSource.visibleCurves.length === 0) return;
            const curvesToRequest = [...AwsLasSource.visibleCurves];
            if (!curvesToRequest.includes(this.index.title)) {
                curvesToRequest.push(this.index.title);
            }
            const curvesData = await getCurvesData(this.file, curvesToRequest, args.limits, args.scale, this.index.title);
            const curvesToUpdate = [];
            const curvesNames = this.curves.map(curve => curve.title);
            for (let i = 0; i < curvesNames.length; i++) {
                let index = curvesToRequest.findIndex(v => v === curvesNames[i]);
                if (index === -1) {
                    curvesToUpdate.push([]);
                } else {
                    curvesToUpdate.push(curvesData.data[index]);
                }
            }
            args['callback'](null, {'limits': args['limits'], 'colsdata': curvesToUpdate});
        });
    }
    getCurves() {
        return this.curves;
    }
    getRange() {
        return this.range;
    }
    getIndexType() {
        return this.indexType;
    }

    async getCurveSource(curveName) {
        let lowerCaseName = curveName.toLowerCase();
        let curveInfo = this.curves.find(element => element['title'].toLowerCase() === lowerCaseName);
        if (!curveInfo) return null;
        const dataTable = AwsLasSource.dataset.getTable(0);
        const indexName = dataTable.getMetaData()['index'];
        const depths = dataTable.getColumnByName(indexName);
        const values = dataTable.getColumnByName(curveInfo.title);

        return values == null ? null :
            new LogCurveDataSource({'datatable': dataTable, 'depths': depths, 'values': values});
    }
    /**
     * A new data source
     * @param {string} fileName 
     * @returns {AwsLasSource}
     */
    static async create(fileName) {
        const data = await getLasInfo(fileName);
        AwsLasSource.curvesLimits = await getCurvesLimits(fileName);
        if (data && data['info'] && data['curves'] && data['curves'].length > 0) {
            const range = new Range(data['info']['minIndex'], data['info']['maxIndex']);
            const curves = data['curves'];
            let index = curves.find(element => element['title'] === 'DEPTH');
            if (!index) {
                index = curves[0];
            }
            return new AwsLasSource({
                range: range,
                curves: curves,
                index: index,
                file: fileName
            });
        }
        return null;
    }
}
obfuscate(AwsLasSource);
