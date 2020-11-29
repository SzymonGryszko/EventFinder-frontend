import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEventComponent } from './add-event/add-event.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { RoleGuard } from './auth/role.guard';
import { SignupComponent } from './auth/signup/signup.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { HomeComponent } from './home/home.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { ViewEventComponent } from './view-event/view-event.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'view-event/:eventId', component: ViewEventComponent},
  { path: 'edit-event/:eventId', component: EditEventComponent, canActivate: [AuthGuard, RoleGuard], 
  data: { 
    expectedRole: 'ROLE_ORGANIZER'
  }  },
  { path: 'my-events', component: MyEventsComponent},
  { path: 'add-event', component: AddEventComponent, canActivate: [AuthGuard, RoleGuard], 
  data: { 
    expectedRole: 'ROLE_ORGANIZER'
  } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
