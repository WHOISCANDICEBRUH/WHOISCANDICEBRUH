import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailService, email, emailingStatus } from '../services/email.service';

import { ProductService, ProductDetail, imageUrl } from '../services/product.service';
import { LookupItem } from '../services/lookup.service';

declare var jQuery : any;


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss',]
})
export class ProductComponent implements OnInit {

  product: ProductDetail;
  gallery: imageUrl[] = new Array<imageUrl>();
  dataInitialized = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private emailService: EmailService,
  ) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(result => {
      this.loadProductDetail (result.get('id'));
    }
      );
    
  }

  loadProductDetail(id: string)
  {
    this.productService.getProductDetail(id)
      .subscribe(result => {
        this.product = result;
        this.gallery = this.buildGallery(this.product);
        this.calculator.squareFeetPerBox = this.getSquareFeetPerBox(this.product);
        this.dataInitialized = true;
    }, error => console.error(error));
  }

  ngAfterViewChecked(){
    if (this.owlCarouselIsRendered()) {
      this.initCarousel();
      this.initLightBox();
      this.initZoom();
      this.initToggle();
    }
  }

  owlCarouselIsRendered() : boolean{
    if (jQuery('.markLastThumbnailItem').length > 0) {
      return true;
    }
    else{
      return false;
    }
  }

  private lightBoxInitialized = false;
  initLightBox()
  {
    if (this.lightBoxInitialized) return;

    if(typeof(jQuery.magnificPopup) == "undefined") return;

    jQuery.extend(true, jQuery.magnificPopup.defaults, {
      tClose: 		'Close',
      tLoading: 		'Loading...',

      gallery: {
        tPrev: 		'Previous',
        tNext: 		'Next',
        tCounter: 	'%curr% / %total%'
      },

      image: 	{ 
        tError: 	'Image not loaded!' 
      },

      ajax: 	{ 
        tError: 	'Content not loaded!' 
      }
    });

    var _el = jQuery(".lightbox");
    _el.each(function() {

      var _t 			= jQuery(this),
        options 	= _t.attr('data-plugin-options'),
        config		= {},
        defaults 	= {
          type: 				'image',
          fixedContentPos: 	false,
          fixedBgPos: 		false,
          mainClass: 			'mfp-no-margins mfp-with-zoom',
          closeOnContentClick: true,
          closeOnBgClick: 	true,
          image: {
            verticalFit: 	true
          },

          zoom: {
            enabled: 		false,
            duration: 		300
          },

          gallery: {
            enabled: false,
            navigateByImgClick: true,
            preload: 			[0,1],
            arrowMarkup: 		'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
            tPrev: 				'Previous',
            tNext: 				'Next',
            tCounter: 			'<span class="mfp-counter">%curr% / %total%</span>'
          },
        };

      if(_t.data("plugin-options")) {
        config = jQuery.extend({}, defaults, options, _t.data("plugin-options"));
      }

      jQuery(this).magnificPopup(config);
    });
    this.lightBoxInitialized = true;
  }

  private carouselInitialized = false;
  initCarousel()
  {
    if (this.carouselInitialized) return;
        
    var slider 		= jQuery('div.owl-carousel');


    // check for broken owl initialization
    if (jQuery(slider).data("owl-init") === true) {
      if (jQuery(slider).data("owlCarousel").$userItems){
        // properly initialized
        this.carouselInitialized = true;
        return;
      } else {
        // broken initialization, remove the control's init status and proceed
        jQuery(slider).data("owl-init", false);
      }
    }

    var options 	= slider.attr('data-plugin-options');

    var defaults = {
      items: 					5,
      itemsCustom: 			false,
      itemsDesktop: 			[1199,4],
      itemsDesktopSmall: 		[980,3],
      itemsTablet: 			[768,2],
      itemsTabletSmall: 		false,
      itemsMobile: 			[479,1],
      singleItem: 			true,
      itemsScaleUp: 			false,

      slideSpeed: 			200,
      paginationSpeed: 		800,
      rewindSpeed: 			1000,

      autoPlay: 				false,
      stopOnHover: 			false,

      navigation: 			false,
      navigationText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
              ],
      rewindNav: 				true,
      scrollPerPage: 			false,

      pagination: 			true,
      paginationNumbers: 		false,

      responsive: 			true,
      responsiveRefreshRate: 	200,
      responsiveBaseWidth: 	window,

      baseClass: 				"owl-carousel",
      theme: 					"owl-theme",

      lazyLoad: 				false,
      lazyFollow: 			true,
      lazyEffect: 			"fade",

      autoHeight: 			false,

      jsonPath: 				false,
      jsonSuccess: 			false,

      dragBeforeAnimFinish: 	true,
      mouseDrag: 				true,
      touchDrag: 				true,

      transitionStyle: 		false,

      addClassActive: 		false,

      beforeUpdate: 			false,
      afterUpdate: 			false,
      beforeInit: 			false,
      afterInit: 				false,
      beforeMove: 			false,
      afterMove: 				false,
      afterAction: 			false,
      startDragging: 			false,
      afterLazyLoad: 			false
    }
    var config = jQuery.extend({}, defaults, options, slider.data("plugin-options"));
    slider.owlCarousel(config).addClass("owl-carousel-init");

    this.carouselInitialized = true;

  }

  private zoomInitialized = false;
  initZoom(){
    if (this.zoomInitialized) return;
    
		var _container = jQuery('figure.zoom');
    	
		if(_container.length > 0) {
      if(jQuery().zoom) {

        _container.each( function () {
						var _t 		= jQuery(this),
							_mode 	= _t.attr('data-mode'),
							_id		= _t.attr('id');

						if(_mode == 'grab') {
							_t.zoom({ on:'grab' });
						} else

						if(_mode == 'click') {
							_t.zoom({ on:'click' });
						} else

						if(_mode == 'toggle') {
							_t.zoom({ on:'toggle' });
						} else {
							_t.zoom();
            }
            
						// Thumbnails
						if(_id) {
							jQuery('.zoom-more[data-for='+_id+'] a').bind("click", function(e) {
								e.preventDefault();

								var _href = jQuery(this).attr('href');
								
								if(_href != "#") {
									jQuery('.zoom-more[data-for='+_id+'] a').removeClass('active');
									jQuery(this).addClass('active');

									jQuery('figure#'+_id + '>.lightbox').attr('href', _href);

									jQuery('figure#'+_id + '>img').fadeOut(480, function() {
										jQuery('figure#'+_id + '>img').attr('src', _href);
									}).fadeIn(500);
                }
              });
          }
        });
        this.zoomInitialized = true;
      }
    }
  }

  private toggleInitialized = false;
  initToggle(){
    if (this.toggleInitialized) return;
    

		var $_t = this,
			previewParClosedHeight = 25;

		jQuery("div.toggle.active > p").addClass("preview-active");
    jQuery("div.toggle.active > div.toggle-content").slideDown(400);
    // global "scripts.js" may have already registered click function. unregister first then register again. (bad! short term solution)
    jQuery("div.toggle > label").off("click");
		jQuery("div.toggle > label").click(function(e) {

			var parentSection 	= jQuery(this).parent(),
				parentWrapper 	= jQuery(this).parents("div.toggle"),
				previewPar 		,
				isAccordion 	= parentWrapper.hasClass("toggle-accordion");

			if(isAccordion && typeof(e.originalEvent) != "undefined") {
				parentWrapper.find("div.toggle.active > label").trigger("click");
			}

			parentSection.toggleClass("active");

			if(parentSection.find("> p").get(0)) {

				previewPar 					= parentSection.find("> p");
				var previewParCurrentHeight = previewPar.css("height");
				var previewParAnimateHeight = previewPar.css("height");
				previewPar.css("height", "auto");
				previewPar.css("height", previewParCurrentHeight);

			}

			var toggleContent = parentSection.find("> div.toggle-content");

			if(parentSection.hasClass("active")) {

				jQuery(previewPar).animate({height: previewParAnimateHeight}, 350, function() {jQuery(this).addClass("preview-active");});
				toggleContent.slideDown(350);

			} else {

				jQuery(previewPar).animate({height: previewParClosedHeight}, 350, function() {jQuery(this).removeClass("preview-active");});
				toggleContent.slideUp(350);

			}

    });
    
    this.toggleInitialized = true;
  }

  buildGallery (product: ProductDetail): imageUrl[]
  {
    var result = new Array<imageUrl>();

    product.imageUrls.forEach(imageUrl => result.push(imageUrl));

    return result;
  }

  buildListDescription(lookupList: LookupItem[]): string{
    var result = "";
    if (lookupList){
      lookupList.forEach(lookup => {
        result += result == "" ? lookup.description : ", " + lookup.description;
      })
    }
    return result;
  }

  getSquareFeetPerBox(product: ProductDetail): number{
    const squareFeetPerBoxLookup = product.squareFeetPerBox;
    if (squareFeetPerBoxLookup && squareFeetPerBoxLookup.attributes && squareFeetPerBoxLookup.attributes["squareFeetPerBox"]){
      const sqFt = Number(squareFeetPerBoxLookup.attributes["squareFeetPerBox"]);
      if (sqFt !== Number.NaN){
        return sqFt;
      }
    }
    return 0;
  }

  calChanged(){
    this.calculator.calculate();
  }


  // ------------ box calculation ------------
  calculator = new calculator();

  // ------------ emailing -------------
  email = new email();
  emailingStatus = emailingStatus.newMail;

  onSubmitEmail() {
    this.emailingStatus = emailingStatus.sending;
    var compiledSubject = `[inquery from Product Detail] from ${this.email.userName}`;;
    var compiledBody = `
!!! DO NOT REPLY DIRECTLY, USE THE USER'S ADDRESS BELOW TO REPLY. !!!
From: ${this.email.userName}
Address: ${this.email.userAddress}
Requested from page: ${window.location}
Regarding Product: ${this.product.collection.description} - ${this.product.name}
Regarding Product Number: ${this.product.productNumber}
Body:
${this.email.body}
    `;

    this.emailService.sendInqueryMail(this.email.userName, this.email.userAddress, compiledSubject, compiledBody)
      .subscribe(
        result =>{
          this.emailingStatus = emailingStatus.sent;
        },
        error => {
          console.error(error);
          this.emailingStatus = emailingStatus.failed;
        });
  }

  onCreateNewEmail()
  {
    this.email = new email();
    this.emailingStatus = emailingStatus.newMail;
  }

  onTrySendAgain()
  {
    this.emailingStatus = emailingStatus.newMail;
  }
}

