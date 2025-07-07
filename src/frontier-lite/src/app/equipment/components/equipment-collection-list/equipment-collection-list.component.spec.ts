import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentCollectionListComponent } from './equipment-collection-list.component';

describe('EquipmentCollectionListComponent', () => {
  let component: EquipmentCollectionListComponent;
  let fixture: ComponentFixture<EquipmentCollectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentCollectionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentCollectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
