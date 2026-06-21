import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerService } from './logger/logger.service';
import { MessageFormatterService } from './message-formatter/message-formatter.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { typeOrmConfig } from './config/database.config';
import { appConfigSchema } from './config/config.types';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, typeOrmConfig],
      validationSchema: appConfigSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService, MessageFormatterService],
})
export class AppModule {}
