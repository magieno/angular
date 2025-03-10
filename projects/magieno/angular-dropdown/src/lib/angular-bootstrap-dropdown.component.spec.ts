import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularBootstrapDropdownComponent } from './angular-bootstrap-dropdown.component';

describe('AngularDropdownComponent', () => {
  let component: AngularBootstrapDropdownComponent;
  let fixture: ComponentFixture<AngularBootstrapDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularBootstrapDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngularBootstrapDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
