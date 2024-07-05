import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAddComponent } from './contact-add.component';

describe('ContactAddComponent', () => {
  let component: ContactAddComponent;
  let fixture: ComponentFixture<ContactAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactAddComponent]
    });
    fixture = TestBed.createComponent(ContactAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
