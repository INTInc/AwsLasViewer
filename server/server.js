/* eslint-disable linebreak-style */
// Include the cluster module
import cluster from 'cluster';
import * as os from 'os';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import {routes} from './routes';
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 30 });  
// Code to run if we're in the master process
if (cluster.isMaster) {
    // Count the machine's CPUs
    const cpuCount = os.cpus().length;
    // Create a worker for each CPU
    for (let i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
    // Listen for terminating workers
    cluster.on('exit', (worker) => {
        // Replace the terminated workers
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();
    });
    // Code to run if we're in a worker process
} else { 
    yargs(hideBin(process.argv))
    .command({
      command: '*',
      builder: {
        mode: {
          type: 'string',
        },
        path: {
          type: 'string',
        },
      },
      handler(argv) {
        const app = express();
        app.use(cors());
        app.use(bodyParser.urlencoded({
            extended: false,
        }));
        // parse application/json
        app.use(bodyParser.json());
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
            // intercept OPTIONS method
            if ('OPTIONS' === req.method) {
                res.send(200);
            } else {
                next();
            }
        });
        routes(app, argv.mode==='dev', argv.path, cache);
        const port = process.env.PORT || 3000;
        // eslint-disable-next-line new-cap
        const server = http.Server(app);
        server.listen(port, () => {
            console.log('Server running at http://127.0.0.1:' + port + '/');
        });
      },
    })
    .argv;
}
