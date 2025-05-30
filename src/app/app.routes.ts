import { Routes } from '@angular/router';
import {GeneralOverviewComponent} from './general-overview/general-overview.component';
import {HabitCreateComponent} from './habbit-create/habit-create.component';
import {HabitStatusComponent} from './habit-status/habit-status.component';

export const routes: Routes = [
  {path: "", component: GeneralOverviewComponent},
  {path: "habit/status", component: HabitStatusComponent},
  {path: "habit/create", component: HabitCreateComponent}
];
