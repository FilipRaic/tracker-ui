import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {WellbeingTip} from '../model/WellbeingTip';
import {TipService} from '../service/wellbeing-tip.service';
import {Achievement} from '../model/Achievement';
import {AchievementService} from '../service/achievement.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-general-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './general-overview.component.html',
  styleUrl: './general-overview.component.scss'
})
export class GeneralOverviewComponent implements OnInit {
  tips: WellbeingTip[] = [];
  mentalIssues: string[] = [];
  achievements: Achievement[] = [];
  streak: Number = 0;

  constructor(private tipService: TipService, private achievementService: AchievementService, private translateService: TranslateService ) {}

  ngOnInit(): void {
    this.tipService.getTips().subscribe((data) => {
      this.tips = data;
      this.getMentalIssues();
    });

    this.tipService.getStreak().subscribe((data) => {
      this.streak = data;
    });
    this.achievementService.getAchievements().subscribe({
      next: (data) => (this.achievements = data),
      error: (err) => console.error('Failed to load achievements', err),
    });
  }

  getMentalIssues(): string[] {
  this.mentalIssues = []; 
  const lang = this.translateService.currentLang;
    this.tips.forEach(tip => {
    if (tip.category === 'MENTAL' && tip.score > 2) {
      this.mentalIssues.push(
        lang === 'hr' ? 'Stres' :
        lang === 'de' ? 'Stress' :
        'Stress'
      );
    } 
    else if (tip.category === 'MENTAL' && tip.score < 3) {
      this.mentalIssues.push(
        lang === 'hr' ? 'Smirenost' :
        lang === 'de' ? 'Ruhe' :
        'Calm'
      );
    }
    else if (tip.category === 'EMOTIONAL' && tip.score > 2) {
      this.mentalIssues.push(
        lang === 'hr' ? 'Depresija' :
        lang === 'de' ? 'Depression' :
        'Depression'
      );
    } 
    else if (tip.category === 'EMOTIONAL' && tip.score < 3) {
      this.mentalIssues.push(
        lang === 'hr' ? 'Veselost' :
        lang === 'de' ? 'Fröhlichkeit' :
        'Cheerful'
      );
    }
    else if (tip.category === 'PHYSICAL' && tip.score > 2) {
      this.mentalIssues.push(
        lang === 'hr' ? 'Neuravnotežen stil života' :
        lang === 'de' ? 'Unausgewogener Lebensstil' :
        'Lifestyle imbalance'
      );
    } 
    else if (tip.category === 'PHYSICAL' && tip.score < 3) {
      this.mentalIssues.push(
        lang === 'hr' ? 'Ravnoteža' :
        lang === 'de' ? 'Gleichgewicht' :
        'Equilibrium'
      );
    } 
    else if (tip.category === 'SOCIAL' && tip.score > 2) {
      this.mentalIssues.push(
        lang === 'hr' ? 'Socijalna anksioznost' :
        lang === 'de' ? 'Soziale Angst' :
        'Social anxiety'
      );
    } 
    else if (tip.category === 'SOCIAL' && tip.score < 3) {
      this.mentalIssues.push(
        lang === 'hr' ? 'Socijalno samopouzdanje' :
        lang === 'de' ? 'Soziales Selbstvertrauen' :
        'Social confidence'
      );
    }
  });
  return this.mentalIssues;
}
getTipText(tip: WellbeingTip): string {
    const lang = this.translateService.currentLang;
    switch (lang) {
      case 'hr': return tip.tipTextHr;
      case 'de': return tip.tipTextDe;
      default: return tip.tipTextEn;
    }

}
}
