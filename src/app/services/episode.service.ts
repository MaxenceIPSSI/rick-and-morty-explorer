import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Episode } from '../models/episode.model';

@Injectable({ providedIn: 'root' })
export class EpisodeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://rickandmortyapi.com/api/episode';

  getAll(page: number): Observable<ApiResponse<Episode>> {
    const params = new HttpParams().set('page', page);
    return this.http.get<ApiResponse<Episode>>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Episode> {
    return this.http.get<Episode>(`${this.baseUrl}/${id}`);
  }

  getMany(ids: number[]): Observable<Episode[]> {
    return this.http.get<Episode[]>(`${this.baseUrl}/${ids.join(',')}`);
  }
}
