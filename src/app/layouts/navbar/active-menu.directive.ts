import { Directive, OnInit, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appActiveMenu]'
})
export class ActiveMenuDirective implements OnInit {
    @Input() appActiveMenu: string;

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnInit() {
    }

    updateActiveFlag(selectedLanguage) {
        this.renderer.removeClass(this.el.nativeElement, 'active');
    }
}
