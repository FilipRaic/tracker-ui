import {TestBed} from '@angular/core/testing';
import {NotificationService} from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
    service = TestBed.inject(NotificationService);

    jest.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('should return an Observable of Notification[]', (done) => {
      service.getNotifications().subscribe(notifications => {
        expect(notifications).toEqual([]);
        done();
      });
    });
  });

  describe('addNotification', () => {
    it('should add a notification with the specified message and type', (done) => {
      const message = 'Test notification';
      const type = 'success';

      service.addNotification(message, type);

      service.getNotifications().subscribe(notifications => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].message).toBe(message);
        expect(notifications[0].type).toBe(type);
        expect(notifications[0].id).toBe(0);
        done();
      });
    });

    it('should use "info" as the default type if not specified', (done) => {
      const message = 'Test notification';

      service.addNotification(message);

      service.getNotifications().subscribe(notifications => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].message).toBe(message);
        expect(notifications[0].type).toBe('info');
        done();
      });
    });

    it('should return a unique ID for each notification', (done) => {
      service.addNotification('Test 1');
      service.addNotification('Test 2');

      service.getNotifications().subscribe(notifications => {
        expect(notifications.length).toBe(2);
        expect(notifications[0].id).toBe(0);
        expect(notifications[1].id).toBe(1);
        done();
      });
    });

    it('should automatically remove the notification after 5 seconds', () => {
      jest.useFakeTimers();

      service.addNotification('Test notification');

      jest.runAllTimers();

      service.getNotifications().subscribe(notifications => {
        expect(notifications.length).toBe(0);
      });

      jest.useRealTimers();
    });
  });

  describe('removeNotification', () => {
    it('should remove a notification by ID', (done) => {
      service.addNotification('Test notification');

      service.removeNotification(0);

      service.getNotifications().subscribe(notifications => {
        expect(notifications.length).toBe(0);
        done();
      });
    });

    it('should not remove other notifications when removing by ID', (done) => {
      service.addNotification('Test 1');
      service.addNotification('Test 2');

      service.removeNotification(0);

      service.getNotifications().subscribe(notifications => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].id).toBe(1);
        done();
      });
    });

    it('should do nothing if the ID does not exist', (done) => {
      service.addNotification('Test notification');

      service.removeNotification(999);

      service.getNotifications().subscribe(notifications => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].id).toBe(0);
        done();
      });
    });
  });
});
