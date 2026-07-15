import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaludForm } from './salud-form';

describe('SaludForm', () => {
  let component: SaludForm;
  let fixture: ComponentFixture<SaludForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaludForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SaludForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
