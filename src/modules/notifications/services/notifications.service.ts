import { Repository, DeepPartial, UpdateResult, EntityManager, FindOptionsWhere } from 'typeorm';
import { BaseMessage, Message, Notification } from 'firebase-admin/messaging';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { messaging } from 'firebase-admin';

import { CommonService } from 'src/common/services';
import { ErrorTypeEnum } from 'src/common/enums';

import { UserNotificationTokensService, UsersService } from 'src/modules/users/services';
import { UserNotificationTokenEntity } from 'src/modules/users/entities';

import { PaginationNotificationsDto } from '../dto';
import { NotificationsStatusEnum } from '../enums';
import { NotificationEntity } from '../entities';

/**
 * [description]
 */
@Injectable()
export class NotificationsService extends CommonService<
  NotificationEntity,
  PaginationNotificationsDto
> {
  /**
   * [description]
   * @param repository
   * @param userNotificationTokensService
   * @param usersService
   */
  constructor(
    @InjectRepository(NotificationEntity)
    public readonly repository: Repository<NotificationEntity>,
    public readonly userNotificationTokensService: UserNotificationTokensService,
    public readonly usersService: UsersService,
  ) {
    super(NotificationEntity, repository, PaginationNotificationsDto);
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   * @param entityManager
   */
  public async updateMany(
    conditions: FindOptionsWhere<NotificationEntity> = { status: NotificationsStatusEnum.UNREAD },
    entityLike: DeepPartial<NotificationEntity> = { status: NotificationsStatusEnum.READ },
    entityManager?: EntityManager,
  ): Promise<UpdateResult> {
    return this.repository.manager.transaction((notificationEntityManager) => {
      const transactionalEntityManager = entityManager ? entityManager : notificationEntityManager;

      return transactionalEntityManager
        .update(NotificationEntity, conditions, entityLike)
        .catch(() => {
          throw new NotFoundException(ErrorTypeEnum.NOT_FOUND_ERROR);
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
      .selectMany({ where: conditions })
      .then((data) => data.map((el) => el.token));
    return messaging().sendMulticast({
      ...this.generateNotificationProps(entity),
      tokens,
    });
  }
}
