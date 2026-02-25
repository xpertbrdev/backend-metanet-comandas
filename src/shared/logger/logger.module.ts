import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const logDir = configService.get<string>('LOG_DIR', './logs');
        const logLevel = configService.get<string>('LOG_LEVEL', 'debug');
        const maxSize = configService.get<number>(
          'LOG_MAX_SIZE',
          10 * 1024 * 1024,
        ); // 10MB padrão

        return {
          pinoHttp: {
            level: logLevel,

            // Formato de serialização para requests HTTP
            serializers: {
              req(req) {
                return {
                  method: req.method,
                  url: req.url,
                  headers: req.headers,
                };
              },
              res(res) {
                return {
                  statusCode: res.statusCode,
                };
              },
            },

            // Transporte múltiplo: console + arquivo
            transport: {
              targets: [
                // Console com formatação legível (pino-pretty)
                {
                  target: 'pino-pretty',
                  level: logLevel,
                  options: {
                    colorize: true,
                    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
                    ignore: 'pid,hostname',
                    singleLine: false,
                  },
                },
                // Arquivo local com rotação diária e por tamanho
                {
                  target: 'pino-roll',
                  level: logLevel,
                  options: {
                    file: path.join(logDir, 'app'),
                    frequency: 'daily',
                    dateFormat: 'yyyy-MM-dd',
                    limit: {
                      count: 30, // Manter últimos 30 arquivos
                    },
                    size: maxSize,
                    mkdir: true,
                  },
                },
              ],
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
