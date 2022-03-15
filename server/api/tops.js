import status from 'http-status';
import path from 'path';
import {getLogger} from '../utils/log';
export const tops = (app, connector) => {
    const logger = getLogger(import.meta.url);
    const folder = 'tops';
    app.get('/api/v1/tops', async (req, res) => {
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
     app.get('/api/v1/tops/:file', async (req, res) => {
        try {
            const fileName = path.join(folder, req.params.file);
            const fileContent = await connector.getFile(fileName, {'encoding': 'utf8'});
            return res.json(JSON.parse(fileContent));
        } catch(error) {
            logger.error(error);
            return res.status(status.BAD_REQUEST).json({
                errors: [status['400_MESSAGE']],
            });
        }
    });
}
