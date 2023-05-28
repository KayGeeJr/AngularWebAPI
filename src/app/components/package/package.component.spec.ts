import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PackageComponent } from './package.component';
import { PackageService } from 'src/app/package.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: PackageComponent;
  let fixture: ComponentFixture<PackageComponent>;
  let packageService: jasmine.SpyObj<PackageService>;

  beforeEach(() => {
    const packageServiceSpy = jasmine.createSpyObj('PackageService', ['fetchOutputData', 'fetchInputData']);

    TestBed.configureTestingModule({
      declarations: [ PackageComponent],
      providers: [{ provide: PackageService, useValue: packageServiceSpy }],
    });

    fixture = TestBed.createComponent(PackageComponent);
    component = fixture.componentInstance;
    packageService = TestBed.inject(PackageService) as jasmine.SpyObj<PackageService>;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should show button', () => {
    expect(fixture.nativeElement.querySelector('[data-test="button"]')).toBeTruthy();
  });

  it('should show input data', () => {
    expect(fixture.nativeElement.querySelector('[data-test="input"]')).toBeTruthy();
  });

  it('should show output data', () => {
    expect(fixture.nativeElement.querySelector('[data-test="output"]')).toBeTruthy();
  });

  it('should show output challenge information', () => {
    expect(fixture.nativeElement.querySelector('[data-test="info"]')).toBeTruthy();
  });


  it('should fetch input data from the service', () => {
    const mockInputData = `81 : (1,53.38,€45) (2,88.62,€98) (3,78.48,€3) (4,72.30,€76) (5,30.18,€9) (6,46.34,€48)
    8 : (1,15.3,€34)
    75 : (1,85.31,€29) (2,14.55,€74) (3,3.98,€16) (4,26.24,€55) (5,63.69,€52) (6,76.25,€75) (7,60.02,€74) (8,93.18,€35) (9,89.95,€78)
    56 : (1,90.72,€13) (2,33.80,€40) (3,43.15,€10) (4,37.97,€16) (5,46.81,€36) (6,48.77,€79) (7,81.80,€45) (8,19.36,€79) (9,6.76,€64)`;

    packageService.fetchInputData.and.returnValue(of(mockInputData));

    fixture.detectChanges();

    expect(packageService.fetchInputData).toHaveBeenCalled();
    expect(component.inputData).toBe(mockInputData);

    expect(fixture.nativeElement.querySelector('pre').textContent).toBe(mockInputData);
  });

  it('should fetch output data from the service', () => {
    const mockData = '4\n-\n2,7\n8,9';
    packageService.fetchOutputData.and.returnValue(of(mockData));

    component.fetchOutputData();

    expect(packageService.fetchOutputData).toHaveBeenCalled();
    expect(component.data).toBe(mockData);
  });

  it('should display input data in the template', () => {
    const mockInputData = `81 : (1,53.38,€45) (2,88.62,€98) (3,78.48,€3) (4,72.30,€76) (5,30.18,€9) (6,46.34,€48)
    8 : (1,15.3,€34)
    75 : (1,85.31,€29) (2,14.55,€74) (3,3.98,€16) (4,26.24,€55) (5,63.69,€52) (6,76.25,€75) (7,60.02,€74) (8,93.18,€35) (9,89.95,€78)
    56 : (1,90.72,€13) (2,33.80,€40) (3,43.15,€10) (4,37.97,€16) (5,46.81,€36) (6,48.77,€79) (7,81.80,€45) (8,19.36,€79) (9,6.76,€64)`;

    const packageServiceMock = TestBed.inject(PackageService) as jasmine.SpyObj<PackageService>;
    packageServiceMock.fetchInputData.and.returnValue(of(mockInputData));

    fixture.detectChanges();

    const preElement = fixture.nativeElement.querySelector('pre');
    expect(preElement.textContent).toBe(mockInputData);
  });

 // ...



});
