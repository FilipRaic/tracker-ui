import { TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterOutlet],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'tracker-ui' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('tracker-ui');
  });

  it('should render title in h1', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const h1 = compiled.querySelector('h1');
    expect(h1?.textContent).toContain('Hello, tracker-ui');
  });

  it('should render Angular logo SVG', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const logo = compiled.querySelector('.angular-logo');
    expect(logo).toBeTruthy();
    expect(logo?.tagName.toLowerCase()).toBe('svg');
  });

  it('should render congratulatory message', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const p = compiled.querySelector('.left-side p');
    expect(p?.textContent).toContain('Congratulations! Your app is running. 🎉');
  });

  it('should render divider', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const divider = compiled.querySelector('.divider');
    expect(divider).toBeTruthy();
    expect(divider?.getAttribute('role')).toBe('separator');
    expect(divider?.getAttribute('aria-label')).toBe('Divider');
  });

  it('should render 5 pill links with correct titles and hrefs', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const pills = compiled.querySelectorAll('.pill');
    const expectedLinks = [
      { title: 'Explore the Docs', href: 'https://angular.dev' },
      { title: 'Learn with Tutorials', href: 'https://angular.dev/tutorials' },
      { title: 'CLI Docs', href: 'https://angular.dev/tools/cli' },
      { title: 'Angular Language Service', href: 'https://angular.dev/tools/language-service' },
      { title: 'Angular DevTools', href: 'https://angular.dev/tools/devtools' },
    ];

    expect(pills.length).toBe(5);
    pills.forEach((pill, index) => {
      const span = pill.querySelector('span');
      const svg = pill.querySelector('svg');
      expect(span?.textContent).toBe(expectedLinks[index].title);
      expect(pill.getAttribute('href')).toBe(expectedLinks[index].href);
      expect(pill.getAttribute('target')).toBe('_blank');
      expect(pill.getAttribute('rel')).toBe('noopener');
      expect(svg).toBeTruthy();
    });
  });

  it('should render 3 social links with correct hrefs and aria-labels', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const socialLinks = compiled.querySelectorAll('.social-links a');
    const expectedSocialLinks = [
      { href: 'https://github.com/angular/angular', ariaLabel: 'Github' },
      { href: 'https://twitter.com/angular', ariaLabel: 'Twitter' },
      { href: 'https://www.youtube.com/channel/UCbn1OgGei-DV7aSRo_HaAiw', ariaLabel: 'Youtube' },
    ];

    expect(socialLinks.length).toBe(3);
    socialLinks.forEach((link, index) => {
      expect(link.getAttribute('href')).toBe(expectedSocialLinks[index].href);
      expect(link.getAttribute('aria-label')).toBe(expectedSocialLinks[index].ariaLabel);
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener');
      expect(link.querySelector('svg')).toBeTruthy();
    });
  });

  it('should render router-outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutlet).toBeTruthy();
  });
});
