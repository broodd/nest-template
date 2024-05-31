import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/modules/users/entities';

class ImportResultAffectedRowDto<ImportRowDto> {
  /**
   * [description]
   */
  @ApiProperty()
  public error: string[];

  /**
   * [description]
   */
  @ApiProperty()
  public data: Partial<ImportRowDto>;
}

/**
 * [description]
 */
export class ImportResultDto<ImportRowDto> {
  /**
   * [description]
   */
  @ApiProperty()
  public created = 0;

  /**
   * [description]
   */
  @ApiProperty()
  public updated = 0;

  /**
   * [description]
   */
  @ApiProperty()
  public affected = 0;

  /**
   * [description]
   */
  @ApiProperty({ type: () => [UserEntity] })
  public createdRows?: Partial<UserEntity>[] = [];

  /**
   * [description]
   */
  @ApiProperty()
  public affectedRows: ImportResultAffectedRowDto<ImportRowDto>[] = [];
}
