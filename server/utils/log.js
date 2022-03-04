import winston from 'winston';

export const getLogger = (url) => {
    return winston.createLogger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: 'debug',
                label: url,
            })
        ],
    });
};

