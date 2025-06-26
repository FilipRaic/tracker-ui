import {ComponentFixture, TestBed} from '@angular/core/testing';
import {GeneralOverviewComponent} from './general-overview.component';
import {instance, mock, when} from 'ts-mockito';
import {TipService} from '../service/wellbeing-tip.service';
import {AchievementService} from '../service/achievement.service';
import {TranslateTestingModule} from 'ngx-translate-testing';
import {of} from 'rxjs';
import {WellbeingTip} from '../model/WellbeingTip';
import {Achievement} from '../model/Achievement';

describe('GeneralOverviewComponent', () => {
  let component: GeneralOverviewComponent;
  let fixture: ComponentFixture<GeneralOverviewComponent>;
  let tipServiceMock: TipService = mock(TipService);
  let achievementServiceMock: AchievementService = mock(AchievementService);

  const mockTips: WellbeingTip[] = [
    {tipText: 'Tip 1', category: 'MENTAL', score: 3},
    {tipText: 'Tip 2', category: 'EMOTIONAL', score: 1},
    {tipText: 'Tip 3', category: 'PHYSICAL', score: 4},
    {tipText: 'Tip 4', category: 'SOCIAL', score: 2}
  ];

  const mockAchievements: Achievement[] = [
    {name: 'First Step', title: 'Beginner', description: 'Complete first task', emoji: '🏆'},
    {name: 'Progress', title: 'Intermediate', description: 'Complete 5 tasks', emoji: '⭐'}
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GeneralOverviewComponent,
        TranslateTestingModule.withTranslations({en: require('../../../src/assets/i18n/en.json')})
      ],
      providers: [
        {provide: TipService, useValue: instance(tipServiceMock)},
        {provide: AchievementService, useValue: instance(achievementServiceMock)}
      ]
    }).compileComponents();

    when(tipServiceMock.getTips()).thenReturn(of(mockTips));
    when(tipServiceMock.getStreak()).thenReturn(of(5));
    when(achievementServiceMock.getAchievements()).thenReturn(of(mockAchievements));

    fixture = TestBed.createComponent(GeneralOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tips from TipService', () => {
    expect(component.tips).toEqual(mockTips);
  });

  it('should initialize streak from TipService', () => {
    expect(component.streak).toBe(5);
  });

  it('should initialize achievements from AchievementService', () => {
    expect(component.achievements).toEqual(mockAchievements);
  });

  it('should call getMentalIssues after receiving tips', () => {
    const spy = jest.spyOn(component, 'getMentalIssues');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  describe('getMentalIssues', () => {
    it('should populate mentalIssues with Stress for MENTAL tips with score > 2', () => {
      component.tips = [{tipText: 'Tip 1', category: 'MENTAL', score: 3}];
      component.getMentalIssues();
      expect(component.mentalIssues).toContain('Stress');
    });

    it('should populate mentalIssues with Depression for EMOTIONAL tips with score > 2', () => {
      component.tips = [{tipText: 'Tip 2', category: 'EMOTIONAL', score: 3}];
      component.getMentalIssues();
      expect(component.mentalIssues).toContain('Depression');
    });

    it('should populate mentalIssues with Lifestyle imbalance for PHYSICAL tips with score > 2', () => {
      component.tips = [{tipText: 'Tip 3', category: 'PHYSICAL', score: 3}];
      component.getMentalIssues();
      expect(component.mentalIssues).toContain('Lifestyle imbalance');
    });

    it('should populate mentalIssues with Social anxiety for SOCIAL tips with score > 2', () => {
      component.tips = [{tipText: 'Tip 4', category: 'SOCIAL', score: 3}];
      component.getMentalIssues();
      expect(component.mentalIssues).toContain('Social anxiety');
    });

    it('should not add issues for tips with score <= 2', () => {
      component.tips = [{tipText: 'Tip 5', category: 'MENTAL', score: 2}];
      component.getMentalIssues();
      expect(component.mentalIssues).toEqual([]);
    });

    it('should handle multiple qualifying tips', () => {
      component.tips = [
        {tipText: 'Tip 1', category: 'MENTAL', score: 3},
        {tipText: 'Tip 2', category: 'PHYSICAL', score: 4}
      ];
      component.getMentalIssues();
      expect(component.mentalIssues).toEqual(['Stress', 'Lifestyle imbalance']);
    });
  });

  it('should render tips in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tipElements = compiled.querySelectorAll('.tips ol li');
    expect(tipElements.length).toBe(mockTips.length);
    expect(tipElements[0].textContent).toContain(mockTips[0].tipText);
  });

  it('should render achievements in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const achievementElements = compiled.querySelectorAll('.achievements .achievement');
    expect(achievementElements.length).toBe(mockAchievements.length);
    expect(achievementElements[0].querySelector('h2')?.textContent).toContain(mockAchievements[0].name);
  });

  it('should render streak in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const streakElement = compiled.querySelector('.streak-count');
    expect(streakElement?.textContent).toContain('5');
  });
});
