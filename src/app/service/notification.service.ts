import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notifications = new BehaviorSubject<Notification[]>([]);
  private counter = 0;

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  addNotification(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info'): void {
    const id = this.counter++;
    const notification: Notification = {message, type, id};

    const currentNotifications = this.notifications.getValue();
    this.notifications.next([...currentNotifications, notification]);

    setTimeout(() => {
      this.removeNotification(id);
    }, 5000);
  }

  removeNotification(id: number): void {
    const currentNotifications = this.notifications.getValue();
    this.notifications.next(currentNotifications.filter(n => n.id !== id));
  }
}
