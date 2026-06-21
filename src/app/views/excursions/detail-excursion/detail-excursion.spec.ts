import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailExcursion } from './detail-excursion';

describe('DetailExcursion', () => {
  let component: DetailExcursion;
  let fixture: ComponentFixture<DetailExcursion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailExcursion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailExcursion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
