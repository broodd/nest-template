import { PaginationMixin } from 'src/common/dto';

import { FileEntity } from '../entities';

/**
 * [description]
 */
export class PaginationFilesDto extends PaginationMixin(FileEntity) {
  /**
   * [description]
   * @param result
   * @param total
   */
  constructor([result, total]: [FileEntity[], number]) {
    super();
    Object.assign(this, { result, total });
  }
}
