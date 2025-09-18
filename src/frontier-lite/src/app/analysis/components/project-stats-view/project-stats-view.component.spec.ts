import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStatsViewComponent } from './project-stats-view.component';

describe('ProjectStatsViewComponent', () => {
  let component: ProjectStatsViewComponent;
  let fixture: ComponentFixture<ProjectStatsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectStatsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectStatsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
