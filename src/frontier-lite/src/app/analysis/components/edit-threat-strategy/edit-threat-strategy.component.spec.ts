import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditThreatStrategyComponent } from './edit-threat-strategy.component';

describe('EditThreatStrategyComponent', () => {
  let component: EditThreatStrategyComponent;
  let fixture: ComponentFixture<EditThreatStrategyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditThreatStrategyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditThreatStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
