import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { AiAssistantComponent } from '../../features/ai-assistant/components/ai-assistant/ai-assistant.component';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, AiAssistantComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  protected readonly state = inject(PortfolioStateService);
}
