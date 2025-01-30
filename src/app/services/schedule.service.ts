import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private apiUrl = 'http://localhost:3000';
  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient) { }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  login(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.http.post(`${this.apiUrl}/login`, { email, password }).subscribe(
        (response: any) => {
          if (response.token) {
            this.setToken(response.token);
          }
          observer.next(response);
          observer.complete();
        },
        (error) => observer.error(error)
      );
    });
  }

  getSchedule(): Observable<any> {
    return this.http.get(`${this.apiUrl}/schedule`);
  }

  updateSchedule(day: string, start: string, end: string): Observable<any> {
    const token = this.getToken();

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.post(`${this.apiUrl}/schedule`, { day, start, end }, { headers });
  }
  
  checkAccess(day: string, time: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/check-access`, {
      params: { day, time }
    });
  }
}