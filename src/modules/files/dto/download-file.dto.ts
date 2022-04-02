import { IsBoolean, IsOptional } from 'class-validator';
import { ID } from 'src/common/dto';

/**
 * [description]
 */
export class DownloadFileDto extends ID {
  /**
   * [description]
   */
  @IsOptional()
  @IsBoolean()
  public readonly download?: boolean;
}
