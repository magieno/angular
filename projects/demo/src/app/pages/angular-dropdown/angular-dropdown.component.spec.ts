import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularDropdownComponent } from './angular-dropdown.component';

describe('AngularDropdownComponent', () => {
  let component: AngularDropdownComponent;
  let fixture: ComponentFixture<AngularDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngularDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
