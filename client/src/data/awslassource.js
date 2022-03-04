import {HttpClient} from '@int/geotoolkit/http/HttpClient';
import {DataSource} from '@int/geotoolkit/data/DataSource';
import {obfuscate} from '@int/geotoolkit/lib';
import {LogCurveDataSource} from '@int/geotoolkit/welllog/data/LogCurveDataSource';
import {LogCurve, LimitsType as LogCurveLimitsType} from '@int/geotoolkit/welllog/LogCurve';
import {DataTable} from '@int/geotoolkit/data/DataTable';
import {NumericalDataSeries} from '@int/geotoolkit/data/NumericalDataSeries';
import {Range} from '@int/geotoolkit/util/Range';
import {MathUtil} from '@int/geotoolkit/util/MathUtil';

const lasPath = '/api/v1/las';
const serverUrl = new URL(lasPath, process.env.SERVER);
const http = HttpClient.getInstance().getHttp();
/**
 * Get las info for the current LAS
 * @param {string} file file name/path
 * @returns {Promise}
 */
 const getLasInfo = async function (file) {
    const url = serverUrl + '/' + encodeURIComponent(file);
    return http.get(url, {
        'responseType': 'json',
        'transformResponse': function (response) {
            return response['data'];
        }
    });
};
const getCurvesData = async function (file, curves) {
    const url = serverUrl + '/' + encodeURIComponent(file)+'/curves';
    const data = JSON.stringify({
        'curves': curves
    });
    return http.post(url, data, {
        'headers': {'Content-Type': 'application/json'},
        'responseType': 'json',
        'transformResponse': function (response) {
            return response['data'];
        }
    });
};
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
                const limits = MathUtil.calculateNeatLimits(source.getMinValue(), source.getMaxValue());
                if (curve.isCustomLimits() === true) {
                    curve.setData(source, false, true);
                } else {
                    curve.setData(source, true, true)
                        .setNormalizationLimits(limits.getLow(), limits.getHigh());
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
        this.indexData = options.indexData[0];
        this.indexType = this.index.title;
        this.dataTable = new DataTable({
            cols: [
                {'name': this.index.title, 'type': 'number', 'unit': this.index.unit}
            ],
            colsdata: [this.indexData],
            meta: {
                range: this.range,
                index: this.indexType
            }
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
        const indexName = this.dataTable.getMetaData()['index'];
        const depths = this.dataTable.getColumnByName(indexName);
        let values = this.dataTable.getColumnByName(curveInfo.title);
        if(values == null) {
            const curveData = await getCurvesData(this.file, [curveInfo.title]);
            const dataSeries = new NumericalDataSeries({
                'name': curveInfo.title,
                'unit': curveInfo.unit,
                'data': curveData['data'][0]
            });
            this.dataTable.addColumn(dataSeries);
            values = dataSeries;
        }
        // Sets data source
        return values == null ? null :
            new LogCurveDataSource({'depths': depths, 'values': values});
    }
    /**
     * A new data source
     * @param {string} fileName 
     * @returns {AwsLasSource}
     */
    static async create(fileName) {
        const data = await getLasInfo(fileName);
        if (data && data['info'] && data['curves'] && data['curves'].length > 0) {
            const range = new Range(data['info']['minIndex'], data['info']['maxIndex']);
            const curves = data['curves'];
            let index = curves.find(element => element['title'] === 'DEPTH');
            if (!index) {
                index = curves[0];
            }
            const indexData = await getCurvesData(fileName, [index.title]);
            return new AwsLasSource({
                range: range, 
                curves: curves,
                index: index,
                indexData: indexData['data'],
                file: fileName
            });
        }
        return null;
    }
}
obfuscate(AwsLasSource);
