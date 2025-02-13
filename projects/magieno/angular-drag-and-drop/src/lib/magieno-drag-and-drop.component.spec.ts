import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagienoDragAndDropComponent } from './magieno-drag-and-drop.component';

describe('AngularDragAndDropComponent', () => {
  let component: MagienoDragAndDropComponent;
  let fixture: ComponentFixture<MagienoDragAndDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MagienoDragAndDropComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MagienoDragAndDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
