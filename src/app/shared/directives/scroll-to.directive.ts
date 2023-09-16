import {Directive, ElementRef, HostListener, OnInit, Input} from '@angular/core';
import { smoothScrollTo } from '../helpers/scroll-helper';

@Directive({selector: '[scrollTo]'})
export class ScrollToDirective implements OnInit {

  @Input('scrollTo')
  scrollTo: string;
  constructor(private el: ElementRef) {
  }

  ngOnInit() {
  }

  @HostListener('click', ['$event'])
  smoothScroll() {
    return smoothScrollTo (this.scrollTo);
  };
}
