import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  currentVersion = 0;
  version = 18;
  versionString = '';

  constructor(private navigator: Router) { }

  ngOnInit(): void {
    this.checkVersion();
  }

  checkVersion(): void {
    (window as any).ngElectronCoreService.cmd({cmd: 'node', param: ['-v']}).then((data: string) => {
      this.versionString = data.replace(/[^\d.-]/g, '');
      const semver = this.versionString.split('.');
      this.currentVersion = parseFloat(`${semver[0]}.${semver[1]}`);
      if (this.currentVersion >= this.version) {
        this.navigator.navigate(['dashboard']);
      }
    });
  }
}
