import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {ScrollToDirective} from './directives/scroll-to.directive';

const classesToInclude = [
  ScrollToDirective,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  entryComponents: [],
  providers: [],
  declarations: classesToInclude,
  exports: classesToInclude
})
export class SharedModule {
}
