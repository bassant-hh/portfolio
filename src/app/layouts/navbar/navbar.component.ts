import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ModeSwitcherComponent } from '../mode-switcher/mode-switcher.component';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ModeSwitcherComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  protected readonly state = inject(PortfolioStateService);
  readonly isMenuOpen = signal(false);

  constructor() {
    // Close mobile menu automatically when switching to developer mode
    effect(() => {
      if (this.state.uiMode() === 'developer') {
        this.isMenuOpen.set(false);
      }
    });
  }

  toggleMenu(): void {
    this.isMenuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
