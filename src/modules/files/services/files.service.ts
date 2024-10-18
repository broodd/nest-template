import { Repository, EntityManager, FindOptionsWhere } from 'typeorm';
import { Injectable, ConflictException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { InjectRepository } from '@nestjs/typeorm';

import { MultipartBodyFile } from 'src/multipart/interfaces';
import { CommonService } from 'src/common/services';
import { ErrorTypeEnum } from 'src/common/enums';
import { StorageService } from 'src/multipart';

import { PaginationFilesDto } from '../dto';
import { FileEntity } from '../entities';

/**
 * [description]
 */
@Injectable()
export class FilesService extends CommonService<FileEntity, PaginationFilesDto> {
  /**
   * [description]
   * @param repository
   * @param storageService
   */
  constructor(
    @InjectRepository(FileEntity)
    public readonly repository: Repository<FileEntity>,
    private readonly storageService: StorageService,
  ) {
    super(FileEntity, repository, PaginationFilesDto);
  }

  /**
   * [description]
   * @param multipartFiles
   * @param entityManager
   * @param paths
   */
  @Transactional()
  public async createManyWithPaths(
    multipartFiles: AsyncIterableIterator<MultipartBodyFile>,
    entityManager?: EntityManager,
    ...paths: string[]
  ): Promise<FileEntity[]> {
    const entitiesLike = await this.storageService.createMany(multipartFiles, ...paths);
    const entities = this.repository.create(entitiesLike);
    return this.repository.save(entities, { transaction: false }).catch(async () => {
      await this.storageService.deleteManyInFolder(...paths);
      throw new ConflictException(ErrorTypeEnum.FILE_ALREADY_EXIST);
    });
  }

  /**
   * [description]
   * @param multipartFile
   * @param paths
   */
  @Transactional()
  public async createOne(
    multipartFile: MultipartBodyFile,
    ...paths: string[]
  ): Promise<FileEntity> {
    const entityLike = await this.storageService.createOne(multipartFile, ...paths);
    const entity = this.repository.create(entityLike);
    return this.repository.save(entity, { transaction: false }).catch(async () => {
      await this.storageService.deleteOne(entityLike.key);
      throw new ConflictException(ErrorTypeEnum.INPUT_DATA_ERROR);
    });
  }

  /**
   * [description]
   * @param conditions
   * @param file
   * @param entityManager
   */
  @Transactional()
  public async updateOne(
    conditions: FindOptionsWhere<FileEntity>,
    file: MultipartBodyFile,
  ): Promise<FileEntity> {
    const mergeIntoEntity = await this.selectOne(conditions, { loadEagerRelations: false });
    const entityLike = await this.storageService.createOne(file);
    const entity = this.repository.merge(mergeIntoEntity, entityLike);
    return this.repository.save(entity, { transaction: false }).catch(() => {
      this.storageService.deleteOne(entityLike.key);
      throw new ConflictException(ErrorTypeEnum.INPUT_DATA_ERROR);
    });
  }

  /**
   * [description]
   * @param conditions
   * @param entityManager
   */
  @Transactional()
  public async deleteOne(conditions: FindOptionsWhere<FileEntity>): Promise<FileEntity> {
    const entity = await super.deleteOne(conditions);
    await this.storageService.deleteOne(entity.key);
    return entity;
  }
}
