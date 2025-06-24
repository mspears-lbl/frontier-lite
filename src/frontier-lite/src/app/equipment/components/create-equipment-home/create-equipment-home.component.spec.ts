import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEquipmentHomeComponent } from './create-equipment-home.component';

describe('CreateEquipmentHomeComponent', () => {
  let component: CreateEquipmentHomeComponent;
  let fixture: ComponentFixture<CreateEquipmentHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEquipmentHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEquipmentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
