import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as shajs from 'sha.js';
import { User } from 'src/app/interfaces/User';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  selectedFile: string = '';
  nickname: string = '';

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private router: Router
  ) {
    this.registerForm = new FormGroup({
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
      repeatPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(32),
      ]),
    });
  }

  onSubmit() {
    const nickname = this.registerForm.get('nickname')?.value;
    const password = shajs('sha256')
      .update(this.registerForm.get('password')?.value)
      .digest('hex');
    const repeatPassword = shajs('sha256')
      .update(this.registerForm.get('repeatPassword')?.value)
      .digest('hex');

    if (password !== repeatPassword) {
      alert('Passwords do not match!');
      return;
    }

    this.apiService
      .post<string>('users/register', {
        nickname,
        password,
        avatarBase64: this.selectedFile,
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
      .get<User>(`users/${this.registerForm.get('nickname')?.value}`)
      .subscribe((user: User) => {
        if (user) {
          this.storageService.setUser(user);
          this.router.navigate(['']);
        }
      });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;
      this.selectedFile = base64String;
    };

    reader.readAsDataURL(file);
  }
}
