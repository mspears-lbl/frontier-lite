import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEquipmentStrategyComponent } from './add-equipment-strategy.component';

describe('AddEquipmentStrategyComponent', () => {
  let component: AddEquipmentStrategyComponent;
  let fixture: ComponentFixture<AddEquipmentStrategyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEquipmentStrategyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEquipmentStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
