import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayRoomComponent } from './play-room.component';

describe('PlayRoomComponent', () => {
  let component: PlayRoomComponent;
  let fixture: ComponentFixture<PlayRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
