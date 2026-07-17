import { TestBed } from '@angular/core/testing';

import { Salud } from './salud';

describe('Salud', () => {
  let service: Salud;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Salud);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
