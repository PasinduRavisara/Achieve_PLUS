import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Progress } from './progress';

describe('Progress', () => {
  let component: Progress;
  let fixture: ComponentFixture<Progress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Progress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Progress);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
