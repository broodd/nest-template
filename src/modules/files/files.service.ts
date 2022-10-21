import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { MultipartFile } from '@fastify/multipart';
import {
  Repository,
  EntityManager,
  FindOneOptions,
  FindManyOptions,
  FindOptionsUtils,
  FindOptionsWhere,
  SelectQueryBuilder,
} from 'typeorm';

import { FindManyBracketsOptions } from 'src/common/interfaces';
import { ErrorTypeEnum } from 'src/common/enums';
import { StorageService } from 'src/multipart';

import { PaginationFilesDto } from './dto';
import { FileEntity } from './entities';

/**
 * [description]
 */
@Injectable()
export class FilesService {
  /**
   * [description]
   * @param fileEntityRepository
   * @param storageService
   */
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileEntityRepository: Repository<FileEntity>,
    private readonly storageService: StorageService,
  ) {}

  /**
   * [description]
   * @param file
   * @param options
   */
  public async createOne(
    multipart: MultipartFile,
    data?: Partial<FileEntity>,
    entityManager?: EntityManager,
  ): Promise<FileEntity> {
    return this.fileEntityRepository.manager.transaction(async (fileEntityManager) => {
      const transactionalEntityManager = entityManager ? entityManager : fileEntityManager;

      const mergeIntoEntity = await this.storageService.createOne(multipart);
      const entityLike = this.fileEntityRepository.create(mergeIntoEntity);
      const entity = this.fileEntityRepository.merge(entityLike, data);
      return transactionalEntityManager.save(entity).catch(() => {
        this.storageService.deleteOne(entityLike.filename);
        throw new ConflictException(ErrorTypeEnum.FILE_ALREADY_EXIST);
      });
    });
  }

  /**
   *  [description]
   * @param optionsOrConditions
   */
  public find(optionsOrConditions?: FindManyOptions<FileEntity>): SelectQueryBuilder<FileEntity> {
    const metadata = this.fileEntityRepository.metadata;
    const qb = this.fileEntityRepository.createQueryBuilder(
      FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name,
    );

    if (
      !FindOptionsUtils.isFindManyOptions(optionsOrConditions) ||
      optionsOrConditions.loadEagerRelations !== false
    ) {
      FindOptionsUtils.joinEagerRelations(qb, qb.alias, metadata);

      /**
       * Place for common relation
       * @example qb.leftJoinAndSelect('FileEntity.relation_field', 'FileEntity_relation_field')
       */
    }

    return qb.setFindOptions(optionsOrConditions);
  }

  /**
   * [description]
   * @param options
   */
  public async selectAll(
    options: FindManyBracketsOptions<FileEntity> = { loadEagerRelations: false },
  ): Promise<PaginationFilesDto> {
    return this.find(options)
      .getManyAndCount()
      .then((data) => new PaginationFilesDto(data))
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.FILES_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async selectOne(
    conditions: FindOptionsWhere<FileEntity>,
    options: FindOneOptions<FileEntity> = { loadEagerRelations: false },
  ): Promise<FileEntity> {
    const qb = this.find({
      ...instanceToPlain(options),
      where: conditions,
    });

    /**
     * Check owner of file
     */
    /* if (owner && owner['role'] !== UserRoleEnum.ADMIN)
      qb.andWhere([{ owner: IsNull() }, { owner: { id: owner['id'] } }]);
    else if (!owner) qb.andWhere({ owner: IsNull() }); */

    return qb.getOneOrFail().catch(() => {
      throw new NotFoundException(ErrorTypeEnum.FILE_NOT_FOUND);
    });
  }

  /**
   * [description]
   * @param file
   * @param conditions
   * @param entityManager
   */
  public async updateOne(
    file: MultipartFile,
    conditions: FindOptionsWhere<FileEntity>,
    entityManager?: EntityManager,
  ): Promise<FileEntity> {
    return this.fileEntityRepository.manager.transaction(async (fileEntityManager) => {
      const transactionalEntityManager = entityManager ? entityManager : fileEntityManager;

      const mergeIntoEntity = await this.selectOne(conditions);
      const entityLike = await this.storageService.createOne(file);
      const entity = this.fileEntityRepository.merge(mergeIntoEntity, entityLike);
      return transactionalEntityManager.save(entity).catch(() => {
        this.storageService.deleteOne(entityLike.filename);
        throw new ConflictException(ErrorTypeEnum.FILE_ALREADY_EXIST);
      });
    });
  }

  /**
   * [description]
   * @param conditions
   * @param entityManager
   */
  public async deleteOne(
    conditions: FindOptionsWhere<FileEntity>,
    entityManager?: EntityManager,
  ): Promise<FileEntity> {
    return this.fileEntityRepository.manager.transaction(async (fileEntityManager) => {
      const transactionalEntityManager = entityManager ? entityManager : fileEntityManager;

      const entity = await this.selectOne(conditions);
      this.storageService.deleteOne(entity.filename);
      return transactionalEntityManager.remove(entity).catch(() => {
        throw new NotFoundException(ErrorTypeEnum.FILE_NOT_FOUND);
      });
    });
  }
}
