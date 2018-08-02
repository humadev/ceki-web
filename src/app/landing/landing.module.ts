import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, LandingRoutingModule, SharedModule],
  declarations: [LoginComponent]
})
export class LandingModule {}
