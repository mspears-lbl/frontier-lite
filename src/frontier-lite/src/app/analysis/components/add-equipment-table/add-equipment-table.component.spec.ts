import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEquipmentTableComponent } from './add-equipment-table.component';

describe('AddEquipmentTableComponent', () => {
  let component: AddEquipmentTableComponent;
  let fixture: ComponentFixture<AddEquipmentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEquipmentTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEquipmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
