import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CONTACT_DATA } from '../data/contact.data';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css'
})
export class ContactPageComponent {
  readonly data = CONTACT_DATA;
  readonly copied = signal(false);

  copyEmail(): void {
    navigator.clipboard.writeText(this.data.emailAddress).then(() => {
      this.copied.set(true);
      setTimeout(() => {
        this.copied.set(false);
      }, 2000);
    });
  }
}
