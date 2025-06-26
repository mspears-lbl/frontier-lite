import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisHomeComponent } from './analysis-home.component';

describe('AnalysisHomeComponent', () => {
  let component: AnalysisHomeComponent;
  let fixture: ComponentFixture<AnalysisHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
