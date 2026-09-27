import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';

@Component({
  selector: 'app-mode-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mode-switcher.component.html',
  styleUrl: './mode-switcher.component.css'
})
export class ModeSwitcherComponent {
  protected readonly state = inject(PortfolioStateService);
  private readonly router = inject(Router);

  selectRecruiterMode(): void {
    this.state.setUiMode('recruiter');
    this.router.navigate(['/home']);
  }

  selectDeveloperMode(): void {
    this.state.setUiMode('developer');
    this.router.navigate(['/workspace']);
  }

  toggleMobileMode(): void {
    const nextMode = this.state.uiMode() === 'recruiter' ? 'developer' : 'recruiter';
    this.state.setUiMode(nextMode);
    if (nextMode === 'developer') {
      this.router.navigate(['/workspace']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
