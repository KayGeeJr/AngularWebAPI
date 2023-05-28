import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PackageService } from './package.service';

describe('PackageService', () => {
  let service: PackageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PackageService]
    });
    service = TestBed.inject(PackageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch input data from the API', () => {
    const mockInputData = `81 : (1,53.38,€45) (2,88.62,€98) (3,78.48,€3) (4,72.30,€76) (5,30.18,€9) (6,46.34,€48),
      8 : (1,15.3,€34),
      75 : (1,85.31,€29) (2,14.55,€74) (3,3.98,€16) (4,26.24,€55) (5,63.69,€52) (6,76.25,€75) (7,60.02,€74) (8,93.18,€35) (9,89.95,€78),
      56 : (1,90.72,€13) (2,33.80,€40) (3,43.15,€10) (4,37.97,€16) (5,46.81,€36) (6,48.77,€79) (7,81.80,€45) (8,19.36,€79) (9,6.76,€64)`;

    service.fetchInputData().subscribe(data => {
      expect(data).toEqual(mockInputData);
    });

    const req = httpMock.expectOne('https://localhost:7074/Packer/inputData');
    expect(req.request.method).toBe('GET');
    req.flush(mockInputData);
  });

  it('should handle API errors when fetching input data', () => {
    const errorMessage = 'An error occurred while fetching the input data.';
    const errorResponse = { status: 500, statusText: 'Internal Server Error' };

    service.fetchInputData().subscribe(
      () => fail('The request should have failed with an error.'),
      (error: string) => {
        expect(error).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne('https://localhost:7074/Packer/inputData');
    expect(req.request.method).toBe('GET');
    req.flush({}, errorResponse);
  });

  it('should fetch output data from the API', () => {
    const mockOutputData = '4\n-\n2,7\n8,9';

    service.fetchOutputData().subscribe(data => {
      expect(data).toEqual(mockOutputData);
    });

    const req = httpMock.expectOne('https://localhost:7074/Packer');
    expect(req.request.method).toBe('GET');
    req.flush(mockOutputData);
  });

  it('should handle API errors when fetching output data', () => {
    const errorMessage = 'An error occurred while fetching the output data.';
    const errorResponse = { status: 500, statusText: 'Internal Server Error' };

    service.fetchOutputData().subscribe(
      () => fail('The request should have failed with an error.'),
      (error: string) => {
        expect(error).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne('https://localhost:7074/Packer');
    expect(req.request.method).toBe('GET');
    req.flush({}, errorResponse);
  });
});
