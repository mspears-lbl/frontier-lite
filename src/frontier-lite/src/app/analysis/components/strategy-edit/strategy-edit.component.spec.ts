import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyEditComponent } from './strategy-edit.component';

describe('StrategyEditComponent', () => {
  let component: StrategyEditComponent;
  let fixture: ComponentFixture<StrategyEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategyEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrategyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
