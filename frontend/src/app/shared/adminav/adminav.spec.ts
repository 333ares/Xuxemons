import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminav } from './adminav';

describe('Adminav', () => {
  let component: Adminav;
  let fixture: ComponentFixture<Adminav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adminav]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adminav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
