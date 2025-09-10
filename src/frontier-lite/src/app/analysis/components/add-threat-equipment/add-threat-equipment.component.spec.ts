import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddThreatEquipmentComponent } from './add-threat-equipment.component';

describe('AddThreatEquipmentComponent', () => {
  let component: AddThreatEquipmentComponent;
  let fixture: ComponentFixture<AddThreatEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddThreatEquipmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddThreatEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
