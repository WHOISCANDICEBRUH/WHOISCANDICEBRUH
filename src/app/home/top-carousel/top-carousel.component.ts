import { Component, OnInit, OnDestroy } from '@angular/core';
import { ITopCarouselItem, TopCarouselItem, TopCarouselSlide, ITopCarouselLink, TopCarouselLink, ITextOptBundleSet, TextOptBundleSet, ITextOptBundleSetApplyTo, TextOptBundleSetApplyTo, CarouselService, ITextOpt, TextOpt } from '../../services/carousel.service';
import { fromEvent, Observable, Subscription, observable } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

declare var jQuery : any;

@Component({
  selector: 'app-top-carousel',
  templateUrl: './top-carousel.component.html',
  styleUrls: []
})
export class TopCarouselComponent implements OnInit {

  carouselSlides: TopCarouselSlide[] = [];

  private resizeObservable$: Observable<Event>;
  private resizeSubscription$: Subscription;
  private isPortrait: boolean;

  constructor(
    private carouselService: CarouselService,
    private deviceDetectService: DeviceDetectorService) { }

  ngOnInit() {
    
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
      this.checkOrientation();
    });
    this.LoadTopCarouselSlides();
  }

  private checkOrientation() {
    var oldVal = this.isPortrait;
    var newVal = window.innerWidth < (window.innerHeight * 0.75); // only consider as portrait when narrow enough
    if (oldVal !== newVal) {
      this.isPortrait = newVal;
      var os = this.deviceDetectService.os;
      var browser = this.deviceDetectService.browser;
      var browserVersion = this.deviceDetectService.browser_version;
      this.carouselSlides.forEach(slide => {
        slide.setBrowser(os, browser, browserVersion);
        slide.setOrientation(this.isPortrait ? 'portrait' : 'landscape');
        console.log(slide.effectiveTextOptBundleSet.name);
      });
    }
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
  }

  private LoadTopCarouselSlides = () => {

    this.carouselService.getTopCarouselList()
      .subscribe(result => {
        result.forEach(item =>{
          var slide = new TopCarouselSlide(item);
          this.carouselSlides.push(slide);
        });
        this.checkOrientation();
    }, error => console.error(error));
  }

  topCarouselIsIntialized = false;

  initTopCarousel(){
    if (this.topCarouselIsIntialized) return;

    var revapi;
  
    // Make Content Visible
    jQuery(".fullscreenbanner ul").removeClass('hide');
  
    /**
      @FULLSCREEN SLIDER
    **/
    if(jQuery(".fullscreenbanner").length > 0) {
  
      var tpj=jQuery;				
      tpj.noConflict();				
      var revapi25;
  
      // Shadow
      var _shadow = jQuery(".fullscreenbanner").attr('data-shadow') || 0;
  
      if(tpj('.fullscreenbanner').revolution != undefined) {
        revapi25 = tpj('.fullscreenbanner').show().revolution({
          dottedOverlay:"none",
          delay:9000,
          startwidth:1200,
          startheight:700,
          hideThumbs:0,
          
          thumbWidth:100,
          thumbHeight:50,
          thumbAmount:4,
          
          navigationType:"bullet",
          navigationArrows:"solo",
          navigationStyle:jQuery('.fullscreenbanner').attr('data-navigationStyle') || "round",
          
          touchenabled:"on",
          onHoverStop:"on",

          swipe_velocity: 0.7,
          swipe_min_touches: 1,
          swipe_max_touches: 1,
          drag_block_vertical: false,

          keyboardNavigation:"on",
          
          navigationHAlign:"center",
          navigationVAlign:"bottom",
          navigationHOffset:0,
          navigationVOffset:30,

          soloArrowLeftHalign:"left",
          soloArrowLeftValign:"center",
          soloArrowLeftHOffset:20,
          soloArrowLeftVOffset:0,

          soloArrowRightHalign:"right",
          soloArrowRightValign:"center",
          soloArrowRightHOffset:20,
          soloArrowRightVOffset:0,

          parallax:"mouse",
          parallaxBgFreeze:"on",
          parallaxLevels:[7,4,3,2,5,4,3,2,1,0],

          shadow: parseInt(_shadow),
          fullWidth:"off",
          fullScreen:"on",

          stopLoop:"off",
          stopAfterLoops:-1,
          stopAtSlide:-1,
          
          shuffle:"off",

          forceFullWidth:"off",						
          fullScreenAlignForce:"off",	
          
          hideThumbsOnMobile:"off",
          hideBulletsOnMobile:"off",
          hideArrowsOnMobile:"off",
          hideThumbsUnderResolution:0,
          
          hideSliderAtLimit:0,
          hideCaptionAtLimit:768,
          hideAllCaptionAtLilmit:0,
          startWithSlide:0,
          fullScreenOffsetContainer: jQuery("#header").hasClass('transparent') || jQuery("#header").hasClass('translucent') ? null : "#header"	
        });
      }    
    }
     
    this.topCarouselIsIntialized = true;
  }
}
