import { DeleteObjectCommandOutput } from '@aws-sdk/client-s3';
import { FindOptionsWhere, Repository, In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { ConflictException, forwardRef, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CommonService } from 'src/common/services';
import { ErrorTypeEnum } from 'src/common/enums';

import { StorageService } from 'src/multipart/services/storage.service';
import { MultipartBodyFile } from 'src/multipart/interfaces';

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
    @Inject(forwardRef(() => StorageService))
    public readonly storageService: StorageService,
  ) {
    super(FileEntity, repository, PaginationFilesDto);
  }

  /**
   * [description]
   * @param multipartFiles
   * @param paths
   */
  @Transactional()
  public async createManyWithPaths(
    multipartFiles: Array<MultipartBodyFile>,
    ...paths: string[]
  ): Promise<FileEntity[]> {
    const entitiesLike = await this.storageService.createMany(multipartFiles, ...paths);
    const entities = this.repository.create(entitiesLike);
    return this.repository.save(entities).catch(async (error) => {
      await this.storageService.deleteMany(entitiesLike.map((el) => el.key));
      throw new ConflictException({ message: ErrorTypeEnum.INPUT_DATA_ERROR, error });
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
    return this.repository.save(entity).catch(async (error) => {
      await this.storageService.deleteOne(entityLike.key);
      throw new ConflictException({ message: ErrorTypeEnum.INPUT_DATA_ERROR, error });
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
    return this.repository.save(entity).catch(async (error) => {
      await this.storageService.deleteOne(entityLike.key);
      throw new ConflictException({ message: ErrorTypeEnum.INPUT_DATA_ERROR, error });
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

  /**
   * [description]
   * @param value
   */
  public isMultipartBodyFile(value: any): value is MultipartBodyFile {
    return value && typeof value === 'object' && 'data' in value && Buffer.isBuffer(value.data);
  }

  /**
   * [description]
   * @param value
   */
  public isFileEntity(value: any): value is FileEntity {
    return value instanceof FileEntity || (value && typeof value === 'object' && 'id' in value);
  }

  /**
   * Utility function to get only the multipart fields
   * @param data
   */
  public getMultipartFields<T>(
    data: T,
    fileRelationFields: string[],
  ): [string, MultipartBodyFile | Array<MultipartBodyFile>][] {
    try {
      return Object.entries(data)
        .map((field) => {
          const key = field[0];
          const value = field[1];

          if (Array.isArray(value) && !value.length) return null;

          if (value && fileRelationFields.includes(key)) return field;
        })
        .filter((el) => !!el);
    } catch {
      return [];
    }
  }

  /**
   * [description]
   * @param multipartFields
   * @param paths
   */
  public createManyFromMultipartFields(
    multipartFields: [
      string,
      FileEntity | MultipartBodyFile | Array<MultipartBodyFile | FileEntity>,
    ][],
    ...paths: string[]
  ): Promise<[string, FileEntity | FileEntity[]][]> {
    const promises = multipartFields.map<Promise<[string, FileEntity | FileEntity[]]>>(
      async ([field, value]) => {
        /**
         * Handle one file in field
         */
        if (this.isFileEntity(value)) {
          return [field, value];
        }

        if (this.isMultipartBodyFile(value)) {
          const file = await this.createOne(value, ...paths);
          return [field, file];
        }

        /**
         * Handle array of files
         */
        const existsFiles =
          (value?.filter((file) => this.isFileEntity(file)) as FileEntity[]) ?? [];
        const newFiles =
          (value?.filter((file) => !this.isFileEntity(file)) as MultipartBodyFile[]) ?? [];

        let selectedFiles = [];
        if (existsFiles.length)
          selectedFiles = await this.selectMany({
            where: { id: In(existsFiles.map((file) => file.id)) },
          });

        const createdFiles = await this.createManyWithPaths(newFiles, ...paths);

        return [field, selectedFiles.concat(createdFiles)];
      },
    );

    return Promise.all(promises);
  }

  /**
   * [description]
   * @param entityMultipartFiles
   */
  public async deleteManyByMultipartFields(
    entityMultipartFiles: [string, FileEntity | FileEntity[]][],
  ): Promise<DeleteObjectCommandOutput> {
    if (!entityMultipartFiles.length) return null;

    return this.storageService.deleteMany(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      entityMultipartFiles.flatMap(([_, value]) => [].concat(value).map((item) => item.key)),
    );
  }
}
