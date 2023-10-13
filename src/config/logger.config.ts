import type { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { Params } from 'nestjs-pino';
import { multistream } from 'pino';
import type { ReqId } from 'pino-http';

const passUrl = new Set(['/health']);

export const loggerOptions: Params = {
  pinoHttp: [
    {
      // https://getpino.io/#/docs/api?id=timestamp-boolean-function
      // Change time value in production log.
      // timestamp: stdTimeFunctions.isoTime,
      quietReqLogger: true,
      genReqId: (req): ReqId =>
        (<Request>req).header('X-Request-Id') ?? uuidv4(),
      ...(process.env['NODE_ENV'] === 'production'
        ? {}
        : {
            level: 'debug',
            // https://github.com/pinojs/pino-pretty
            transport: {
              target: 'pino-pretty',
              options: { sync: true, singleLine: true },
            },
          }),
      autoLogging: {
        ignore: (req) => passUrl.has((<Request>req).originalUrl),
      },
    },
    multistream(
      [
        // https://getpino.io/#/docs/help?id=log-to-different-streams
        { level: 'debug', stream: process.stdout },
        { level: 'error', stream: process.stderr },
        { level: 'fatal', stream: process.stderr },
      ],
      { dedupe: true },
    ),
  ],
};
