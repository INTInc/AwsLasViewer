import {HttpClient} from "@int/geotoolkit/http/HttpClient";

const LAS_PATH = '/api/v1/las';
const TEMPLATES_PATH = '/api/v1/templates';
const TOPS_PATH = '/api/v1/tops';

const lasUrl = new URL(LAS_PATH, process.env.SERVER);
const templatesUrl = new URL(TEMPLATES_PATH, process.env.SERVER);
const topsUrl = new URL(TOPS_PATH, process.env.SERVER);

const http = HttpClient.getInstance().getHttp();

/**
 * Get las info for the current LAS
 * @param {string} file file name/path
 * @returns {Promise}
 */
export const getLasInfo = async function (file) {
    const url = lasUrl + '/' + encodeURIComponent(file);
    return http.get(url, {
        'responseType': 'json',
        'transformResponse': function (response) {
            return response['data'];
        }
    });
};

export const getCurvesLimits = async function (file) {
    const url = lasUrl + '/' + encodeURIComponent(file) + '/limits';
    return http.get(url, {
        'responseType': 'json',
        'transformResponse': function (response) {
            return response['data'];
        }
    });
};

export const getCurvesData = async function (file, curves, limits, step, indexName) {
    const url = lasUrl + '/' + encodeURIComponent(file) + '/curves';
    const data = JSON.stringify({
        'curves': curves,
        'limits': [limits.getLow(), limits.getHigh()],
        'step': step,
        'indexName': indexName,
    });
    return http.post(url, data, {
        'headers': {'Content-Type': 'application/json'},
        'responseType': 'json',
        'transformResponse': function (response) {
            return response['data'];
        }
    });
};

export const getLasFilesList = async function () {
    return http.get(lasUrl, {
        'responseType': 'json',
        'transformResponse': function (response) {
            return response['data'];
        }
    });
};

export const getTemplatesFilesList = async function () {
    return http.get(templatesUrl, {
        'responseType': 'json',
        'transformResponse': function (response) {
            return response['data'];
        }
    });
};

export const getTopsFilesList = async function () {
    return http.get(topsUrl, {
        'responseType': 'json',
        'transformResponse': function (response) {
            return response['data'];
        }
    });
};

export const getTemplateFile = async function (fileName) {
    return http.get(templatesUrl + '/' + fileName, {
        //'responseType': 'json',
        'transformResponse': function (response) {
            return response['data'];
        }
    });
};

export const getTopsFile = async function (fileName) {
    return http.get(topsUrl + '/' + fileName, {
        'responseType': 'json',
        'transformResponse': function (response) {
            return response['data'];
        }
    });
};
