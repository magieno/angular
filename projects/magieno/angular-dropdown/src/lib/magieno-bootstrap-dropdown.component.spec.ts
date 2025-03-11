import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagienoBootstrapDropdownComponent } from './magieno-bootstrap-dropdown.component';

describe('AngularDropdownComponent', () => {
  let component: MagienoBootstrapDropdownComponent;
  let fixture: ComponentFixture<MagienoBootstrapDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MagienoBootstrapDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MagienoBootstrapDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
