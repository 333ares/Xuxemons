import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarXuxemon } from './agregar-xuxemon';

describe('AgregarXuxemon', () => {
  let component: AgregarXuxemon;
  let fixture: ComponentFixture<AgregarXuxemon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarXuxemon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarXuxemon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
