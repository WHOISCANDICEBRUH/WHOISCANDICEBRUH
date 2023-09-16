import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { menuItems as constMenuItems } from '../../shared/constants/menuItems';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  // make the menu list a service that is shared with the nvabar
  menuItems = constMenuItems;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,) {
  }

  ngOnInit() {
    this.router.events.pipe (
        filter (event => event instanceof NavigationEnd),
        map (() => this.activeRoute),
        map (route => {
            while (route.firstChild) route = route.firstChild;
            return route;
        }),
        filter (route => route.outlet === 'primary'),
    )
    .subscribe (route =>{
        // if the activated root component is HomeComponent
        if (route && route.snapshot && route.component &&
            route.snapshot.component.toString().startsWith('function HomeComponent')){
            // then the "find product" menu item should only do scroll, not route
            this.menuItems.forEach (menuItem => {
                if (menuItem.name && menuItem.name === 'gallery'){
                    menuItem.useScroll = true;
                }
            });
        }
    });
}

}
