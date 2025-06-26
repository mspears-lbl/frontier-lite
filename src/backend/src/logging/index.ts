import * as winston from "winston";
import * as path from 'path';

// const myFormat = winston.format.printf(info => {
//     return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
// });

// Return the last folder name in the path and the calling
// module's filename.
function getLabel (callingModule: NodeModule): string {
    var parts = callingModule.filename.split(path.sep);
    if (parts && parts.length >= 2) {
        return path.join(parts[parts.length - 2], parts[parts.length - 1]);
    }
    else {
        return '';
    }
};

/** Name of the applciation in the logs */
const appName = (process.env.APP_NAME || 'rpp') + '-node';
// const logFile = path.join(__dirname, '../../logs/epb.log')
// const logPath = process.env.BACKEND_LOG_PATH || path.join(__dirname, '../../logs')
// const logName = process.env.BACKEND_LOG_NAME || 'welder.log'
// const logFile = path.join(logPath, logName);

// console.log(`logging to ${logFile}`)

export function createLogger(callingModule: NodeModule) {
    return winston.createLogger({
        transports: [
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.label({ label: getLabel(callingModule) }),
                    winston.format.timestamp(),
                    // winston.format.json(),
                    winston.format.printf(info => {
                        return `${info.timestamp} [${info.label}] [${info.level}] : ${info.message}`;
                    }),
                    // winston.format.prettyPrint(),
                )
            })
            // new winston.transports.File({
            //     level: 'debug',
            //     filename: logFile,
            //     format: winston.format.combine(
            //         winston.format.label({ label: getLabel(callingModule) }),
            //         winston.format.timestamp(),
            //         // winston.format.json(),
            //         winston.format.printf(info => {
            //             // return `${info.timestamp} [${info.label}] [${info.level}] : ${info.message}`;
            //             return JSON.stringify({
            //                 "@timestamp": info.timestamp,
            //                 "event.dataset": appName,
            //                 label: info.label,
            //                 level: info.level,
            //                 message: info.message
            //             })
            //         }),
            //         // winston.format.prettyPrint(),
            //         // winston.format.logstash()
            //     ),
            // })
        ]
    });
};
