import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Usercomp } from './usercomp';

describe('Usercomp', () => {
  let component: Usercomp;
  let fixture: ComponentFixture<Usercomp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Usercomp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Usercomp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
