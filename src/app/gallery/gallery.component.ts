import { Component, OnInit, Inject, ComponentFactoryResolver, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GalleryService, SearchGalleryItemResult } from '../services/gallery.service';
import { LookupService, MenuItem } from '../services/lookup.service';

declare var mixitup: any;
declare var $: any;
declare var _lightbox: any;

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  public searchGalleryItemResult: SearchGalleryItemResult;
  public searchMenuItems : MenuItem[] = [];

  private http : HttpClient;
  private baseUrl : string;
  private _$: any;
  private _mixitup: any;

  mixer: any;
  mixerInitialized = false;
  mixerItemTemplate: string;

  selectedCategoryId: string;
  currentPageNumber: number;
  pageSize: number;
  pageNumbers: number[];
  
  constructor(
    http: HttpClient, 
    @Inject('BASE_URL') baseUrl: string,
    private galleryService: GalleryService,
    private lookupService: LookupService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
  ) {
    this.http = http;
    this.baseUrl = baseUrl;

    this.selectedCategoryId = "";
    this.currentPageNumber = 1;
    this.pageSize = 8;

    this.GetSearchCategories();
    this.LoadGalleryItemSummaryDtoList (this.selectedCategoryId, this.currentPageNumber, this.pageSize);

    // proxy object to jQuery and other javascript components.
    this._$ = $;
    this._mixitup = mixitup;
  }

  ngOnInit() {
  }
  
  rendered (){
    return (document.getElementById('gallerySearchLastItem')) ? true : false;
  }

  ngAfterViewChecked(){
    if (this._$('.markLastMenuItem').length > 0) {
      this.initMixer();
    }
  }

  getMixer()
  {
    if (!this.mixerInitialized) this.initMixer();
    return this.mixer;
  }

  initMixer()
  {
    if (this.mixerInitialized) return;
    if (!this.searchGalleryItemResult) return;

    // Can not use the Angular Dynamic Component way for the mixer render
    // because the Dynamic Component requires using of compnentResolveFactory
    // and use of "this" keyword in it. When mixer calls "render" function
    // the "this" can't be resolved correctly.
    // We have to use dynamic component to generate the template string first, 
    // then make use of this string for the mixer render
    this.mixer = this._mixitup ('.mix-grid', {
      controls: {
        enable: false
      },
      data: {
        uidKey: 'id'
      },
      // todo: check the render. 1. should we add "mix" to the outter most div's class?
      render: {
        target: function(item) {
          return `<div class="col-md-3 col-sm-3 mix ${item.filterTags}">
          <div class="item-box">
            <figure>
              <span class="item-hover">
                <span class="overlay dark-5"></span>
                <span class="inner">
                  <!-- details -->
                  <a class="lightbox ico-rounded" href="${item.image.url}"  data-plugin-options='{"type":"image"}'>
                    <i class="fa fa-search"></i>
                  </a>
                </span>
              </span>
              <img class="img-fluid" src="${item.image.thumbnailUrl}" width="600" height="399" alt="">
            </figure>
            <div class="item-box-desc">
              ${item.productSummaryList.map((productSummary, i) => `
              <h3><a href="product?id=${productSummary.id}">${productSummary.name}</a></h3>
              `).join("")}
              <ul class="list-inline categories m-0">
                ${item.categoryList.map((categoryLookup, i) =>`
                <li>${categoryLookup.description}</li>`).join('')}                
              </ul>
            </div>
          </div>
        </div>`;
        }
      }
    });
    this.mixerInitialized = true;
    this.refreshMixItUp(this.searchGalleryItemResult.galleryItemSummaryDtoList);
  }

  private GetSearchCategories = () => {
    this.lookupService.GetGallerySearchCategories()
      .subscribe(result => {
        this.searchMenuItems = result;
      },
      error => console.error(error));
  }

  onFilterClick(categoryId)
  {
    this.LoadGalleryItemSummaryDtoList(categoryId, 1, this.pageSize);
  }

  private LoadGalleryItemSummaryDtoList = (categoryId, pageNumber, pageSize) => {

    this.galleryService.getGalleryItemSummaryDtoList(categoryId, pageNumber, pageSize)
      .subscribe(result => {
        this.searchGalleryItemResult = result;
        this.refreshMixItUp(this.searchGalleryItemResult.galleryItemSummaryDtoList);
        this.pageNumbers = this.getPageNumbers (this.searchGalleryItemResult.totalNumberOfProducts, this.searchGalleryItemResult.pageSize);
        this.currentPageNumber = this.searchGalleryItemResult.currentPageNumber;
        this.selectedCategoryId = categoryId;
    }, error => console.error(error));
  }

  refreshMixItUp(galleryItemSummaryDtoList){
    if (!this.mixerInitialized) return;
    this.getMixer().dataset(galleryItemSummaryDtoList);
    _lightbox();
  }

  previousPage(){
    this.currentPageNumber > 1 && 
    this.goToPage(this.currentPageNumber - 1);   
  }

  nextPage(){
    this.currentPageNumber < this.pageNumbers[this.pageNumbers.length-1] &&
    this.goToPage(this.currentPageNumber + 1);
  }

  goToPage(pageNumber){
    this.LoadGalleryItemSummaryDtoList (this.selectedCategoryId, pageNumber, this.pageSize);
  }

  getPageNumbers(totalNumber: number, pageSize: number): number[]
  {
    var result = [];
    for (var i = 1; i <= Math.ceil(totalNumber/pageSize); i++){
      result.push(i);
    }
    return result;
  }
}
