import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Excursions } from './excursions';

describe('Excursions', () => {
  let component: Excursions;
  let fixture: ComponentFixture<Excursions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Excursions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Excursions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
