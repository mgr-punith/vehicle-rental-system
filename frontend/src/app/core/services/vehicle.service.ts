import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedVehicleResponse, Vehicle } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/vehicles';

  getVehicles(page = 1, limit = 5, search = '', status = ''): Observable<PaginatedVehicleResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    if (status.trim()) {
      params = params.set('status', status.trim());
    }

    return this.http.get<PaginatedVehicleResponse>(this.apiUrl, { params });
  }

  getVehicleById(id: string): Observable<{ success: boolean; message: string; data: Vehicle }> {
    return this.http.get<{ success: boolean; message: string; data: Vehicle }>(`${this.apiUrl}/${id}`);
  }

  createVehicle(vehicle: Vehicle): Observable<{ success: boolean; message: string; data: Vehicle }> {
    return this.http.post<{ success: boolean; message: string; data: Vehicle }>(this.apiUrl, vehicle);
  }

  updateVehicle(id: string, vehicle: Vehicle): Observable<{ success: boolean; message: string; data: Vehicle }> {
    return this.http.put<{ success: boolean; message: string; data: Vehicle }>(`${this.apiUrl}/${id}`, vehicle);
  }

  deleteVehicle(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}