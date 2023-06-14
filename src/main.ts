const cluster = require('node:cluster');
import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { cpus } from 'node:os';
import { AppModule } from './app.module';

const bootstrap = async (
  app: INestApplication,
  config: ConfigService<unknown, boolean>,
) => {
  await app.listen(config.get<number>('PORT'), () => {
    console.info(`Server running on ${config.get<number>('PORT')} 🚀`);
  });
};

const createFork = async () => {
  // const numCPUs = cpus();
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get(ConfigService);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  bootstrap(app, config);

  // if (cluster.isPrimary) {
  //   numCPUs.forEach(() => cluster.fork());

  //   cluster.on('exit', () => {
  //     cluster.fork();
  //   });
  // } else {
  //   bootstrap(app, config);
  // }
};

createFork();
