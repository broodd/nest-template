import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  ValidateNested,
  IsNotEmpty,
  ValidateIf,
  IsOptional,
  MaxLength,
  IsString,
} from 'class-validator';

import { ID } from 'src/common/dto';

import { ChatEntity, ChatMessageEntity } from '../../entities';

/**
 * [description]
 */
export class CreateChatMessageDto {
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
  @IsString()
  @IsNotEmpty()
  @MaxLength(5120)
  @ValidateIf((o) => o.text || !o.file)
  public readonly text?: string;

  /**
   * [description]
   */
  @ValidateNested()
  @ApiProperty({ type: () => ID })
  @ValidateIf((o) => o.file || !o.text)
  public readonly file?: ID;

  /**
   * [description]
   */
  @IsOptional()
  @ValidateNested()
  @ApiProperty({ type: () => ID })
  public readonly story?: ID;
}

/**
 * [description]
 */
export class CreateChatMessageTextDto extends PickType(CreateChatMessageDto, ['text']) {}

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
