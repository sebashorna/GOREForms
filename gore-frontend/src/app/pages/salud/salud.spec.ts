import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Salud } from './salud';

describe('Salud', () => {
  let component: Salud;
  let fixture: ComponentFixture<Salud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Salud],
    }).compileComponents();

    fixture = TestBed.createComponent(Salud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
