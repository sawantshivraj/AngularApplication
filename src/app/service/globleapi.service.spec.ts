import { TestBed } from '@angular/core/testing';

import { GlobleapiService } from './globleapi.service';

describe('GlobleapiService', () => {
  let service: GlobleapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobleapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
