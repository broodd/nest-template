import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { LogErrorsController } from './controllers';
import { LogErrorsService } from './services';
import { LogErrorEntity } from './entities';

/**
 * [description]
 */
@Module({
  imports: [TypeOrmModule.forFeature([LogErrorEntity])],
  controllers: [LogErrorsController],
  providers: [LogErrorsService],
  exports: [LogErrorsService],
})
export class LogsModule {}
