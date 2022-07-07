import { Injectable, NotFoundException } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseMessage, Message, Notification } from 'firebase-admin/messaging';
import { messaging } from 'firebase-admin';
import {
  Repository,
  DeepPartial,
  SaveOptions,
  UpdateResult,
  RemoveOptions,
  FindOneOptions,
  FindManyOptions,
  FindOptionsWhere,
  FindOptionsUtils,
  SelectQueryBuilder,
} from 'typeorm';

import { ErrorTypeEnum } from 'src/common/enums';

import { UserNotificationTokensService, UsersService } from 'src/modules/users/services';
import { UserEntity, UserNotificationTokenEntity } from 'src/modules/users/entities';

import { PaginationNotificationsDto, SelectNotificationsDto } from '../dto';
import { NotificationsStatusEnum } from '../enums';
import { NotificationEntity } from '../entities';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    public readonly notificationEntityRepository: Repository<NotificationEntity>,
    public readonly userNotificationTokensService: UserNotificationTokensService,
    public readonly usersService: UsersService,
  ) {}

  /**
   * [description]
   * @param entitiesLike
   * @param options
   */
  public async createMany(
    entitiesLike: Partial<NotificationEntity>[],
    options: SaveOptions = { transaction: false },
  ): Promise<NotificationEntity[]> {
    return this.notificationEntityRepository.manager.transaction(async () => {
      const entities = this.notificationEntityRepository.create(entitiesLike);
      return this.notificationEntityRepository.save(entities, options).catch(() => {
        throw new NotFoundException(ErrorTypeEnum.NOTIFICATIONS_ALREADY_EXIST);
      });
    });
  }

  /**
   * [description]
   * @param entityLike
   * @param options
   */
  public async createOne(
    entityLike: Partial<NotificationEntity>,
    options: SaveOptions = { transaction: false },
  ): Promise<NotificationEntity> {
    return this.notificationEntityRepository.manager.transaction(async () => {
      const entity = this.notificationEntityRepository.create(entityLike);
      return this.notificationEntityRepository.save(entity, options).catch(() => {
        throw new NotFoundException(ErrorTypeEnum.NOTIFICATION_ALREADY_EXIST);
      });
    });
  }

  /**
   *  [description]
   * @param optionsOrConditions
   */
  public find(
    optionsOrConditions?: FindManyOptions<NotificationEntity>,
  ): SelectQueryBuilder<NotificationEntity> {
    const metadata = this.notificationEntityRepository.metadata;
    const qb = this.notificationEntityRepository.createQueryBuilder(
      FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name,
    );

    if (
      !FindOptionsUtils.isFindManyOptions(optionsOrConditions) ||
      optionsOrConditions.loadEagerRelations !== false
    ) {
      FindOptionsUtils.joinEagerRelations(qb, qb.alias, metadata);

      /**
       * Place for common relation
       * @example qb.leftJoinAndSelect('NotificationEntity.relation_field', 'NotificationEntity_relation_field')
       */
    }

    return qb.setFindOptions(optionsOrConditions);
  }

  /**
   * [description]
   * @param options
   * @param owner
   */
  public async selectAll(
    options: SelectNotificationsDto,
    owner?: Partial<UserEntity>,
  ): Promise<PaginationNotificationsDto> {
    const qb = this.find(instanceToPlain(options));
    if (owner) qb.andWhere({ owner });

    const data = await qb.getManyAndCount().catch(() => {
      throw new NotFoundException(ErrorTypeEnum.NOTIFICATIONS_NOT_FOUND);
    });
    await this.updateAll();

    return new PaginationNotificationsDto(data);
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async selectOne(
    conditions: FindOptionsWhere<NotificationEntity>,
    options: FindOneOptions<NotificationEntity> = { loadEagerRelations: false },
  ): Promise<NotificationEntity> {
    return this.find({ ...instanceToPlain(options), where: conditions })
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.NOTIFICATION_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   */
  public async updateAll(
    conditions: FindOptionsWhere<NotificationEntity> = { status: NotificationsStatusEnum.UNREAD },
    entityLike: DeepPartial<NotificationEntity> = { status: NotificationsStatusEnum.READ },
  ): Promise<UpdateResult> {
    return this.notificationEntityRepository.manager.transaction((transactionalEntityManager) =>
      transactionalEntityManager.update(NotificationEntity, conditions, entityLike).catch(() => {
        throw new NotFoundException(ErrorTypeEnum.NOTIFICATIONS_NOT_FOUND);
      }),
    );
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   * @param options
   */
  public async updateOne(
    conditions: FindOptionsWhere<NotificationEntity>,
    entityLike: Partial<NotificationEntity>,
    options: SaveOptions = { transaction: false },
  ): Promise<NotificationEntity> {
    return this.notificationEntityRepository.manager.transaction(async () => {
      const mergeIntoEntity = await this.selectOne(conditions);
      const entity = this.notificationEntityRepository.merge(mergeIntoEntity, entityLike);
      const { id } = await this.notificationEntityRepository.save(entity, options).catch(() => {
        throw new NotFoundException(ErrorTypeEnum.NOTIFICATION_NOT_FOUND);
      });
      return this.selectOne({ id }, { loadEagerRelations: true });
    });
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async deleteOne(
    conditions: FindOptionsWhere<NotificationEntity>,
    options: RemoveOptions = { transaction: false },
  ): Promise<NotificationEntity> {
    return this.notificationEntityRepository.manager.transaction(async () => {
      const entity = await this.selectOne(conditions);
      return this.notificationEntityRepository.remove(entity, options).catch(() => {
        throw new NotFoundException(ErrorTypeEnum.NOTIFICATION_NOT_FOUND);
      });
    });
  }

  /**
   * [description]
   * @param entity
   */
  public generateNotificationProps(entity: Partial<NotificationEntity>): BaseMessage {
    const notification: Notification = { title: entity.title };
    const data = { json: JSON.stringify(entity) };
    return { notification, data };
  }

  /**
   * [description]
   * @param conditions
   * @param data
   */
  public async sendAndCreateOneForManyMulticast(
    conditions: FindOptionsWhere<UserNotificationTokenEntity>,
    data: Partial<NotificationEntity>,
  ): Promise<any> {
    const users = await this.usersService
      .find({ where: conditions, select: { id: true }, relations: { notificationTokens: true } })
      .getMany();
    await this.createMany(users.map((user) => ({ ...data, owner: { id: user.id } })));

    const tokens = users.reduce<string[]>(
      (acc, current) => (acc.concat(current.notificationTokens.map((el) => el.token)), acc),
      [],
    );
    return messaging().sendMulticast({
      ...this.generateNotificationProps(data),
      tokens,
    });
  }

  /**
   * [description]
   * @param conditions
   * @param data
   */
  public async sendAndCreateOneForMany(
    conditions: FindOptionsWhere<UserNotificationTokenEntity>,
    data: Partial<NotificationEntity>,
  ): Promise<any> {
    const users = await this.usersService
      .find({ where: conditions, select: { id: true }, relations: { notificationTokens: true } })
      .getMany();
    const entities = await this.createMany(
      users.map((user) => ({ ...data, owner: { id: user.id } })),
    );

    const messages = users.reduce<Message[]>((acc, current, index) => {
      if (current.notificationTokens.length) {
        const entity = entities[index];
        const data = this.generateNotificationProps(entity);
        const messages = current.notificationTokens.map<Message>((el) => ({
          ...data,
          token: el.token,
        }));
        acc.concat(messages);
      }
      return acc;
    }, []);
    return messaging().sendAll(messages);
  }

  /**
   * [description]
   * @param conditions
   * @param data
   */
  public async sendAndCreateOneForOne(
    conditions: FindOptionsWhere<UserNotificationTokenEntity>,
    data: Partial<NotificationEntity>,
  ): Promise<any> {
    const entity = await this.createOne(data);
    const tokens = await this.userNotificationTokensService
      .selectAll({ where: conditions })
      .then((data) => data.map((el) => el.token));
    return messaging().sendMulticast({
      ...this.generateNotificationProps(entity),
      tokens,
    });
  }
}
