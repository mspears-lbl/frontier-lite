import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectThreatInfoComponent } from './edit-project-threat-info.component';

describe('EditProjectThreatInfoComponent', () => {
  let component: EditProjectThreatInfoComponent;
  let fixture: ComponentFixture<EditProjectThreatInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProjectThreatInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProjectThreatInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
