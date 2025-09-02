import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectThreatViewComponent } from './project-threat-view.component';

describe('ProjectThreatViewComponent', () => {
  let component: ProjectThreatViewComponent;
  let fixture: ComponentFixture<ProjectThreatViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectThreatViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectThreatViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
