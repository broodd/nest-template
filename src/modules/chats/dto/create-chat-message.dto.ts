import { ApiProperty } from '@nestjs/swagger';
import {
  ValidateNested,
  IsNotEmpty,
  ValidateIf,
  IsOptional,
  MaxLength,
  IsString,
  IsEnum,
} from 'class-validator';

import { ID } from 'src/common/dto';

import { ChatEntity, ChatMessageEntity } from '../entities';
import { ChatMessageTypeEnum } from '../enums';

/**
 * [description]
 */
export class CreateChatMessageDto {
  /**
   * [description]
   */
  @IsNotEmpty()
  @IsEnum(ChatMessageTypeEnum)
  @ApiProperty({ enum: ChatMessageTypeEnum, default: ChatMessageTypeEnum.TEXT })
  public readonly type = ChatMessageTypeEnum.TEXT;

  /**
   * [description]
   */
  @IsNotEmpty()
  @ValidateNested()
  @ApiProperty({ type: () => ID })
  public readonly chat: ID;

  /**
   * [description]
   */
  @IsOptional()
  @ValidateNested()
  @ApiProperty({ type: () => ID })
  public readonly reply?: ID;

  /**
   * [description]
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(6e4)
  @ValidateIf((o) => o.type === ChatMessageTypeEnum.TEXT)
  public readonly text?: string;

  /**
   * [description]
   */
  @IsOptional()
  @ValidateNested()
  @ApiProperty({ type: () => ID })
  @ValidateIf((o) => o.type === ChatMessageTypeEnum.FILE)
  public readonly file?: ID;
}

/**
 * [description]
 */
export class ChatReceiveMessageDto {
  /**
   * [description]
   */
  @ApiProperty({ type: () => ChatEntity })
  public readonly chat: Partial<ChatEntity>;

  /**
   * [description]
   */
  @ApiProperty({ type: () => ChatMessageEntity })
  public readonly message: Partial<ChatMessageEntity>;

  /**
   * [description]
   * @param data
   */
  constructor(data: { chat: Partial<ChatEntity>; message: Partial<ChatMessageEntity> }) {
    Object.assign(this, data);
  }
}
