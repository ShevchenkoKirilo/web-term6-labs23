import { Injectable } from "@angular/core";
import { User } from "../interfaces/User";

@Injectable({ providedIn: 'root' })
export class StorageService {
    setUser(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    setToken(token: string) {
        localStorage.setItem('token', token);
    }

    getUser(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    clearUser() {
        localStorage.removeItem('user');
    }

    clearToken() {
        localStorage.removeItem('token');
    }
}
