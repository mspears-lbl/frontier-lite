import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentDefMapComponent } from './equipment-def-map.component';

describe('EquipmentDefMapComponent', () => {
  let component: EquipmentDefMapComponent;
  let fixture: ComponentFixture<EquipmentDefMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentDefMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentDefMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
