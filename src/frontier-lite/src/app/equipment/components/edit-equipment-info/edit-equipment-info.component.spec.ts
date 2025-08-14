import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEquipmentInfoComponent } from './edit-equipment-info.component';

describe('EditEquipmentInfoComponent', () => {
  let component: EditEquipmentInfoComponent;
  let fixture: ComponentFixture<EditEquipmentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEquipmentInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEquipmentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
