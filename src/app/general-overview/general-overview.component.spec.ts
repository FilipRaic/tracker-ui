import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralOverviewComponent } from './general-overview.component';
import {instance, mock, when} from 'ts-mockito';
import {TipService} from '../service/wellbeing-tip.service';
import {AchievementService} from '../service/achievement.service';
import {TranslateTestingModule} from 'ngx-translate-testing';
import {of} from 'rxjs';

describe('GeneralOverviewComponent', () => {
  let component: GeneralOverviewComponent;
  let fixture: ComponentFixture<GeneralOverviewComponent>;
  let tipServiceMock: TipService = mock(TipService);
  let achievementServiceMock: AchievementService = mock(AchievementService);

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [GeneralOverviewComponent,
        TranslateTestingModule.withTranslations({ en: require('../../../src/assets/i18n/en.json')})],
      providers: [
        {provide: TipService, useValue: instance(tipServiceMock)},
        {provide: AchievementService, useValue: instance(achievementServiceMock)}
      ]
    })
    .compileComponents();
    when(tipServiceMock.getTips()).thenReturn(of([]))
    when(achievementServiceMock.getAchievements()).thenReturn(of([]))

    fixture = TestBed.createComponent(GeneralOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
