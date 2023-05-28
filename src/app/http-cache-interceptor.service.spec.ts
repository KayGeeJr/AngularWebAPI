import { TestBed } from '@angular/core/testing';

import { HttpCacheInterceptorService } from './http-cache-interceptor.service';

describe('HttpCacheInterceptorService', () => {
  let service: HttpCacheInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpCacheInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
