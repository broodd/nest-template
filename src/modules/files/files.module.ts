import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

// import { FilesController } from './controllers';
import { FilesService } from './services';
import { FileEntity } from './entities';

/**
 * [description]
 */
@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  // controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
