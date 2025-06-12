import { TestBed } from '@angular/core/testing';

import { TipService } from './wellbeing-tip.service';

describe('WellbeingTipService', () => {
  let service: TipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
