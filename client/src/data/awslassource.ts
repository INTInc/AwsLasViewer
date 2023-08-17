import {DataSource} from '@int/geotoolkit/data/DataSource';
import {obfuscate} from '@int/geotoolkit/lib';
import {LogCurveDataSource} from '@int/geotoolkit/welllog/data/LogCurveDataSource';
import {LogCurve} from '@int/geotoolkit/welllog/LogCurve';
import {DataTable} from '@int/geotoolkit/data/DataTable';
import {Range} from '@int/geotoolkit/util/Range';
import {MathUtil} from '@int/geotoolkit/util/MathUtil';
import {DataSet} from '@int/geotoolkit/data/DataSet';
import {Events as DataEvents} from '@int/geotoolkit/data/Events';
import {Node} from "@int/geotoolkit/scene/Node";
import {DataBinding} from "@int/geotoolkit/data/DataBinding";
import {getCurvesData, getCurvesLimits, getLasInfo} from "../api";

type CurveType = {
    description: string;
    title: string;
    unit: string;
};

export class BindingFunction extends DataBinding {
    accept (node: Node): boolean {
        return node instanceof LogCurve;
    }
    async bind (curve: LogCurve, data: AwsLasSource) {
        if (data == null || curve.isDisposed()) {
            return;
        }
        const curveName = curve.getName();
        try {
            const {source, tableIndex} = await data.getCurveSource(curveName);
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
                    AwsLasSource.dataset.invalidateRange(AwsLasSource.dataset.getIndexRange(tableIndex), false);
                    AwsLasSource.dataset.fetchTable(tableIndex, depthLimits, step);
                }
            }
        } catch(error) {
            curve.setData(null);
        }
    }
    unbind(curve: LogCurve) {
        const curveName = curve.getName();
        AwsLasSource.visibleCurves = AwsLasSource.visibleCurves.filter(v => v !== curveName);
    }
}
type Options = {
    range: Range;
    curves: CurveType[];
    index: CurveType;
    file: string;
};
export class AwsLasSource extends DataSource {
    static curvesLimits: {
        [key: string]: {
            min: number;
            max: number;
        }
    } = null;
    static curveStep: number = null;
    static getDepthLimitsAndStep: () => {depthLimits: Range, step: number} = null;
    static visibleCurves: string[] = [];
    static dataset: DataSet = null;
    static cachedIndex: {
        limits: Range;
        scale: number;
        data: number[]
    } = null;

    private range: Range;
    private curves: CurveType[];
    private index: CurveType;
    private file: string;
    private indexType: string;
    private dataTables: DataTable[] = []
    constructor(options: Options) {
        super();
        this.range = options.range;
        this.curves = options.curves;
        this.index = options.index;
        this.file = options.file;
        this.indexType = this.index.title;
        AwsLasSource.dataset = new DataSet({
            requestwindowmultiplier: 0.01,
            includerequestlimits: true,
            decimation: true,
            numberofparallelrequests: 1,
            cleartableonscale: false
        });
        AwsLasSource.visibleCurves = [];
        AwsLasSource.cachedIndex = null;

        for (const curve of this.curves) {
            const dataTable = new DataTable({
                cols: [
                    {'name': this.index.title, type: 'number', 'unit': this.index.unit},
                    {'name': curve.title, 'type': 'number', 'unit': curve.unit}
                ],
                meta: {
                    range: this.range,
                    index: this.indexType,
                    name: curve.title
                }
            });
            this.dataTables.push(dataTable);
            AwsLasSource.dataset.addTable(dataTable, this.range, this.index.title);
        }

        AwsLasSource.dataset.on(DataEvents.DataFetching, async (event, sender, args) => {
            if (args.limits.getLow() >= args.limits.getHigh() || args.tables.length === 0) return;
            const curveName = args.tables[0].getMetaData()['name'];
            const indexName = this.index.title;

            if (!AwsLasSource.visibleCurves.includes(curveName)) {
                args['callback'](null, {'limits': args['limits'], 'colsdata': null});
                return;
            }

            // If it is needed to request from server more than one curve data for same limits and scale,
            // the index will be requested only one time
            const cachedIndex = AwsLasSource.cachedIndex != null &&
                AwsLasSource.cachedIndex.limits.getLow() === args['limits'].getLow() &&
                AwsLasSource.cachedIndex.limits.getHigh() === args['limits'].getHigh() &&
                AwsLasSource.cachedIndex.scale === args['scale'];

            let dataToUpdate;
            let curvesData;

            if (cachedIndex) {
                if (curveName === indexName) {
                    dataToUpdate = [AwsLasSource.cachedIndex.data, AwsLasSource.cachedIndex.data];
                } else {
                    curvesData = await getCurvesData(this.file, [curveName], args.limits, args.scale, indexName);
                    dataToUpdate = [AwsLasSource.cachedIndex.data, curvesData.data[0]];
                }
            } else {
                if (curveName === indexName) {
                    curvesData = await getCurvesData(this.file, [curveName], args.limits, args.scale, indexName);
                    dataToUpdate = [curvesData.data[0], curvesData.data[0]];
                } else {
                    curvesData = await getCurvesData(this.file, [indexName, curveName], args.limits, args.scale, indexName);
                    dataToUpdate = curvesData.data;
                }
                AwsLasSource.cachedIndex = {
                    limits: args.limits,
                    scale: args.scale,
                    data: curvesData.data[0]
                }
            }
            args['callback'](null, {'limits': args['limits'], 'colsdata': dataToUpdate});
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

    findTableIndex(curveName: string) {
        const tableIndex = this.dataTables.findIndex(dt => dt.getMetaData()['name'] === curveName);
        return (tableIndex === -1 ? null : tableIndex);
    }

    async getCurveSource(curveName: string) {
        let lowerCaseName = curveName.toLowerCase();
        let curveInfo = this.curves.find(element => element['title'].toLowerCase() === lowerCaseName);
        if (!curveInfo) return {'source': null, 'tableIndex': null};
        const tableIndex = this.findTableIndex(curveName);
        const dataTable = AwsLasSource.dataset.getTable(tableIndex);
        const indexName = dataTable.getMetaData()['index'];
        const depths = dataTable.getColumnByName(indexName);
        const values = dataTable.getColumnByName(curveInfo.title);
        return {
            'source': values == null ? null :
                new LogCurveDataSource({'datatable': dataTable, 'depths': depths, 'values': values}),
            'tableIndex': tableIndex
        };
    }
    /**
     * A new data source
     * @param {string} fileName
     * @returns {AwsLasSource}
     */
    static async create(fileName: string) {
        const data = await getLasInfo(fileName);
        const {limits, step} = await getCurvesLimits(fileName);
        AwsLasSource.curvesLimits = limits;
        AwsLasSource.curveStep = step;
        if (data && data['info'] && data['curves'] && data['curves'].length > 0) {
            const range = new Range(data['info']['minIndex'], data['info']['maxIndex']);
            const curves = data['curves'];
            let index = curves.find((element: CurveType) => element['title'] === 'DEPTH');
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
