import { Component, signal } from '@angular/core';
import { UserDashboard } from './pages/user-dashboard/user-dashboard';

@Component({
  selector: 'app-root',
  imports: [UserDashboard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('assessment');
}
