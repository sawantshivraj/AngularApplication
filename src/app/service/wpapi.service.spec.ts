import { TestBed } from '@angular/core/testing';

import { WpapiService } from './wpapi.service';

describe('WpapiService', () => {
  let service: WpapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WpapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
