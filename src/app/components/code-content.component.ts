import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';

@Component({
  selector: 'app-code-content',
  imports: [],
  host: { class: 'flex justify-center w-full h-full text-xs' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <pre class="!m-0">
      <code #codeElement class="language-typescript">
        {{ fullComponentCode() }}
      </code>
    </pre>
  `,
})
export class CodeContentComponent {

  fullComponentCode = input.required<string>();
  codeElement = viewChild<ElementRef>('codeElement');

  ngAfterViewInit(): void {
    const codeElement = this.codeElement();
    if(codeElement) {
      Prism.highlightElement(codeElement.nativeElement);
    }
  }
}
