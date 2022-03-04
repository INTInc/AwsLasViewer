
import status from 'http-status';
import path from 'path';
import {getLogger} from '../utils/log';
import '@int/geotoolkit/environment.js';
import {ParserFactory} from '@int/geotoolkit/welllog/data/las/ParserFactory.js';

const querySectionByName = function(sections, name) {
    for (let i = 0; i < sections.length; ++i) {
        if (sections[i].getName().toLowerCase().indexOf(name.toLowerCase()) >= 0) {
            return sections[i];
        }
    }
    return null;
};
const getCurvesList = function(parser) {
    const curves = [];
    parser.getSectionGroups().forEach((section) => {
      section.getCurveMnemonics().forEach((name) => {
        const info = section.getCurveInfo(name);
        curves.push({
            title: name,
            description: info.getDescription(),
            unit: info.getUnit(),
        });
      });
    });
    return curves;
};
const getInfo = function (parser) {
    const wellSection = querySectionByName(parser.getSections(), 'WELL');
    const minIndex = parseFloat(queryDataByKey(wellSection.getData(), 'STRT').getValue());
    const maxIndex = parseFloat(queryDataByKey(wellSection.getData(), 'STOP').getValue());
    return {
        'minIndex': minIndex,
        'maxIndex': maxIndex
    }  
};
const queryDataByKey = function(data, key) {
    for (let i = 0; i < data.length; ++i) {
        if (data[i].getMnemonic().toLowerCase() === key.toLowerCase()) {
            return data[i];
        }
    }
    return null;
};
const getCurveData = function(parser, curveName) {
    let curve = null;
    curveName = curveName.toLowerCase();
    parser.getSectionGroups().forEach((section) => {
      section.getCurveMnemonics().forEach((mnemonic) => {
        if (mnemonic.toLowerCase() === curveName) {
          const info = section.getCurveInfo(mnemonic);
          curve = section.getCurveData(mnemonic);
        }
      });
    });
    return curve;
};

export const las = (app, connector, cache) => {
    const logger = getLogger(import.meta.url);
    const folder = 'las';
    const getFileContent = async function(fileName) {
        let fileContent = cache.get(fileName);
        if(!fileContent) {
            fileContent = await connector.getFile(fileName, {'encoding': 'utf8'});
            cache.set(fileName, fileContent);
        }
        return fileContent;
    }
    // Gets list of files
    app.get('/api/v1/las', async (req, res) => {
        try {
            const files = await connector.getFiles(folder);
            return res.json(files);
        } catch(error) {
            logger.error(error);
            return res.status(status.BAD_REQUEST).json({
                errors: [status['400_MESSAGE']],
            });
        }
    });
    // Gets a file
    app.get('/api/v1/las/:file', async (req, res) => {
        try {
            const fileName = path.join(folder, req.params.file);
            const fileContent = await getFileContent(fileName);
            const parser = ParserFactory.getParser(fileContent.toString());
            const curves = getCurvesList(parser);
            return res.json({
                info: getInfo(parser),
                curves: curves
            });
        } catch(error) {
            logger.error(error);
            return res.status(status.BAD_REQUEST).json({
                errors: [status['400_MESSAGE']],
            });
        }
    });
    // Gets curves data
    app.post('/api/v1/las/:file/curves', async (req, res) => {
        try {
            if (!req.body) {
                res.status(status.BAD_REQUEST);
                return res.json({
                    errors: [status['400_MESSAGE']],
                });
            }
            const inputCurves = req.body.curves;
            const fileName = path.join(folder, req.params.file);
            const fileContent = await getFileContent(fileName);
            const parser = ParserFactory.getParser(fileContent.toString());
            const curves = [];
            for(let i=0; i < inputCurves.length; i++) {
                const data = getCurveData(parser, inputCurves[i]);
                curves.push(data);
            }
            return res.json({
                'data': curves
            });
        } catch(error) {
            logger.error(error);
            return res.status(status.BAD_REQUEST).json({
                errors: [status['400_MESSAGE']],
            });
        }
    });
}
