import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrecimientoXuxemons } from './crecimiento-xuxemons';

describe('CrecimientoXuxemons', () => {
  let component: CrecimientoXuxemons;
  let fixture: ComponentFixture<CrecimientoXuxemons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrecimientoXuxemons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrecimientoXuxemons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
