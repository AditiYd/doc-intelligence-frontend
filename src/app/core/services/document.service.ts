import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DocumentResponse, StatsResponse } from '../models/document.model';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<DocumentResponse> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<DocumentResponse>(`${this.base}/api/documents/upload`, form);
  }

  getAll(): Observable<DocumentResponse[]> {
    return this.http.get<DocumentResponse[]>(`${this.base}/api/documents`);
  }

  getById(id: string): Observable<DocumentResponse> {
    return this.http.get<DocumentResponse>(`${this.base}/api/documents/${id}`);
  }

  getStats(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.base}/api/documents/stats`);
  }
}
