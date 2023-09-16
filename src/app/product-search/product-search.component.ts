import { Component, OnInit, Inject, ComponentFactoryResolver, Injector} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ProductService, SearchProductResult } from '../services/product.service';
import { LookupService, MenuItem } from '../services/lookup.service';

declare var mixitup: any;
declare var $: any;

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styles: []
})
export class ProductSearchComponent implements OnInit {

  // todo: move these data into database
  public searchProductResult: SearchProductResult;
  public searchMenuItems : MenuItem[] = [];

  private http : HttpClient;
  private baseUrl : string;
  private _$: any;
  private _mixitup: any;


  mixer: any;
  mixerInitialized = false;
  mixerItemTemplate: string;

  selectedCategory: string;
  selectedCategoryValue: any;
  currentPageNumber: number;
  pageSize: number;
  pageNumbers: number[];
  
  constructor(
    http: HttpClient, 
    @Inject('BASE_URL') baseUrl: string,
    private productService: ProductService,
    private lookupService: LookupService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.http = http;
    this.baseUrl = baseUrl;

    this.selectedCategory = "";
    this.selectedCategoryValue = 0;
    this.currentPageNumber = 1;
    this.pageSize = 8;

    this.GetSearchCategories();

    // proxy object to jQuery and other javascript components.
    this._$ = $;
    this._mixitup = mixitup;
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(result => {
      this.selectedCategory = result.has('categoryName') ? result.get('categoryName') : "";
      this.selectedCategoryValue = result.has('categoryValue') ? result.get('categoryValue') : "";
      this.currentPageNumber = result.has('page') ? Number(result.get('page')) : 1;
      this.LoadProductInformationList (this.selectedCategory, this.selectedCategoryValue, this.currentPageNumber, this.pageSize);
    });
  }

  rendered (){
    return (document.getElementById('productSearchLastItem')) ? true : false;
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
    if (!this.searchProductResult) return;

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
      render: {
        target: function(item) {
          return `
          <div class="col-md-3 col-sm-3 ${item.filterTags}">
        <div class="item-box">
          <figure>
            <span class="item-hover">
              <span class="overlay dark-5"></span>
              <span class="inner">
                <!-- details -->
                <a class="ico-rounded" href="product?id=${item.id}">
                  <span class="glyphicon glyphicon-option-horizontal fs-20"></span>
                </a>
              </span>
            </span>
            <img class="img-fluid" src="${item.titleImageThumbnailUrl}" width="600" height="260" alt="">
          </figure>
          <div class="item-box-desc">
            <h3><a href="product?id=${item.id}">${item.name}</a></h3>
            <ul class="list-inline categories m-0">
              <li>${item.collection.name}</li>
            </ul>
          </div>
        </div>
      </div>
          `;
        }
      }
    });
    this.mixer.dataset(this.searchProductResult.prodcutInformationList);
    this._$("ul.mix-filter a").bind("click", function(e) {
        e.preventDefault();
      });
    this.mixerInitialized = true;
  }

  private GetSearchCategories = () => {
    this.lookupService.GetSearchCategories()
      .subscribe(result => {
        this.searchMenuItems = result;
      },
      error => console.error(error));
  }

  onFilterClick(category, categoryValue)
  {
    this.LoadProductInformationList(category, categoryValue, 1, this.pageSize);
  }

  private LoadProductInformationList = (category, categoryValue, pageNumber, pageSize) => {

    this.router.navigateByUrl(`/product-search?categoryName=${category}&categoryValue=${categoryValue}&page=${pageNumber}`);

    this.productService.getProductInformationList(category, categoryValue, pageNumber, pageSize)
      .subscribe(result => {
        this.searchProductResult = result;
        this.mixerInitialized && this.getMixer().dataset(this.searchProductResult.prodcutInformationList);
        this.pageNumbers = this.getPageNumbers (this.searchProductResult.totalNumberOfProducts, this.searchProductResult.pageSize);
        this.currentPageNumber = this.searchProductResult.currentPageNumber;
        this.selectedCategory = category;
        this.selectedCategoryValue = categoryValue;
    }, error => console.error(error));
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
    this.LoadProductInformationList (this.selectedCategory, this.selectedCategoryValue, pageNumber, this.pageSize);
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
