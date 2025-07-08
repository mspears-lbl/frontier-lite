import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAnalysisProjectComponent } from './new-analysis-project.component';

describe('NewAnalysisProjectComponent', () => {
  let component: NewAnalysisProjectComponent;
  let fixture: ComponentFixture<NewAnalysisProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAnalysisProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAnalysisProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
