import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { CommonService } from 'src/common/services';
import { PaginationDto } from 'src/common/dto';

import { LogErrorEntity } from '../entities';
import {} from '../dto';

/**
 * [description]
 */
@Injectable()
export class LogErrorsService extends CommonService<LogErrorEntity, PaginationDto<LogErrorEntity>> {
  /**
   * [description]
   * @param repository
   */
  constructor(
    @InjectRepository(LogErrorEntity)
    public readonly repository: Repository<LogErrorEntity>,
  ) {
    super(LogErrorEntity, repository, PaginationDto<LogErrorEntity>);
  }

  /**
   * [description]
   * @param obj
   */
  public sanitizeBody(obj: any): any {
    try {
      if (obj == null) return obj;

      // If it's a Buffer → replace with placeholder
      if (Buffer.isBuffer(obj)) return '[FileBuffer]';

      // If it's an array → map recursively
      if (Array.isArray(obj)) {
        return obj.map((item) => this.sanitizeBody(item));
      }

      // If it's an object (e.g., file descriptor or nested data)
      if (typeof obj === 'object') {
        // Check if it's a Fastify file object (with Buffer `data`)
        if (obj.data && Buffer.isBuffer(obj.data)) {
          return {
            ...obj,
            data: '[FileBuffer]',
          };
        }

        const copy: Record<string, any> = {};
        for (const [key, value] of Object.entries(obj)) {
          // Remove sensitive fields
          // if (['password', 'temporaryPassword', 'newPassword', 'oldPassword'].includes(key)) {
          //   copy[key] = '[HIDDEN]';
          // } else {
          copy[key] = this.sanitizeBody(value);
          // }
        }
        return copy;
      }

      return obj;
    } catch {
      return null;
    }
  }
}
