import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LoadingComponent } from './loading.component';
import { LoadingService } from '../service/loading.service';
import { BehaviorSubject } from 'rxjs';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    loadingSubject = new BehaviorSubject<boolean>(false);
    mockLoadingService = jasmine.createSpyObj('LoadingService', ['getLoading']);
    mockLoadingService.getLoading.and.returnValue(loadingSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [LoadingComponent],
      providers: [
        { provide: LoadingService, useValue: mockLoadingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to loading state on init', () => {
    expect(mockLoadingService.getLoading).toHaveBeenCalled();
  });

  it('should not display loading overlay when loading is false', () => {
    loadingSubject.next(false);
    fixture.detectChanges();

    const loadingOverlay = fixture.debugElement.query(By.css('[data-testid="loading-overlay"]'));
    expect(loadingOverlay).toBeNull();
  });

  it('should display loading overlay when loading is true', () => {
    loadingSubject.next(true);
    fixture.detectChanges();

    const loadingOverlay = fixture.debugElement.query(By.css('[data-testid="loading-overlay"]'));
    expect(loadingOverlay).not.toBeNull();

    const loadingSpinner = fixture.debugElement.query(By.css('[data-testid="loading-spinner"]'));
    expect(loadingSpinner).not.toBeNull();
  });

  it('should update loading state when service emits new value', () => {
    expect(component.loading).toBe(false);

    loadingSubject.next(true);
    fixture.detectChanges();
    expect(component.loading).toBe(true);

    loadingSubject.next(false);
    fixture.detectChanges();
    expect(component.loading).toBe(false);
  });

  it('should unsubscribe from loading state on destroy', () => {
    const unsubscribeSpy = jest.spyOn(component['subscription'] as any, 'unsubscribe');

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
