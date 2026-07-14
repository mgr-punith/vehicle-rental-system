import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  cards = [
    { title: 'Vehicles', value: 'Manage vehicle records', icon: 'directions_car' },
    { title: 'Search', value: 'Search by name, brand, reg no.', icon: 'search' },
    { title: 'Filter', value: 'Filter by Available or Booked', icon: 'filter_alt' },
    { title: 'Pagination', value: 'Server-side pagination ready', icon: 'view_list' },
  ];
}