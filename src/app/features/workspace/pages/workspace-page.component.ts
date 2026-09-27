import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalWidgetComponent } from '../../terminal/components/terminal-widget/terminal-widget.component';
import { PortfolioStateService } from '../../../core/services/portfolio-state.service';

@Component({
  selector: 'app-workspace-page',
  standalone: true,
  imports: [
    CommonModule,
    TerminalWidgetComponent
  ],
  templateUrl: './workspace-page.component.html',
  styleUrl: './workspace-page.component.css'
})
export class WorkspacePageComponent implements OnInit {
  protected readonly state = inject(PortfolioStateService);

  ngOnInit(): void {
    this.state.setUiMode('developer');
  }
}

