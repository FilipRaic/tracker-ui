import {Routes} from '@angular/router';
import {GeneralOverviewComponent} from './general-overview/general-overview.component';
import {HabitCreateComponent} from './habbit-create/habit-create.component';
import {HabitStatusComponent} from './habit-status/habit-status.component';
import {JournalComponent} from './journal/journal.component';
import {DailyCheckComponent} from './daily-check/daily-check.component';

export const routes: Routes = [
  {path: "", component: GeneralOverviewComponent},
  {path: "habit/status", component: HabitStatusComponent},
  {path: "habit/create", component: HabitCreateComponent},
  {path: "journal", component: JournalComponent},
  {path: "daily-check/:uuid", component: DailyCheckComponent}
];
