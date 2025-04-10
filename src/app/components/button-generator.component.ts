import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';


@Component({
  selector: 'app-button-generator',
  imports: [
    CdkCopyToClipboard,
    MatRippleModule,
    MatDividerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './button-generator.component.html',
  styles: ``,
})
export class ButtonGeneratorComponent implements AfterViewInit {
  buttonText = 'Click Me';
  buttonColor = 'primary';
  appearance = 'raised';
  includeIcon = false;
  tailwindClasses = '';

  codeElement = viewChild<ElementRef>('codeElement');

  ngAfterViewInit(): void {
    const codeElement = this.codeElement();
    if(codeElement) {
      Prism.highlightElement(codeElement.nativeElement);
    }
  }

  private _snackBar = inject(MatSnackBar);

  copyFullComponent() {
    navigator.clipboard.writeText(this.fullComponentCode);
    alert('Full component copied!');
  }

  downloadFullComponent() {
    const blob = new Blob([this.fullComponentCode], {
      type: 'text/typescript',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom-button.component.ts';
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

  // get fullComponentCode() {
  //   const formCanvas: FormElementField[][] = [
  //     [
  //       {
  //         type: 'Text Field',
  //         label: 'First Name',
  //         placeholder: 'Enter First Name',
  //         required: true,
  //       },
  //       {
  //         type: 'Dropdown',
  //         label: 'Favorite Color',
  //         placeholder: 'Enter Favorite Color',
  //         required: true,
  //       },
  //     ],
  //     [
  //       {
  //         type: 'Text Area',
  //         label: 'Bio',
  //         placeholder: 'Enter Bio',
  //         required: true,
  //       },
  //       {
  //         type: 'Date',
  //         label: 'Birthday',
  //         placeholder: 'Enter Birthday',
  //         required: true,
  //       },
  //     ]
  //   ];
  //   return fullComponentCode2(formCanvas);
  // }

  get fullComponentCode(): string {
    const iconHtml = this.includeIcon
      ? `      <mat-icon class="mr-2">favorite</mat-icon>\n`
      : '';

    const imports = [`MatButtonModule`];
    if (this.includeIcon) imports.push('MatIconModule');

    const importModules = imports.join(', ');
    const importStatement = `import { ${importModules} } from '@angular/material/${
      this.includeIcon ? 'icon' : 'button'
    }';`;

    return `
  import { Component } from '@angular/core';
  ${importStatement}
  
  @Component({
    selector: 'app-custom-button',
    standalone: true,
    imports: [${importModules}],
    template: \`
      <button mat-${this.appearance}-button color="${
      this.buttonColor
    }" class="${this.tailwindClasses}">
  ${iconHtml ? iconHtml : ''}      ${this.buttonText}
      </button>
    \`,
  })
  export class CustomButtonComponent {}`;
  }
}
