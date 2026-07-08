import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerService } from './logger/logger.service';
import { MessageFormatterService } from './message-formatter/message-formatter.service';
import { TasksModule } from './tasks/tasks.module';
import { appConfig } from './config/app.config';
import { typeOrmConfig } from './config/database.config';
import { ConfigType, appConfigSchema } from './config/config.types';
import { TypedConfigService } from './config/typed-config.service';
import { Task } from './tasks/task.entity';
import { User } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: TypedConfigService) => ({
        ...configService.get<ConfigType['database']>('database'),
        entities: [Task, User],
      }),
    }),
    // TypeOrmModule.forRoot(typeOrmConfig()),
    ConfigModule.forRoot({
      load: [appConfig, typeOrmConfig],
      validationSchema: appConfigSchema,
      validationOptions: {
        abortEarly: true, // Personally, I prefer it to be false which is its default value
      },
    }),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoggerService,
    MessageFormatterService,
    {
      provide: TypedConfigService,
      useExisting: ConfigService,
    },
  ],
})
export class AppModule {}
