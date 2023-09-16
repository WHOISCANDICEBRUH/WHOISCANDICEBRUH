import { Component, isDevMode } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor(public router: Router) {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        if (isDevMode()) {
          console.log("call google analytics. " + event.urlAfterRedirects);
        } else {
          gtag('config', 'UA-168349551-1', {
            'page_path': event.urlAfterRedirects
          });
        }
      }
    });
  }
}