class calculator {
  constructor () {}

  rooms = [new room()];
  
  addRoom(){
    this.rooms.push(new room());
    this.calculate();
  }
  removeRoom(i: number){
    this.rooms.splice(i, 1);    
    this.calculate();
  }

  private _wasteFactor: number = 10;
  set wasteFactor(wf: number) {
    this._wasteFactor = wf;
    this.calculate();
  }
  get wasteFactor(){
    return this._wasteFactor;
  }

  private _squareFeetPerBox: number;
  set squareFeetPerBox (sqFt: number){
    this._squareFeetPerBox = sqFt;
    this.calculate();
  }
  get squareFeetPerBox () {
    return this._squareFeetPerBox;
  }

  private _totalArea: number;
  get totalArea(): number {
    return this._totalArea;
  }

  private _totalWasted: number;
  get totalWasted (): number{
    return this._totalWasted;
  }

  private _numberOfBoxes: number;
  get numberOfBoxes(): number {
    return this._numberOfBoxes;
  }

  calculate (){
    const sqFtPerBox = !this._squareFeetPerBox ? 0 : this._squareFeetPerBox;
    const wasteFactor = !this._wasteFactor ? 0 : this._wasteFactor;
    if (sqFtPerBox === 0){
      this._totalArea = 0;
      this._totalWasted = 0;
      this._numberOfBoxes = 0;
      return;
    }
    if (wasteFactor === 0){
      this._totalArea = 0;
      this._totalWasted = 0;
      this._numberOfBoxes = 0;
      return;
    }
    if (!this.rooms || this.rooms.length === 0){
      this._totalArea = 0;
      this._totalWasted = 0;
      this._numberOfBoxes = 0;
      return;
    }

    var area: number = 0;
    this.rooms.forEach(room => {
      area += room.area();
    });
    
    area = Number(area.toFixed(2));
    const wasted = Number((area * wasteFactor / 100).toFixed(2));
    const totalRequired = area + wasted;
    const numOfBox = Math.ceil(totalRequired / sqFtPerBox);

    this._totalArea = area;
    this._totalWasted = wasted;
    this._numberOfBoxes = numOfBox;
  }
}

class room {
  constructor(){}
  lengthFeet: number;
  lengthInches: number;
  widthFeet: number;
  widthInches: number;
  area () : number{
    const lenghFeet = !this.lengthFeet ? 0 : this.lengthFeet;
    const lengthInches = !this.lengthInches ? 0 : this.lengthInches;
    const widthFeet = !this.widthFeet ? 0 : this.widthFeet;
    const widthInches = !this.widthInches ? 0 : this.widthInches;
    
    const length = lenghFeet + lengthInches * 0.083;
    const width = widthFeet + widthInches * 0.083;
    return length * width;
  }
} 
