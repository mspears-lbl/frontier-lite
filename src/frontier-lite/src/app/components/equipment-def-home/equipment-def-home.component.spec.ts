import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentDefHomeComponent } from './equipment-def-home.component';

describe('EquipmentDefHomeComponent', () => {
  let component: EquipmentDefHomeComponent;
  let fixture: ComponentFixture<EquipmentDefHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentDefHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentDefHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
