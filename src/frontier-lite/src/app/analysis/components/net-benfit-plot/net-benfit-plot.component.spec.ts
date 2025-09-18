import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetBenfitPlotComponent } from './net-benfit-plot.component';

describe('NetBenfitPlotComponent', () => {
  let component: NetBenfitPlotComponent;
  let fixture: ComponentFixture<NetBenfitPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetBenfitPlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetBenfitPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
