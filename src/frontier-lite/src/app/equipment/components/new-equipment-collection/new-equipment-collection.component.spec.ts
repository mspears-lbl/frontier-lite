import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEquipmentCollectionComponent } from './new-equipment-collection.component';

describe('NewEquipmentCollectionComponent', () => {
  let component: NewEquipmentCollectionComponent;
  let fixture: ComponentFixture<NewEquipmentCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEquipmentCollectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEquipmentCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
