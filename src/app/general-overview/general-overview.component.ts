import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { WellbeingTip } from '../model/WellbeingTip';
import { TipService } from '../service/wellbeing-tip.service';
import { Achievement } from '../model/Achievement';
import { AchievementService } from '../service/achievement.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-general-overview',
  standalone: true,
  imports: [CommonModule, RouterModule,TranslatePipe],
  templateUrl: './general-overview.component.html',
  styleUrl: './general-overview.component.scss'
})
export class GeneralOverviewComponent implements OnInit{
   tips: WellbeingTip[] = [];
   mentalIssues: String[] = [];
   achievements: Achievement[] = [];

  constructor(private tipService: TipService, private achievementService: AchievementService) {}

  ngOnInit(): void {
    this.tipService.getTips().subscribe((data) => {
      this.tips = data;
      this.getMentalIssues();
    });
    
     this.achievementService.getAchievements().subscribe({
      next: (data) => (this.achievements = data),
      error: (err) => console.error('Failed to load achievements', err),
    });
  }
  getMentalIssues(): void {
  this.mentalIssues = []; 
  this.tips.forEach(tip => {
    if (tip.category === 'MENTAL' && tip.score > 2) {
      this.mentalIssues.push('Stress');
    } else if (tip.category === 'EMOTIONAL' && tip.score > 2) {
      this.mentalIssues.push('Depression');
    } else if (tip.category === 'PHYSICAL' && tip.score > 2) {
      this.mentalIssues.push('Lifestyle imbalance');
    } else if (tip.category === 'SOCIAL' && tip.score > 2) {
      this.mentalIssues.push('Social anxiety');
    }
  });
}

}
