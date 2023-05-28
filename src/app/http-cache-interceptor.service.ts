import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {
  private cache: Map<string, HttpResponse<any>> = new Map();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if the request is cacheable
    if (request.method !== 'GET') {
      return next.handle(request);
    }

    // Check if the response is cached
    const cachedResponse: HttpResponse<any> | undefined = this.cache.get(request.url);
    if (cachedResponse) {
      return of(cachedResponse.clone());
    }

    // Forward the request and cache the response
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.cache.set(request.url, event.clone());
        }
      })
    );
  }
}
