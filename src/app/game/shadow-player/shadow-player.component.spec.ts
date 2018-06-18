import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShadowPlayerComponent } from './shadow-player.component';

describe('ShadowPlayerComponent', () => {
  let component: ShadowPlayerComponent;
  let fixture: ComponentFixture<ShadowPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShadowPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShadowPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
