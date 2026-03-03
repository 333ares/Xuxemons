import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Batalla } from './batalla';

describe('Batalla', () => {
  let component: Batalla;
  let fixture: ComponentFixture<Batalla>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Batalla]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Batalla);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
