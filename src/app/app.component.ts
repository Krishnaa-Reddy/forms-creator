import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  copyArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { fullComponentCode2 } from './_utils';
import { ButtonGeneratorComponent } from './components/button-generator.component';
import { CodeContentComponent } from './components/code-content.component';
import {
  DateComponent,
  Dropdown,
  FormElementField,
  FormElementFieldWithIcon,
  FormElementType,
  TextArea,
  TextField
} from './components/form-elements/form-elements.component';
import { CustomFormComponent } from './components/test.component';

export const formElements = [
  {
    type: 'Text Field',
    icon: 'title',
  },
  {
    type: 'Text Area',
    icon: 'subject',
  },
  {
    type: 'Date',
    icon: 'calendar_today',
  },
  {
    type: 'Dropdown',
    icon: 'arrow_drop_down_circle',
  }
] as const;

type SelectedItem = {
  element: FormElementField;
  elementIndex: number;
  index: number;
}


export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-root',
  imports: [
    MatButtonModule,
    CustomFormComponent,
    MatTooltipModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgComponentOutlet,
    MatIconModule,
    CdkDragPlaceholder,
    CdkDrag,
    CdkDropList,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDividerModule,
    MatListModule,
    MatCardModule,
    FormsModule,
    ButtonGeneratorComponent
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
      },
    },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  formElements = signal(formElements);
  formElementsWithDefaults = computed(() => {
    return this.formElements().map(({ type, icon }) => (<FormElementField>{
      type,
      label: '',
      placeholder: '',
      required: false,
    }));
  });


  private matIconRegistry = inject(MatIconRegistry);
  private domSanitizer = inject(DomSanitizer);

  readonly dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(CodeContentDialog, {
      data: { formCanvas: this._filteredFormCanvas() },
      minWidth: '800px',
      position: { top: '50px' },
    });
  }
  editorModeOn = signal<boolean>(false);
  
  formElementComponents = signal<Partial<Record<FormElementType, any>>>({
    'Text Field': TextField,
    'Text Area': TextArea,
    Date: DateComponent,
    Dropdown: Dropdown,
  });

  propertiesForm = signal(new FormGroup({
    label: new FormControl('', { nonNullable: true }),
    placeholder: new FormControl('', { nonNullable: true }),
    required: new FormControl(false, { nonNullable: true }),
  }));

  formCanvas = signal<FormElementField[][]>([]);

  _filteredFormCanvas = computed(() => this.formCanvas().filter(row => row.length))

  exportForm() {
    if(this._filteredFormCanvas().length > 0) {
      console.log(this._filteredFormCanvas());
    } 
  }


  _selectedItem = computed(() => {
    return this.formCanvas().reduce<SelectedItem | undefined>((acc, row, index) => {
      const selectedElementIndex = row.findIndex((element) => element.selected);
      if (selectedElementIndex > -1) {
        return {
          index,
          element: row[selectedElementIndex],
          elementIndex: selectedElementIndex,
        };
      }
      return acc;
    }, undefined);
  });

  _propetiesFormChanges = computed(() => this.propertiesForm().valueChanges);

  
  _selectedElement = computed(() => {
    return this.formCanvas().flatMap(row => row).find(element => element.selected);
  });


  getEditorRowId = (index: number) => `editor-row-${index}`;

  formCanvasIds = computed(() => {
    return this.formCanvas().map((_, index) => this.getEditorRowId(index));
  });

  resetSelectedElement() {
    this.formCanvas.update((prev) => {
      return prev.map((row) => {
        return row.map((element) => {
          return {
            ...element,
            selected: false,
          };
        });
      });
    });
  }

  onEditorModeChange(mode: string | undefined) {
      if(mode) {
        this.editorModeOn.set(mode === 'editor');
        if(mode === 'preview') {
          this.resetSelectedElement();
        }
      }
  }

  constructor() {
    this.matIconRegistry.addSvgIcon('github', this.domSanitizer.bypassSecurityTrustResourceUrl('github-24.svg'));
    
    effect(() => {
      const selectedItem = this._selectedItem();
      if (selectedItem) {
        this.propertiesForm.set(new FormGroup({
          label: new FormControl(selectedItem.element.label, { nonNullable: true }),
          placeholder: new FormControl(selectedItem.element.placeholder, { nonNullable: true }),
          required: new FormControl(selectedItem.element.required, { nonNullable: true }),
        }));
      }
    });
    
    effect(() => {
      const formChangesSub$ = this._propetiesFormChanges().subscribe((value) => {
        this.formCanvas.update((prev) => {
            const selectedItem = this._selectedItem();
            if (selectedItem) {
              const { index, elementIndex } = selectedItem;
              return prev.map((row, i) =>
                i === index
                  ? row.map((element, j) =>
                      j === elementIndex
                        ? {
                            ...element,
                            ...value,
                          }
                        : element
                    )
                  : row
              );
            }
            return [...prev];
        });  
    })          
    });
  }

  protected getFormElementComponent(type: string) {
    const elementType = type as FormElementType;
    return this.formElementComponents()[elementType] || TextField;
  }


  dropRows(event: CdkDragDrop<FormElementField[]>) {
    moveItemInArray(this.formCanvas(), event.previousIndex, event.currentIndex);
  }

  droppedFromNavList(event: CdkDragDrop<FormElementField[]>) {
    
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.formCanvas.set([...this.formCanvas()]);
  }

  getItemWithoutIcon(item: FormElementFieldWithIcon) {
    const { icon, ...rest } = item;
    return rest as FormElementField;
  }

  noReturnPredicate(_: CdkDrag, drop: CdkDropList) {
    return drop.data.length < 3;
  }

  deleteRow(index: number) {
    this.formCanvas.update((prev) => prev.filter((_, i) => i !== index));
  }

  addRow() {
    this.formCanvas.update((prev) => [...prev, []]);
  }

  deleteElement(index: number, elementIndex: number, event: Event) {
    event.stopPropagation();
    this.formCanvas.update((prev) =>
      prev.map((row, i) =>
        i === index ? row.filter((_, j) => j !== elementIndex) : row
      )
    );
  }

  handleSelection(item: {
    element: FormElementField;
    elementIndex: number;
    index: number;
  }) {

    this.formCanvas.update((prev) => {
        const { index, elementIndex } = item;
        return prev.map((row, i) =>
           row.map((element, j) =>
              ({
                ...element,
                selected: i === index && j === elementIndex
              })
            )
        );
    });

  }

}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-content.html',
  imports: [
    MatFormFieldModule,
    CdkCopyToClipboard,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CodeContentComponent,
    // NgOptimizedImage
  ],
})
export class CodeContentDialog {
  private _snackBar = inject(MatSnackBar);
  readonly dialogRef = inject(MatDialogRef<CodeContentDialog>);
  readonly data = inject<{
    formCanvas: FormElementField[][];
  }>(MAT_DIALOG_DATA);

  _generatedFormComponentCode = fullComponentCode2(this.data.formCanvas);

  copyFullComponent() {
    navigator.clipboard.writeText(this._generatedFormComponentCode);
    alert('Full component copied!');
  }


  downloadFullComponent() {
    const blob = new Blob([this._generatedFormComponentCode], {
      type: 'text/typescript',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom-form.component.ts';
    a.click();
    URL.revokeObjectURL(url);
  }

  isCopied(event: boolean) {
    if (event) {
      this._snackBar.open('Copied to clipboard!', 'Dismiss', {
        duration: 2000,
      });
    }
  }

}
