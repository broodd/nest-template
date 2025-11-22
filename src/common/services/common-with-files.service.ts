import {
  runOnTransactionRollback,
  runOnTransactionCommit,
  Transactional,
} from 'typeorm-transactional';
import { DeepPartial, Repository } from 'typeorm';

import { ConflictException, NotFoundException, Type } from '@nestjs/common';

import {
  FindManyBracketsOptions,
  FindOneBracketsOptions,
  GeneratePathCallback,
} from 'src/common/interfaces';
import { ErrorTypeEnum } from 'src/common/enums';

import { StorageService } from 'src/multipart/services/storage.service';

import { FilesService } from 'src/modules/files/services';
import { FileEntity } from 'src/modules/files/entities';

import { CommonEntity } from '../entities';

import { CommonService } from './common.service';

/**
 * [description]
 */
export class CommonWithFilesService<
  EntityClass extends CommonEntity,
  PaginationClass,
> extends CommonService<EntityClass, PaginationClass> {
  /**
   * [description]
   * @param entityClass
   * @param repository
   * @param paginationClass
   * @param errorPrefix
   */
  constructor(
    public readonly entityClass: Type<EntityClass>,
    public readonly repository: Repository<EntityClass>,
    public readonly paginationClass: Type<PaginationClass>,
    public readonly storageService: StorageService,
    public readonly filesService: FilesService,
    public readonly errorPrefix: string = '',
  ) {
    super(entityClass, repository, paginationClass, errorPrefix);
  }

  /**
   * [description]
   * @param entityLike
   * @param generatePathCallback
   */
  @Transactional()
  public async createOneWithFiles(
    entityLike: DeepPartial<EntityClass>,
    generatePathCallback: GeneratePathCallback<EntityClass> = (entity) => entity.id,
  ): Promise<EntityClass> {
    const entity = await this.createOne(entityLike);

    const fileRelations = this.repository.metadata.relations
      .filter((relation) => relation.inverseEntityMetadata.target === FileEntity)
      .map((relation) => relation.propertyName);
    const multipartFields = this.filesService.getMultipartFields(entityLike, fileRelations);
    const entityMultipartFiles = await this.filesService.createManyFromMultipartFields(
      multipartFields,
      ...[].concat(generatePathCallback(entity)),
    );

    runOnTransactionRollback(async () => {
      await this.filesService.deleteManyByMultipartFields(entityMultipartFiles);
    });

    if (entityMultipartFiles.length) {
      const entityFileFields = Object.fromEntries(entityMultipartFiles);
      Object.assign(entity, entityFileFields);
      return this.updateOneFromEntity(entity, null);
    }
    return entity;
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   * @param generatePathCallback
   */
  @Transactional()
  public async updateOneWithFiles(
    conditions: FindOneBracketsOptions<EntityClass>['where'],
    entityLike: DeepPartial<EntityClass>,
    generatePathCallback: GeneratePathCallback<EntityClass> = (entity) => entity.id,
  ): Promise<EntityClass> {
    const mergeIntoEntity = await this.selectOne(conditions);

    const fileRelations = this.repository.metadata.relations
      .filter((relation) => relation.inverseEntityMetadata.target === FileEntity)
      .map((relation) => relation.propertyName);
    const multipartFields = this.filesService.getMultipartFields(entityLike, fileRelations);
    const entityMultipartFiles = await this.filesService.createManyFromMultipartFields(
      multipartFields,
      ...[].concat(generatePathCallback(mergeIntoEntity)),
    );

    runOnTransactionRollback(async () => {
      await this.filesService.deleteManyByMultipartFields(entityMultipartFiles);
    });

    runOnTransactionCommit(async () => {
      /**
       * Remove old files
       * When in entityLike pass Object or Array of exists FileEntity, it check and dont delete
       */
      const multipartFieldsForRemove = multipartFields.map<[string, FileEntity | FileEntity[]]>(
        ([key]) => {
          const fieldFiles = [].concat(mergeIntoEntity[key]);
          const fieldInputFiles = [].concat(entityLike[key]);

          const oldFiles = fieldFiles.filter(
            (file) => !fieldInputFiles.find((inputFile) => inputFile?.id === file?.id),
          );
          return [key, oldFiles];
        },
      );
      await this.filesService.deleteManyByMultipartFields(multipartFieldsForRemove);
    });

    const entity = Object.assign(
      this.repository.create(),
      mergeIntoEntity,
      entityLike,
      Object.fromEntries(entityMultipartFiles),
    );

    const { id } = await this.repository
      .save(entity)
      .catch((error) => this.throwError(ConflictException, ErrorTypeEnum.INPUT_DATA_ERROR, error));

    return this.selectOne({ id } as FindManyBracketsOptions<EntityClass>['where'], {
      loadEagerRelations: true,
    });
  }

  /**
   * [description]
   * @param conditions
   * @param generatePathCallback
   */
  @Transactional()
  public async deleteOneWithFiles(
    conditions: FindOneBracketsOptions<EntityClass>['where'],
    generatePathCallback: GeneratePathCallback<EntityClass> = (entity) => entity.id,
  ): Promise<EntityClass> {
    const entity = await this.selectOne(conditions, { loadEagerRelations: false });

    await this.storageService.deleteManyInFolder(...[].concat(generatePathCallback(entity)));

    return this.repository
      .remove(entity)
      .catch((error) => this.throwError(NotFoundException, ErrorTypeEnum.NOT_FOUND_ERROR, error));
  }

  /**
   * [description]
   * @param conditions
   * @param generatePathCallback
   */
  @Transactional()
  public async softDeleteOneWithFiles(
    conditions: FindOneBracketsOptions<EntityClass>['where'],
    generatePathCallback: GeneratePathCallback<EntityClass> = (entity) => entity.id,
  ): Promise<EntityClass> {
    const entity = await this.selectOne(conditions, { loadEagerRelations: false });

    await this.storageService.deleteManyInFolder(...[].concat(generatePathCallback(entity)));

    return this.repository
      .softRemove(entity)
      .catch((error) => this.throwError(NotFoundException, ErrorTypeEnum.NOT_FOUND_ERROR, error));
  }
}
