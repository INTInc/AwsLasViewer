import {HttpClient} from "@int/geotoolkit/http/HttpClient";
import {Range} from "@int/geotoolkit/util/Range";

const LAS_PATH = '/api/v1/las';
const TEMPLATES_PATH = '/api/v1/templates';
const TOPS_PATH = '/api/v1/tops';

const lasUrl = new URL(LAS_PATH, process.env.SERVER).toString();
const templatesUrl = new URL(TEMPLATES_PATH, process.env.SERVER).toString();
const topsUrl = new URL(TOPS_PATH, process.env.SERVER).toString();

const http = HttpClient.getInstance().getHttp();

/**
 * Get las info for the current LAS
 * @param {string} file file name/path
 * @returns {Promise}
 */
export const getLasInfo = async function (file: string) {
    const url = lasUrl + '/' + encodeURIComponent(file);
    return http.get(url, {
        'responsetype': 'json',
        'transformresponse': function (response) {
            return response['data'];
        }
    });
};

export const getCurvesLimits = async function (file: string) {
    const url = lasUrl + '/' + encodeURIComponent(file) + '/limits';
    return http.get(url, {
        'responsetype': 'json',
        'transformresponse': function (response) {
            return response['data'];
        }
    });
};

export const getCurvesData = async function (file: string, curves: string[], limits: Range, step: number, indexName: string) {
    const url = lasUrl + '/' + encodeURIComponent(file) + '/curves';
    const data = JSON.stringify({
        'curves': curves,
        'limits': [limits.getLow(), limits.getHigh()],
        'step': step,
        'indexName': indexName,
    });
    return http.post(url, data, {
        'headers': {'Content-Type': 'application/json'},
        'responsetype': 'json',
        'transformresponse': function (response) {
            return response['data'];
        }
    });
};

export const getLasFilesList = async function () {
    return http.get(lasUrl, {
        'responsetype': 'json',
        'transformresponse': function (response) {
            return response['data'];
        }
    });
};

export const getTemplatesFilesList = async function () {
    return http.get(templatesUrl, {
        'responsetype': 'json',
        'transformresponse': function (response) {
            return response['data'];
        }
    });
};

export const getTopsFilesList = async function () {
    return http.get(topsUrl, {
        'responsetype': 'json',
        'transformresponse': function (response) {
            return response['data'];
        }
    });
};

export const getTemplateFile = async function (fileName: string) {
    return http.get(templatesUrl + '/' + fileName, {
        //'responseType': 'json',
        'transformresponse': function (response) {
            return response['data'];
        }
    });
};

export const getTopsFile = async function (fileName: string) {
    return http.get(topsUrl + '/' + fileName, {
        'responsetype': 'json',
        'transformresponse': function (response) {
            return response['data'];
        }
    });
};
