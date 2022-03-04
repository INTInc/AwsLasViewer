import {LocalConnector} from './local/localconnector';
import {AWSConnector} from './aws/awsconnector';
export class Factory {
    static _instance = null;
    static getInstance() {
        if (!Factory._instance) {
            Factory._instance = new Factory();
        }
        return Factory._instance;
    }
    create(local, path) {
        return local ? new LocalConnector(path) : new AWSConnector();
    }
}
