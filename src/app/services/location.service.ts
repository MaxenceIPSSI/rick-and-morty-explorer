import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Location } from '../models/location.model';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://rickandmortyapi.com/api/location';

  getAll(page: number): Observable<ApiResponse<Location>> {
    const params = new HttpParams().set('page', page);
    return this.http.get<ApiResponse<Location>>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Location> {
    return this.http.get<Location>(`${this.baseUrl}/${id}`);
  }
}
