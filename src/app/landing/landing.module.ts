import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { MatButtonModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, LandingRoutingModule, SharedModule, MatButtonModule],
  declarations: [LoginComponent]
})
export class LandingModule {}
