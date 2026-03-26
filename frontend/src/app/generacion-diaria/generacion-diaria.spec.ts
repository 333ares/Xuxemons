import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneracionDiaria } from './generacion-diaria';

describe('GeneracionDiaria', () => {
  let component: GeneracionDiaria;
  let fixture: ComponentFixture<GeneracionDiaria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneracionDiaria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneracionDiaria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
