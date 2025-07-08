import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSummaryHomeComponent } from './project-summary-home.component';

describe('ProjectSummaryHomeComponent', () => {
  let component: ProjectSummaryHomeComponent;
  let fixture: ComponentFixture<ProjectSummaryHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSummaryHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectSummaryHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
