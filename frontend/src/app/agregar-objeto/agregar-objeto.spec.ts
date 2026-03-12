import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarObjeto } from './agregar-objeto';

describe('AgregarObjeto', () => {
  let component: AgregarObjeto;
  let fixture: ComponentFixture<AgregarObjeto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarObjeto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarObjeto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
