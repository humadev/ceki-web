import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashOverviewComponent } from './trash-overview.component';

describe('TrashOverviewComponent', () => {
  let component: TrashOverviewComponent;
  let fixture: ComponentFixture<TrashOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrashOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrashOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
