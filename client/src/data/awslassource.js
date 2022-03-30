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

let curvesLimits = null;

export class BindingFunction {
    accept (node) {
        return node instanceof LogCurve;
    }
    async bind (curve, data) {
        if (data == null || curve.isDisposed()) {
            return;
        }
        const id = curve.getName();
        try {
            const source = await data.getCurveSource(id);
            if (source != null) {
                if (curve.isCustomLimits() === true) {
                    curve.setData(source, false, true);
                } else {
                    curve.setData(source, true, true);
                    if (curvesLimits != null) {
                        if (curvesLimits[id] != null) {
                            const curveNeatLimits = MathUtil.calculateNeatLimits(curvesLimits[id]['min'], curvesLimits[id]['max']);
                            curve.setNormalizationLimits(curveNeatLimits.getLow(), curveNeatLimits.getHigh());
                        }
                    }
                }
            }
        } catch(error) {
            curve.setData(null);
        }
    }
}
export class AwsLasSource extends DataSource {
    constructor(options) {
        super();
        this.range = options.range;
        this.curves = options.curves;
        this.index = options.index;
        this.file = options.file;
        this.indexType = this.index.title;
        this.dataset = new DataSet({
            requestwindowmultiplier: 0,
            includerequestlimits: true,
            decimation: true,
            cleartableonscale: false
        });

        this.dataTable = new DataTable({
            cols: [
                ...this.curves.map(curve => ({'name': curve.title, 'type': 'number', 'unit': curve.unit}))
            ],
            meta: {
                range: this.range,
                index: this.indexType
            }
        });

        this.dataset.addTable(this.dataTable, this.range, this.index.title);
        this.dataset.on(DataEvents.DataFetching, async (event, sender, args) => {
            if (args.limits.getLow() >= args.limits.getHigh()) return;
            const curvesData = await getCurvesData(this.file, this.curves.map(curve => curve.title), args.limits, args.scale, this.index.title);
            args['callback'](null, {'limits': args['limits'], 'colsdata': curvesData.data});
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
        const dataTable = this.dataset.getTable(0);
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
        curvesLimits = await getCurvesLimits(fileName);
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
