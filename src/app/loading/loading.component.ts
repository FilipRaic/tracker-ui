import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Subscription} from 'rxjs';
import {LoadingService} from '../service/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent implements OnInit, OnDestroy {
  loading = false;
  private subscription: Subscription | null = null;

  constructor(private readonly loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.subscription = this.loadingService.getLoading()
      .subscribe(loading => {
        this.loading = loading;
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
