import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { smoothScrollTo } from '../shared/helpers/scroll-helper';
import { TopCarouselComponent } from './top-carousel/top-carousel.component';
import { GalleryComponent } from '../gallery/gallery.component';

declare var jQuery : any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  constructor (private activatedRoute: ActivatedRoute){}

  
  @ViewChild(TopCarouselComponent) topCarouselComponent: TopCarouselComponent;
  @ViewChild(GalleryComponent) galleryComponent: GalleryComponent;

  ngOnInit (){
    jQuery("#header").addClass("transparent");
  }
  
  // handle navigation scroll
  @HostListener('window:load')
  doScroll (){
    var route = this.activatedRoute;
    if (route && route.snapshot && route.snapshot.data && route.snapshot.data['scrollTo']
      && route.snapshot.data['scrollTo'] === 'gallery'){
        smoothScrollTo('gallery');
      }
  }
}
