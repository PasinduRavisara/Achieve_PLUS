import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressAnalysis } from './progress-analysis';

describe('ProgressAnalysis', () => {
  let component: ProgressAnalysis;
  let fixture: ComponentFixture<ProgressAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressAnalysis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
