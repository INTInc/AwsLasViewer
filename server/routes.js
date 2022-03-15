import {Factory} from './connector/factory';
import {las} from './api/las';
import {templates} from './api/templates';
import {tops} from './api/tops';

export const routes = (app, local, path, cache) => {
    const connector = Factory.getInstance().create(local, path);
    las(app, connector, cache);
    templates(app, connector);
    tops(app, connector);
};
