import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class MediaMappingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const mapper = (value: any) => ({
      id: value.id,
      title: value.title,
      description: value.description,
      source: value.sourceId,
      thumbnail: value.thumbnailId,
      keywords: value.keywords,
      createdAt: value.createdAt,
    });
    return next
      .handle()
      .pipe(tap((value) => console.log('interceptor before is:', value)))
      .pipe(
        map((value: any) => {
          if (Array.isArray(value)) {
            return value.map(mapper);
          } else {
            return mapper(value);
          }
        }),
      )
      .pipe(tap((value) => console.log('interceptor after is:', value)));
  }
}
