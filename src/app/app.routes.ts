import { Routes } from '@angular/router';
import {GeneralOverviewComponent} from './general-overview/general-overview.component';
import {HabitCreateComponent} from './habbit-create/habit-create.component';

export const routes: Routes = [
  {path: "", component: GeneralOverviewComponent},
  {path: "habit/create", component: HabitCreateComponent}
];
