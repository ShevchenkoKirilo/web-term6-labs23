import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  public api = 'https://localhost:7287/';
  constructor(private http: HttpClient) {}

  get<T>(path: string) {
    return this.http.get<T>(`${this.api}${path}`);
  }

  post<T>(path: string, body: any) {
    return this.http.post<T>(`${this.api}${path}`, body);
  }

  postWithToken<T>(path: string, body: any, token: string) {
    return this.http.post<T>(`${this.api}${path}`, body, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  }

  put<T>(path: string, body: any) {
    return this.http.put<T>(`${this.api}${path}`, body);
  }

  putWithToken<T>(path: string, body: any, token: string) {
    return this.http.put<T>(`${this.api}${path}`, body, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  }

  delete<T>(path: string, id: number) {
    return this.http.delete<T>(`${this.api}${path}/${id}`);
  }

  deleteWithToken<T>(path: string, id: number, token: string) {
    return this.http.delete<T>(`${this.api}${path}/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  }
}
