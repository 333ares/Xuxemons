import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbabilidadInfeccion } from './probabilidad-infeccion';

describe('ProbabilidadInfeccion', () => {
  let component: ProbabilidadInfeccion;
  let fixture: ComponentFixture<ProbabilidadInfeccion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProbabilidadInfeccion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProbabilidadInfeccion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
