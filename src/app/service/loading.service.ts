import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly loadingMap = new Map<string, boolean>();

  getLoading(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  setLoading(url: string, loading: boolean): void {
    if (loading) {
      this.loadingMap.set(url, loading);
      this.loadingSubject.next(true);
    } else if (this.loadingMap.has(url)) {
      this.loadingMap.delete(url);
      this.loadingSubject.next(this.loadingMap.size !== 0);
    }
  }

  show(): void {
    this.loadingSubject.next(true);
  }
}
