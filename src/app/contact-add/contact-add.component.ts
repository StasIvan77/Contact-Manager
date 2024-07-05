import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContactService } from '../shared/contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon'; // Імпорт модуля для mat-icon
import { MatDatepickerModule } from '@angular/material/datepicker'; // Імпорт модуля для datepicker
import { MatNativeDateModule } from '@angular/material/core'; // Імпорт модуля для native date
import { MatSelectModule } from '@angular/material/select';
import { Subject, merge } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contact-add',
  templateUrl: './contact-add.component.html',
  styleUrls: ['./contact-add.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    FormsModule, ReactiveFormsModule, CommonModule,
    MatButtonModule]
})
export class ContactAddComponent implements OnInit, OnDestroy  {
  contactForm!: FormGroup;
  private destroy$ = new Subject<void>();

  errorMessage: string = '';
  isEditMode: boolean = false;
  contactId?: string | null;


  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder) {
      // Ініціалізація `FormGroup` з усіма необхідними полями
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
    merge(
      this.contactForm.get('email')!.statusChanges,
      this.contactForm.get('email')!.valueChanges
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => this.updateErrorMessage());
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
    } else {
      // Обробка випадку, коли контакт не знайдено
    }
  }

  // Метод для оновлення повідомлень про помилки для поля email
  updateErrorMessage() {
    const emailControl = this.contactForm.get('email');
    if (emailControl?.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (emailControl?.hasError('email')) {
      this.errorMessage = 'Not a valid email';
    } else {
      this.errorMessage = '';
    }
  }

  // Метод для додавання контакту
  saveContact(): void {
    if (this.contactForm.valid) {
      const formData = this.contactForm.getRawValue();
      if (this.isEditMode && this.contactId) {
        // Редагуємо існуючий контакт
        this.contactService.updateContact({ ...formData, id: this.contactId });
      } else {
        // Додаємо новий контакт
        this.contactService.addContact(formData);
      }
      this.router.navigate(['/contacts']);
    }
  }

  // Метод для відміни додавання контакту
  cancel(): void {
    this.router.navigate(['/contacts']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
}