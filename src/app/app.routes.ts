import {Routes} from '@angular/router';
import {GeneralOverviewComponent} from './general-overview/general-overview.component';
import {HabitCreateComponent} from './habbit-create/habit-create.component';
import {HabitStatusComponent} from './habit-status/habit-status.component';
import {JournalComponent} from './journal/journal.component';
import {DailyCheckComponent} from './daily-check/daily-check.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {canActivate} from './guard/login.guard';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';

export const routes: Routes = [
  // Public routes
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "forgot-password", component: ForgotPasswordComponent},
  {path: "reset-password/:token", component: ResetPasswordComponent},
  {path: "daily-check/:uuid", component: DailyCheckComponent},

  // Protected routes
  {path: "", component: GeneralOverviewComponent, canActivate: [canActivate]},
  {path: "habit/status", component: HabitStatusComponent, canActivate: [canActivate]},
  {path: "habit/create", component: HabitCreateComponent, canActivate: [canActivate]},
  {path: "journal", component: JournalComponent, canActivate: [canActivate]},

  // Redirect to login for any other routes
  {path: "**", redirectTo: "login"}
];
