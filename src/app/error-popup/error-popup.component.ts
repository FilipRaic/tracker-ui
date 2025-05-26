import { Component, Input } from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-error-popup',
  imports: [CommonModule],
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.scss']
})
export class ErrorPopupComponent {
  header: string = "Error";
  messages: string[] = [];
  visible = false;

  showErrors(errors: string[] | string) {
    this.header = "Error"
    this.show(errors);
  }

  showFailedValidations(validationErrors: string[] | string) {
    this.header = "Failed validation"
    this.show(validationErrors);
  }

  private show(errors: string[] | string) {
    this.messages = Array.isArray(errors) ? errors : [errors];
    this.visible = true;
  }

  hide() {
    this.visible = false;
    this.messages = [];
  }
}
