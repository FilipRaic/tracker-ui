import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NotificationComponent} from './notification.component';
import {Notification, NotificationService} from '../service/notification.service';
import {BehaviorSubject} from 'rxjs';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let notificationsSubject: BehaviorSubject<Notification[]>;

  beforeEach(async () => {
    notificationsSubject = new BehaviorSubject<Notification[]>([]);
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['getNotifications', 'removeNotification']);
    mockNotificationService.getNotifications.and.returnValue(notificationsSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [NotificationComponent],
      providers: [
        {provide: NotificationService, useValue: mockNotificationService}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should subscribe to notifications on init', () => {
    expect(mockNotificationService.getNotifications).toHaveBeenCalled();
  });

  it('should display notifications', () => {
    const testNotifications: Notification[] = [
      {id: 1, message: 'Test message 1', type: 'info'},
      {id: 2, message: 'Test message 2', type: 'success'}
    ];

    notificationsSubject.next(testNotifications);
    fixture.detectChanges();

    const toastElements = fixture.debugElement.queryAll(By.css('[data-testid="notification-toast"]'));
    expect(toastElements.length).toBe(2);

    const messageElements = fixture.debugElement.queryAll(By.css('[data-testid="notification-message"]'));
    expect(messageElements[0].nativeElement.textContent).toContain('Test message 1');
    expect(messageElements[1].nativeElement.textContent).toContain('Test message 2');
  });

  it('should apply the correct CSS class based on notification type', () => {
    const testNotifications: Notification[] = [
      {id: 1, message: 'Info notification', type: 'info'},
      {id: 2, message: 'Success notification', type: 'success'},
      {id: 3, message: 'Error notification', type: 'error'},
      {id: 4, message: 'Warning notification', type: 'warning'}
    ];

    notificationsSubject.next(testNotifications);
    fixture.detectChanges();

    const toastElements = fixture.debugElement.queryAll(By.css('[data-testid="notification-toast"]'));
    expect(toastElements[0].nativeElement.classList).toContain('toast-info');
    expect(toastElements[1].nativeElement.classList).toContain('toast-success');
    expect(toastElements[2].nativeElement.classList).toContain('toast-error');
    expect(toastElements[3].nativeElement.classList).toContain('toast-warning');
  });

  it('should call removeNotification when close button is clicked', () => {
    const testNotifications: Notification[] = [
      {id: 1, message: 'Test message', type: 'info'}
    ];
    notificationsSubject.next(testNotifications);
    fixture.detectChanges();

    const closeButton = fixture.debugElement.query(By.css('[data-testid="notification-close"]'));
    closeButton.nativeElement.click();

    expect(mockNotificationService.removeNotification).toHaveBeenCalledWith(1);
  });

  it('should not display any notifications when there are none', () => {
    notificationsSubject.next([]);
    fixture.detectChanges();

    const toastElements = fixture.debugElement.queryAll(By.css('[data-testid="notification-toast"]'));
    expect(toastElements.length).toBe(0);
  });

  it('should unsubscribe from notifications on destroy', () => {
    const unsubscribeSpy = jest.spyOn(component['subscription'] as any, 'unsubscribe');

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
