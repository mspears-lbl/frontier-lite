import * as path from 'path';
// load environment if not set
if (!process.env['APP_ENV_SET']) {
    console.log('Loading env...')
    require('dotenv').config({
        path: path.resolve(__dirname, '../../.env')
    })
}
else {
    console.log('backend env already set, not loading env file')
}
import express from 'express';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import { router as appRouter} from './app/routes';
import { router as authRouter } from './authentication/routes';
// import { router as adminRouter } from './admin/routes';
// import { router as fileStorageRouter } from './file-storage/routes';
import helmet from 'helmet';
import { authenticationConfig } from './authentication';
import morgan from 'morgan';
import { createLogger } from './logging';
import { errorResponse, logErrors } from './utils/error-handler';

const app: express.Express = express();
const port = process.env.NODE_PORT || 3000;

const logger = createLogger(module);

const morganOptions: morgan.Options<Request, Response> = { 
    stream: {
        write: (str: string) => {
            if (str.match(/HTTP\/1.1" 2/)) {
                logger.info(str);
            }
            else {
                logger.error(str);
            }
        }
    }
};
app.use(morgan('combined', morganOptions));

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.disable('etag');
app.disable('x-powered-by');

const whiteList = [
    'http://localhost:4200',
    'file://',
    'http://localhost',
    'https://localhost'
];
app.use(function (req, res, next) {
    const origin = req.headers.origin;
    
    // Allow requests from Electron apps (which may not have an origin or have file:// origin)
    if (!origin || origin.startsWith('file://')) {
        res.header('Access-Control-Allow-Origin', '*');
    } else {
        const index = whiteList.indexOf(origin);
        if (index >= 0) {
            res.header('Access-Control-Allow-Origin', whiteList[index]);
        }
    }
    
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    next();
});

// CORS configuration
// if (process.env.CORS_HOST) {
    // app.use(cors({
    //     // origin: 'http://localhost:4200'
    //     origin: process.env.CORS_HOST
    // }));
// }


// configure authentication
authenticationConfig(app);

// configure the api routes
app.use('/api', authRouter);
// app.use('/api', adminRouter);
app.use('/api', appRouter);
// app.use('/api', fileStorageRouter);

// initSwaggerUI(app, '', '/api/swagger/swg');

app.use(logErrors);
app.use(errorResponse);



// initSwaggerUI(app, '', '/api/swg');

app.use(helmet({
    // crossOriginEmbedderPolicy: false,
}));


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});