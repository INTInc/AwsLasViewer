import creds from './awscreds.js';
import S3 from 'aws-sdk/clients/s3.js';

import {Connector} from '../connector';
export class AWSConnector extends Connector {
    constructor() {
        super();
        this.s3 = new S3({
            region: creds.region,
            accessKeyId: creds.accessKeyId,
            secretAccessKey: creds.secretAccessKey,
          });
    }
    async getFiles(folder) {
        return new Promise((resolve, reject) => {
            this.s3.listObjects({
                Bucket: creds.bucket,
                Prefix: folder
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const files = data.Contents.map((fileObject) => fileObject.Key.split('/')[1]);
                    resolve(files);
                }
            });
        });
    }
    async getFile(path) {
        return new Promise((resolve, reject) => {
          this.s3.getObject({Bucket: creds.bucket, Key: path}, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.Body);
            }
          });
        });
    };      
}