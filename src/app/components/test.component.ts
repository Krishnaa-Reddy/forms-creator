
import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
  
export type FormElementType = 'Text Field' | 'Text Area' | 'Date' | 'Dropdown';

export type FormElementField = {
  type: FormElementType;
  label: string;
  placeholder: string;
  required: boolean;
  selected?: boolean;
}
  
@Component({
  selector: 'app-custom-form',
  standalone: true,
  host: { class: 'bg-blue-100 p-4 space-y-4 flex items-center justify-center' },
  providers: [provideNativeDateAdapter()],
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="w-[800px]">
      @for (item of _filteredFormCanvas(); track $index; let index = $index) {
          <div class="flex flex-wrap gap-2 mt-2">
            @for (element of item; track $index; let elementIndex = $index) {
            <div class="min-w-[200px] flex-1">
                  <ng-container
                    *ngComponentOutlet="
                      getFormElementComponent(element.type);
                      inputs: { element: element }
                    "
                  />
            </div>
  
            }
          </div>
        } @empty {
          <div
            class="flex flex-col justify-center items-center h-60 w-full text-center font-semibold text-gray-700"
          >
          <p>Nothing to show here.</p>
          </div>
  
          }
    </section>
  `,
})
export class CustomFormComponent {

formElementComponents = signal<Partial<Record<FormElementType, any>>>({
  'Text Field': TextField,
  'Text Area': TextArea,
  Date: DateComponent,
  Dropdown: Dropdown,
});

_filteredFormCanvas = signal([
     [
          {
               "type": "Text Field",
               "label": "First Name",
               "placeholder": "Ex. John",
               "required": false,
               "selected": false
          },
          {
               "type": "Text Field",
               "label": "Last Name",
               "placeholder": "Ex. Wick",
               "required": false,
               "selected": false
          }
     ],
     [
          {
               "type": "Dropdown",
               "label": "Favourite Food",
               "placeholder": "Ex. Biryani",
               "required": false,
               "selected": false
          },
          {
               "type": "Date",
               "label": "DOB",
               "placeholder": "Ex. 18/11/2000",
               "required": true,
               "selected": false
          }
     ],
     [
          {
               "type": "Text Area",
               "label": "Address",
               "placeholder": "Ex. New York",
               "required": true,
               "selected": false
          }
     ]
]);

  protected getFormElementComponent(type: string) {
    const elementType = type as FormElementType;
    return this.formElementComponents()[elementType] || TextField;
  }
}

///// Form Elements
@Component({
  selector: 'app-text-field',
  imports: [MatInputModule, MatFormFieldModule, MatIconModule],
  template: `
    <mat-form-field class="w-full">
      <mat-label>{{ element().label }}</mat-label>
      <input [required]="element().required" matInput [placeholder]="element().placeholder" />
    </mat-form-field>
  `
})
export class TextField {
  element = input.required<FormElementField>();
}

@Component({
  selector: 'app-text-area',
  imports: [MatInputModule, MatFormFieldModule, MatIconModule],
    template: `
    <mat-form-field class="w-full">
      <mat-label>{{ element().label }}</mat-label>
      <textarea [required]="element().required" matInput [placeholder]="element().placeholder"></textarea>
    </mat-form-field>
  `
})
export class TextArea {
  element = input.required<FormElementField>();
}

@Component({
  selector: 'app-date',
  providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatFormFieldModule, MatIconModule, MatDatepickerModule],
  template: `
    <mat-form-field class="w-full">
      <mat-label>{{ element().label }}</mat-label>
      <input [required]="element().required" matInput [placeholder]="element().placeholder" [matDatepicker]="picker">
      <mat-hint>MM/DD/YYYY</mat-hint>
      <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
  `
})
export class DateComponent {
  element = input.required<FormElementField>();
}

@Component({
  selector: 'app-dropdown',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field class="w-full">
      <mat-label>{{ element().label }}</mat-label>
      <mat-select [required]="element().required">
            @for (option of ['Option 1', 'Option 2', 'Option 3']; track $index) {
        <mat-option [value]="option">{{option}}</mat-option>
      }
      </mat-select>
    </mat-form-field>
  `

})
export class Dropdown {

  element = input.required<FormElementField>();

}