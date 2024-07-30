// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:9000/api/users';

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('jwt');
  }

  private token: string | null = null;


  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login?username=${username}&password=${password}`, {});
  }

  register(username: string, email: string, password: string, image: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      username,
      email,
      password,
      image
    });
  }

  getUserDetails(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${username}`);
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  softDeleteUser(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/delete/${id}`, {});
  }

  activateUser(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/activate/${id}`, {});
  }

    // Nueva función para obtener roles del JWT
    getRoles(): string[] {

      if (!this.token) return [];

      try {
        const decodedToken: any = jwtDecode(this.token);
        console.log('Decoded token:', decodedToken);
        // Si el token no tiene un rol, devolver un arreglo vacío, en caso contrario, devolver un arreglo con el rol
        return decodedToken.roles ? decodedToken.roles : [];

      } catch (error) {
        console.error('Error decoding token:', error);
        return [];
      }
    }

    hasRole(role: string): boolean {
      console.log('Roles:', this.getRoles());
      return this.getRoles().includes(role);
    }

}