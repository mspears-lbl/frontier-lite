import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProjectThreatComponent } from './new-project-threat.component';

describe('NewProjectThreatComponent', () => {
  let component: NewProjectThreatComponent;
  let fixture: ComponentFixture<NewProjectThreatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProjectThreatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProjectThreatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
