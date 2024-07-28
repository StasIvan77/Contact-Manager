import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContactService } from '../shared/contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Subject, merge, fromEvent } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contact-add',
  templateUrl: './contact-add.component.html',
  styleUrls: ['./contact-add.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule
  ]
})
export class ContactAddComponent implements OnInit, OnDestroy {
  contactForm!: FormGroup;
  private destroy$ = new Subject<void>();

  errorMessages: { [key: string]: string } = {};
  isEditMode: boolean = false;
  contactId?: string | null;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.contactForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.contactId = params.get('id');
      if (this.contactId) {
        this.isEditMode = true;
        this.populateForm(this.contactId);
      }
    });

    this.subscribeToFormChanges();
    this.addBlurAndInputEventListeners();
  }

  subscribeToFormChanges(): void {
    const controls = this.contactForm.controls;
    const controlObservables = [];

    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        const control = controls[controlName];
        controlObservables.push(
          merge(
            control.statusChanges,
            control.valueChanges
          )
        );
      }
    }

    merge(...controlObservables)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateErrorMessages());
  }

  addBlurAndInputEventListeners(): void {
    const controls = ['firstName', 'lastName', 'email', 'phoneNumber', 'birthDate', 'address'];

    controls.forEach(controlName => {
      const input = document.querySelector(`input[formControlName="${controlName}"]`);
      const textarea = document.querySelector(`textarea[formControlName="${controlName}"]`);
      const select = document.querySelector(`select[formControlName="${controlName}"]`);

      if (input) {
        fromEvent(input, 'blur')
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => this.updateErrorMessages());
        fromEvent(input, 'input')
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => this.updateErrorMessages());
      }
      
      if (textarea) {
        fromEvent(textarea, 'blur')
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => this.updateErrorMessages());
        fromEvent(textarea, 'input')
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => this.updateErrorMessages());
      }

      if (select) {
        fromEvent(select, 'blur')
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => this.updateErrorMessages());
        fromEvent(select, 'change')
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => this.updateErrorMessages());
      }
    });
  }

  updateErrorMessages(): void {
    const controls = ['firstName', 'lastName', 'email', 'phoneNumber', 'birthDate', 'address'];
    const errorMessages: { [key: string]: string } = {};

    controls.forEach(controlName => {
      const control = this.contactForm.get(controlName);
      if (control && control.invalid && (control.dirty || control.touched)) {
        if (control.hasError('required')) {
          errorMessages[controlName] = `${this.getLabel(controlName)} is required`;
        } else if (control.hasError('email')) {
          errorMessages[controlName] = 'Not a valid email';
        } else if (control.hasError('pattern') && controlName === 'phoneNumber') {
          errorMessages[controlName] = 'Phone number must be 10 digits';
        } else if (control.hasError('minlength') && control.errors) {
          errorMessages[controlName] = `Minimum length is ${control.errors['minlength'].requiredLength}`;
        } else if (control.hasError('maxlength') && control.errors) {
          errorMessages[controlName] = `Maximum length is ${control.errors['maxlength'].requiredLength}`;
        } else {
          errorMessages[controlName] = ''; // Clear message if no errors
        }
      } else {
        errorMessages[controlName] = ''; // Clear message if no errors
      }
    });

    this.errorMessages = errorMessages;
  }

  getLabel(controlName: string): string {
    switch (controlName) {
      case 'firstName':
        return 'First Name';
      case 'lastName':
        return 'Last Name';
      case 'email':
        return 'Email';
      case 'phoneNumber':
        return 'Phone Number';
      case 'birthDate':
        return 'Birth Date';
      case 'address':
        return 'Address';
      default:
        return '';
    }
  }

  populateForm(contactId: string): void {
    const contact = this.contactService.getContactById(contactId);
    if (contact) {
      this.contactForm.setValue({
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phoneNumber: contact.phoneNumber,
        email: contact.email,
        birthDate: contact.birthDate,
        address: contact.address
      });
    }
  }

  saveContact(): void {
    if (this.contactForm.valid) {
      const formData = this.contactForm.getRawValue();
      if (this.isEditMode && this.contactId) {
        this.contactService.updateContact({ ...formData, id: this.contactId });
      } else {
        this.contactService.addContact(formData);
      }
      this.router.navigate(['/contacts']);
    } else {
      this.updateErrorMessages();
    }
  }

  cancel(): void {
    this.router.navigate(['/contacts']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
