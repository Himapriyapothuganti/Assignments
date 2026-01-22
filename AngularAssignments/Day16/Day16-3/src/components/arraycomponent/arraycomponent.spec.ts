import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Arraycomponent } from './arraycomponent';

describe('Arraycomponent', () => {
  let component: Arraycomponent;
  let fixture: ComponentFixture<Arraycomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Arraycomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Arraycomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
