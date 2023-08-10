import creds from './awscreds.js';
import {GetObjectCommand, ListObjectsCommand, S3Client} from '@aws-sdk/client-s3';

import {Connector} from '../connector';
export class AWSConnector extends Connector {
    constructor() {
        super();
        this.s3 = new S3Client({
            region: creds.region,
            credentials: {
                accessKeyId: creds.accessKeyId,
                secretAccessKey: creds.secretAccessKey,
            }
          });
    }
    async getFiles(folder) {
        const cmd = new ListObjectsCommand({
            Bucket: creds.bucket,
            Prefix: folder
        });
        const resp = await this.s3.send(cmd);
        const files = resp.Contents
            .map((f) => f.Key.split('/')[1])
            .filter((f) => f !== '');
        return files;
    }
    async getFile(path, options) {
        const cmd = new GetObjectCommand({
            Bucket: creds.bucket,
            Key: path
        });
        const resp = await this.s3.send(cmd);
        const content = await resp.Body.transformToString(options['encoding']);
        return content;
    };
}
