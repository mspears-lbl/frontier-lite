import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddThreatStrategyComponent } from './add-threat-strategy.component';

describe('AddThreatStrategyComponent', () => {
  let component: AddThreatStrategyComponent;
  let fixture: ComponentFixture<AddThreatStrategyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddThreatStrategyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddThreatStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
