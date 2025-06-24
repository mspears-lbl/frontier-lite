import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentMapComponent } from './equipment-map.component';

describe('EquipmentMapComponent', () => {
  let component: EquipmentMapComponent;
  let fixture: ComponentFixture<EquipmentMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
