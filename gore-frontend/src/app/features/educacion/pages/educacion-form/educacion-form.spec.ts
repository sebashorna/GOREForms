import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducacionForm } from './educacion-form';

describe('EducacionForm', () => {
  let component: EducacionForm;
  let fixture: ComponentFixture<EducacionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducacionForm],
    }).compileComponents();

    fixture = TestBed.createComponent(EducacionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
