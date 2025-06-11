import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { WellbeingTip } from '../model/WellbeingTip';
import { TipService } from '../service/wellbeing-tip.service';

@Component({
  selector: 'app-general-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './general-overview.component.html',
  styleUrl: './general-overview.component.scss'
})
export class GeneralOverviewComponent implements OnInit{
   tips: WellbeingTip[] = [];

  constructor(private tipService: TipService) {}

  ngOnInit(): void {
    this.tipService.getTips().subscribe((data) => {
      this.tips = data;
    });
  }

}
