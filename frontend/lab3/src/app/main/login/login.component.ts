import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as shajs from 'sha.js';
import { User } from 'src/app/interfaces/User';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private storageService: StorageService
  ) {
    this.loginForm = new FormGroup({
      nickname: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16),
        Validators.pattern('([a-zA-Z]+[0-9]*)+'),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(32),
      ]),
    });
  }

  onSubmit() {
    const nickname = this.loginForm.get('nickname')?.value;
    const password = shajs('sha256')
      .update(this.loginForm.get('password')?.value)
      .digest('hex');

    this.apiService
      .post<string>('users/login', {
        nickname,
        password,
      })
      .subscribe((token: any) => {
        if (token) {
          this.storageService.setToken(token.token);
          this.getUser();
        }
      });
  }

  getUser() {
    this.apiService
      .get<User>(`users/${this.loginForm.get('nickname')?.value}`)
      .subscribe((user: User) => {
        if (user) {
          this.storageService.setUser(user);
          this.router.navigate(['']);
        }
      });
  }
}
