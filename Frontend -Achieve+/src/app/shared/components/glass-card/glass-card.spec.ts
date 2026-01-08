import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlassCard } from './glass-card';

describe('GlassCard', () => {
  let component: GlassCard;
  let fixture: ComponentFixture<GlassCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlassCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlassCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
