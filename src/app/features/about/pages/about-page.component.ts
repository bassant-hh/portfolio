import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ABOUT_DATA } from '../data/about.data';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css'
})
export class AboutPageComponent {
  readonly data = ABOUT_DATA;
}
