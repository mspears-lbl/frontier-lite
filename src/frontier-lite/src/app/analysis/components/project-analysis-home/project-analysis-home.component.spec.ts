import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAnalysisHomeComponent } from './project-analysis-home.component';

describe('ProjectAnalysisHomeComponent', () => {
  let component: ProjectAnalysisHomeComponent;
  let fixture: ComponentFixture<ProjectAnalysisHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectAnalysisHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectAnalysisHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
