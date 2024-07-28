import { Injectable } from '@angular/core';
import { Contact } from '../shared/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly localStorageKey = 'contacts';

  private initialContacts: Contact[] = [
    { id: '1', firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', email: 'john@example.com', birthDate: '1990-01-01', address: '123 Main St' },
    { id: '2', firstName: 'Jane', lastName: 'Doe', phoneNumber: '0987654321', email: 'jane@example.com', birthDate: '1995-02-02', address: '456 Elm St' },
    { id: '3', firstName: 'Alice', lastName: 'Smith', phoneNumber: '9876543210', email: 'alice@example.com', birthDate: '1985-03-03', address: '789 Oak St' },
    { id: '4', firstName: 'Bob', lastName: 'Johnson', phoneNumber: '0123456789', email: 'bob@example.com', birthDate: '1980-04-04', address: '321 Pine St' }
  ];

  constructor() {
    this.initializeContacts();
   }

   private initializeContacts(): void {
    const storedContacts = localStorage.getItem(this.localStorageKey);
    //corrected mock data here
    if (!storedContacts) {
      // Зберігаємо початкові контакти в Local Storage, якщо вони відсутні або порожні
      this.saveContactsToLocalStorage(this.initialContacts);
    }
  }

   private saveContactsToLocalStorage(contacts: Contact[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(contacts));
  }

  private getContactsFromLocalStorage(): Contact[] {
    const contactsJson = localStorage.getItem(this.localStorageKey);
    return contactsJson ? JSON.parse(contactsJson) : [];
  }

  getAllContacts(): Contact[] {
    return this.getContactsFromLocalStorage();
    }

  getContactById(id: string): Contact | undefined {  
    const contacts = this.getContactsFromLocalStorage();
    return contacts.find(contact => contact.id === id);
  }

  addContact(contact: Contact): void {
     
     const contacts = this.getContactsFromLocalStorage();
    // Додаємо контакт з новим id
    const maxId = Math.max(...contacts.map(contact => parseInt(contact.id, 10)), 0);
    contact.id = (maxId + 1).toString();
    contacts.push(contact);
    this.saveContactsToLocalStorage(contacts);
  }

  updateContact(updatedContact: Contact): void {
    const contacts = this.getContactsFromLocalStorage();
    const index = contacts.findIndex(contact => contact.id === updatedContact.id);
    if (index !== -1) {
      contacts[index] = updatedContact;
      this.saveContactsToLocalStorage(contacts);
    }
  }

  deleteContact(id: string): void {
    let contacts = this.getContactsFromLocalStorage();
    contacts = contacts.filter(contact => contact.id !== id);
    this.saveContactsToLocalStorage(contacts);
  }

  searchContacts(searchTerm: string): Contact[] {
    searchTerm = searchTerm.toLowerCase();
    return this.getContactsFromLocalStorage().filter(contact =>
      contact.firstName.toLowerCase().includes(searchTerm) ||
      contact.lastName.toLowerCase().includes(searchTerm) ||
      contact.phoneNumber.includes(searchTerm)
    );
  }

  
}
