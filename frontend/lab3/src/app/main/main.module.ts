import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ImageBlockComponent } from './image-block/image-block.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MainPageComponent,
    LoginComponent,
    RegisterComponent,
    ImageBlockComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
  ]
})
export class MainModule { }
