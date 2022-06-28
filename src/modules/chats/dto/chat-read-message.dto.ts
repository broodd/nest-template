import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ID } from 'src/common/dto';
import { ChatEntity, ChatMessageEntity } from '../entities';

/**
 * [description]
 */
export class ChatReadMessageDto extends ID {
  /**
   * [description]
   */
  @IsNotEmpty()
  @ValidateNested()
  @ApiProperty({ type: () => ID })
  public readonly chat: ID;
}

/**
 * [description]
 */
export class ChatReadMessageResponseDto {
  /**
   * [description]
   */
  @ApiProperty({ type: () => ID })
  public readonly chat: ID;

  /**
   * [description]
   */
  @ApiProperty({ type: () => ID })
  public readonly message: ID;

  /**
   * [description]
   * @param data
   */
  constructor(data: { chat: Partial<ChatEntity>; message: Partial<ChatMessageEntity> }) {
    Object.assign(this, data);
  }
}
