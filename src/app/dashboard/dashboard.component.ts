import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  openDialog() {
    (window as any).ngElectronCoreService.openDialog();
  }

  saveDialog() {
    const data = `Sample data generated at ${Date.now()}`;

    (window as any).ngElectronCoreService.saveDialog(data);
  }
}
