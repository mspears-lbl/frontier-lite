import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEquipmentMapComponent } from './create-equipment-map.component';

describe('CreateEquipmentMapComponent', () => {
  let component: CreateEquipmentMapComponent;
  let fixture: ComponentFixture<CreateEquipmentMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEquipmentMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEquipmentMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
