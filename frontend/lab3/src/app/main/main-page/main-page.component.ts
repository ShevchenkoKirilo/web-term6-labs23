import { Component } from '@angular/core';
import { Image } from 'src/app/interfaces/Image';
import { User } from 'src/app/interfaces/User';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent {
  user!: User | null;

  images: Image[] = [];

  uploadForm: FormGroup;

  selectedFile: string = '';

  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) {
    this.uploadForm = new FormGroup({
      imageInput: new FormControl('', [Validators.required]),
    });
  }

  logout() {
    this.storageService.clearUser();
    this.storageService.clearToken();
    window.location.reload();
  }

  ngOnInit(): void {
    this.user = this.storageService.getUser() as User;

    this.apiService.get<Image[]>('images').subscribe((images: any[]) => {
      this.images = images;
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

  resizeImage(base64Str: string, maxWidth = 512, maxHeight = 512) {
    return new Promise((resolve) => {
      let img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let canvas = document.createElement('canvas');
        const MAX_WIDTH = maxWidth;
        const MAX_HEIGHT = maxHeight;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL());
      };
    });
  }

  onSubmit() {
    const token = this.storageService.getToken();
    this.resizeImage(this.selectedFile, 512, 512).then((result) => {
      if (token) {
        this.apiService
          .postWithToken<Image>(
            'images',
            {
              imageBase64: result,
            },
            token
          )
          .subscribe((image: Image) => {
            window.location.reload();
          });
      }
    });
  }
}
