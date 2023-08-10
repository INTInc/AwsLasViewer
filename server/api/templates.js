import status from 'http-status';
import path from 'path';
import {getLogger} from '../utils/log';
export const templates = (app, connector) => {
    const logger = getLogger(import.meta.url);
    const folder = 'templates';
    app.get('/api/v1/templates', async (req, res) => {
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
     app.get('/api/v1/templates/:file', async (req, res) => {
        try {
            const fileName = path
                .join(folder, req.params.file)
                .replace('\\', '/');
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
