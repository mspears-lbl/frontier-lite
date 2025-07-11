import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentHomeComponent } from './equipment-home.component';

describe('EquipmentHomeComponent', () => {
  let component: EquipmentHomeComponent;
  let fixture: ComponentFixture<EquipmentHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
