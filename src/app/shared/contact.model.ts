// contact.model.ts

export interface Contact {
    id: string; // Ідентифікатор контакту
    firstName: string; // Ім'я
    lastName: string; // Прізвище
    phoneNumber: string; // Номер телефону
    birthDate?: string;
    email?: string; 
    address?: string;
  }
  