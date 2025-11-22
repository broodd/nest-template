import { catchError, Observable, tap } from 'rxjs';
import { FastifyRequest } from 'fastify';

import { ExecutionContext, NestInterceptor, CallHandler, Injectable } from '@nestjs/common';

import { LogErrorsService } from 'src/modules/logs/services';
import { LogErrorEntity } from 'src/modules/logs/entities';

/**
 * [description]
 */
@Injectable()
export class ErrorLogsInterceptor implements NestInterceptor {
  constructor(private readonly logErrorsService: LogErrorsService) {}

  /**
   * [description]
   * @param context
   * @param next
   */
  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    return next.handle().pipe(
      tap(async (response) => {
        try {
          if (request.method === 'GET') return response;

          const url = request.routeOptions?.url?.replace('/api/v1/', '') ?? request.url;
          if (url === 'logs/errors' || url === 'status') return response;
          const userId = request.user?.id;

          const logData: Partial<LogErrorEntity> = {
            url,
            userId,
            method: request.method,
            body: this.logErrorsService.sanitizeBody(request.body),
            query: request.query,
            params: request.params,
            error: null,
          };

          await this.logErrorsService.createOne(logData);
          return response;
        } catch {}
      }),
      catchError(async (error) => {
        try {
          const url = request.routeOptions.url.replace('/api/v1/', '');
          if (url === 'logs/errors') throw error;

          const userId = request.user?.id;

          const logData: Partial<LogErrorEntity> = {
            url,
            userId,
            method: request.method,
            body: this.logErrorsService.sanitizeBody(request.body),
            query: request.query,
            params: request.params,
            error: JSON.stringify(error),
          };

          await this.logErrorsService.createOne(logData);
        } catch {}

        throw error;
      }),
    );
  }
}
