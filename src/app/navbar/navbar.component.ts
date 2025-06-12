import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {AuthService} from '../service/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  currentLang = 'en';
  languages = [
    'en',
    'hr',
    'de'
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly translate: TranslateService,
  ) {
    let savedLang = localStorage.getItem('language');
    if (savedLang == null) {
      const browserLang = translate.getBrowserLang();
      savedLang = browserLang && ['en', 'hr', 'de'].includes(browserLang) ? browserLang : 'en';
    }
    this.switchLanguage(savedLang);
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
    localStorage.setItem('language', lang);
  }

  logout() {
    this.authService.logout();
  }
}
