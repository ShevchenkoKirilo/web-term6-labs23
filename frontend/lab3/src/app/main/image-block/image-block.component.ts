import { Component, Input } from '@angular/core';
import { Image } from 'src/app/interfaces/Image';
import { User } from 'src/app/interfaces/User';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-image-block',
  templateUrl: './image-block.component.html',
  styleUrls: ['./image-block.component.css'],
})
export class ImageBlockComponent {
  @Input() image: Image;

  user!: User | null;

  token!: string;

  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) {
    this.image = {
      id: 0,
      imageBase64: '',
      userLikedIds: [],
      userId: 0,
      userIsBanned: false,
    };
  }

  ngOnInit(): void {
    this.user = this.storageService.getUser() as User;
    this.token = this.storageService.getToken() as string;
  }

  addLike() {
    this.apiService
      .putWithToken<Image>(
        `likes/${this.image.id}/like`,
        this.image.id,
        this.token
      )
      .subscribe((image: Image) => {
        window.location.reload();
      });
  }

  removeLike() {
    this.apiService
      .putWithToken<Image>(
        `likes/${this.image.id}/dislike`,
        this.image.id,
        this.token
      )
      .subscribe((image: Image) => {
        window.location.reload();
      });
  }

  deleteImage() {
    this.apiService
      .deleteWithToken('images', this.image.id, this.token)
      .subscribe(() => {
        window.location.reload();
      });
  }

  banUser() {
    this.apiService
      .putWithToken<User>(
        `users/${this.image.userId}/ban`,
        this.image.userId,
        this.token
      )
      .subscribe((user: User) => {
        if (user.isBanned) {
          window.location.reload();
        }
      });
  }

  pardonUser() {
    this.apiService
      .putWithToken<User>(
        `users/${this.image.userId}/pardon`,
        this.image.userId,
        this.token
      )
      .subscribe((user: User) => {
        if (!user.isBanned) {
          window.location.reload();
        }
      });
  }
}
