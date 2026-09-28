import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Certificate } from '../../../certificates/models/certificate.model';

@Component({
  selector: 'app-certificate-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificate-viewer.component.html',
  styleUrl: './certificate-viewer.component.css'
})
export class CertificateViewerComponent implements OnChanges {
  @Input() certificate: Certificate | null = null;
  @Output() onPrev = new EventEmitter<void>();
  @Output() onNext = new EventEmitter<void>();

  imageFailed: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['certificate']) {
      this.imageFailed = false;
    }
  }

  onImageError(): void {
    this.imageFailed = true;
  }
}
