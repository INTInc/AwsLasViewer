
import status from 'http-status';
import path from 'path';
import {getLogger} from '../utils/log';
import '@int/geotoolkit/environment.js';
import {ParserFactory} from '@int/geotoolkit/welllog/data/las/ParserFactory.js';
import {MathUtil} from "@int/geotoolkit/util/MathUtil.js";
import {decimate} from "../utils/decimate.js";

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
    const section = findSectionGroup(parser)
    section.getCurveMnemonics().forEach((name) => {
      const info = section.getCurveInfo(name);
      curves.push({
        title: name,
        description: info.getDescription(),
        unit: info.getUnit(),
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
const findSectionGroup = function(parser) {
    const sectionGroups = parser.getSectionGroups();
    if (sectionGroups[0].getName() === 'LAS2') {
        return sectionGroups[0];
    }
    return sectionGroups.find(sectionGroup => {
        return sectionGroup.getSections()['data']['name'].toLowerCase().includes('ascii');
    });
}
const getCurveData = function(parser, curveName, fileName, cache, limits, step, indexName) {
    let curve = null;
    let index = null;
    curveName = curveName.toLowerCase();

    const section = findSectionGroup(parser);
    section.getCurveMnemonics().forEach((mnemonic) => {
      if (mnemonic.toLowerCase() === curveName) {
        curve = cache.get(fileName + '/' + curveName);
        if (curve == null) {
          curve = section.getCurveData(mnemonic);
          cache.set(fileName + '/' + curveName, curve);
        }
      }

      if (indexName != null) {
          if (mnemonic.toLowerCase() === indexName.toLowerCase()) {
              index = cache.get(fileName + '/' + indexName);
              if (index == null) {
                  index = section.getCurveData(mnemonic);
                  cache.set(fileName + '/' + indexName, index);
              }
          }
      }
    });

      let sliceStart, sliceEnd;
      if (limits != null) {
          sliceStart = index.findIndex(v => v >= limits[0]);
          sliceEnd = index.findIndex(v => v >= limits[1]);
          if (sliceEnd === sliceStart) sliceEnd += 1;
          if (sliceEnd < sliceStart) sliceEnd = index.length;
          curve = curve.slice(sliceStart, sliceEnd);
      }

    let defaultStep = null;
    if (index != null) {
        const indexLimits = getInfo(parser);
        defaultStep = (indexLimits.maxIndex - indexLimits.minIndex) / index.length;
    }

    if (step == null || defaultStep == null || defaultStep > step) {
        return curve;
    }
    return decimate(curve, step / defaultStep);
};

const getCurvesLimits = function(parser, fileName, cache) {
    let limits = cache.get(fileName + '/curvesLimits');
    if (limits != null) {
        return limits;
    }
    limits = {};
    const section = findSectionGroup(parser);
    section.getCurveMnemonics().forEach((mnemonic) => {
        const curveData = getCurveData(parser, mnemonic, fileName, cache).filter(v => v != null && !isNaN(v));
        const min = MathUtil.getMin(curveData);
        const max = MathUtil.getMax(curveData);
        limits[mnemonic] = {
            min: min,
            max: max
        };
    });
    cache.set(fileName + '/curvesLimits', limits);
    return limits;
}

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
            const limits = req.body.limits;
            const step = req.body.step;
            const indexName = req.body.indexName;
            const fileName = path.join(folder, req.params.file);
            const fileContent = await getFileContent(fileName);
            const parser = ParserFactory.getParser(fileContent.toString());
            const curves = [];
            for(let i=0; i < inputCurves.length; i++) {
                const data = getCurveData(parser, inputCurves[i], fileName, cache, limits, step, indexName);
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

    // Gets min and max values of all curves
    app.get('/api/v1/las/:file/limits', async (req, res) => {
        try {
            if (!req.body) {
                res.status(status.BAD_REQUEST);
                return res.json({
                    errors: [status['400_MESSAGE']],
                });
            }
            const fileName = path.join(folder, req.params.file);
            const fileContent = await getFileContent(fileName);
            const parser = ParserFactory.getParser(fileContent.toString());
            const curvesLimits = getCurvesLimits(parser, fileName, cache);
            return res.json(curvesLimits);
        } catch(error) {
            logger.error(error);
            return res.status(status.BAD_REQUEST).json({
                errors: [status['400_MESSAGE']],
            });
        }
    });
}
