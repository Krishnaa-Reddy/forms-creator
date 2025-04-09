import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { formElements } from '../../app.component';

export type FormElementField = {
  type: FormElementType;
  label: string;
  placeholder: string;
  required: boolean;
  selected?: boolean;
}

export type FormElementType = (typeof formElements)[number]['type'];

export type FormElementFieldWithIcon = FormElementField & { icon: string };

///// Form Elements
@Component({
  selector: 'app-text-field',
  imports: [MatInputModule, MatFormFieldModule, MatIconModule],
  templateUrl: './text-field.html',
})
export class TextField {
  element = input<FormElementField>();
}

@Component({
  selector: 'app-text-area',
  imports: [MatInputModule, MatFormFieldModule, MatIconModule],
  templateUrl: './text-area.html',
})
export class TextArea {
  element = input<FormElementField>();
}

@Component({
  selector: 'app-date',
  providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatFormFieldModule, MatIconModule, MatDatepickerModule],
  templateUrl: './date.html',
})
export class DateComponent {
  element = input<FormElementField>();
}

@Component({
  selector: 'app-checkbox',
  imports: [MatInputModule, MatFormFieldModule, MatIconModule, MatCheckboxModule, MatRadioModule,FormsModule ],
  templateUrl: './checkbox.html',
})
export class Checkbox {
  element = input<FormElementField>();
  checked = false;
  indeterminate = false;
  labelPosition() {
    return 'before' as const;
  }
  disabled() {
    return false;
  }
}

@Component({
  selector: 'app-dropdown',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dropdown.html',
})
export class Dropdown {

  element = input<FormElementField>();

  foods = [
    { value: 'steak', viewValue: 'Steak' },
    { value: 'chicken', viewValue: 'Chicken' },
    { value: 'pork', viewValue: 'Pork' },
    { value: 'tofu', viewValue: 'Tofu' },
  ];
}
