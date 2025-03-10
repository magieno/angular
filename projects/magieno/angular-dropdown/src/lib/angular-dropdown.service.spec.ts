import { TestBed } from '@angular/core/testing';

import { AngularDropdownService } from './angular-dropdown.service';

describe('AngularDropdownService', () => {
  let service: AngularDropdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularDropdownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
