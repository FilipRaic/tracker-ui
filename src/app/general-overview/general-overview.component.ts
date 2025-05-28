import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-general-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './general-overview.component.html',
  styleUrl: './general-overview.component.scss'
})
export class GeneralOverviewComponent {

}
