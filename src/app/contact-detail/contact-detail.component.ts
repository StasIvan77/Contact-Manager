import { Component, OnInit } from '@angular/core';
import { Contact } from '../shared/contact.model';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { ContactService } from '../shared/contact.service';
import {MatIconModule} from '@angular/material/icon'
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss'],
  standalone: true,
  imports: [MatIconModule, CommonModule,
    MatCardModule, RouterModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule
  ]
})
export class ContactDetailComponent implements OnInit {
  contact: Contact | undefined;
  
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService
  ) { }

  

  ngOnInit(): void {    
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.contact = this.contactService.getContactById(id.toString());
    });
  
  }

  goBackToList(): void {
    this.router.navigate(['/contacts']);
  }

  deleteContact(): void {
    if (this.contact) {
      this.contactService.deleteContact(this.contact.id);
      this.router.navigate(['/contacts']);
    }
  }

  editContact(): void {
    if (this.contact) {
      this.router.navigate(['/contacts', 'edit', this.contact.id]);
    }
  }

  

}
