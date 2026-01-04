import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private http = inject(HttpClient);

  constructor() {
    this.http.get('/api/users')
      .subscribe(res => console.log('API', res));
  }
}
