import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LookupItem } from './lookup.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,) { }

  getProductInformationList (category, categoryValue, pageNumber, pageSize)
  : Observable<any>
  {
    
    let parameters = new HttpParams({
        fromObject: {
          category: category,
          categoryValue: categoryValue,
          pageNumber: pageNumber,
          pageSize: pageSize,
        }
      });
  
    return this.http.get<SearchProductResult>(this.baseUrl + 'api/Product/ListProductInformation',{params: parameters})
  }

  getProductDetail (id: string)
  : Observable<any>
  {
          
    let parameters = new HttpParams({
        fromObject: {
          id: id,}
      });
  
    return this.http.get<ProductDetail>(this.baseUrl + 'api/Product/LoadProduct',{params: parameters})
  
  }
}

export interface ProductInformation {
    id: string,
    name: string,
    description: string,
    productNumber: string,
    collection: Collection,
    titleImageThumbnailUrl: string,
    imageThumbnailUrls: string[],
    filterTags: string,
  }
  
export interface SearchProductResult{
    totalNumberOfProducts: number,
    currentPageNumber: number,
    pageSize: number,
    prodcutInformationList: ProductInformation[]
  }

export interface ProductDetail {
    id: string,
    name: string,
    description: string,
    productNumber: string,
    collection: Collection,
    color: Color,
    styles: LookupItem[],
    structure: LookupItem,
    species: LookupItem,
    width: LookupItem,
    thickness: LookupItem,
    coreThickness: LookupItem,
    ixpeBackingThickness: LookupItem,
    grade: LookupItem,
    wearLayer: LookupItem,
    length: LookupItem,
    hardness: LookupItem,
    colorVariation: LookupItem,
    finish: LookupItem,
    cartonsPerPallet: LookupItem,
    lbs: LookupItem,
    edgeTypes: LookupItem[],
    squareFeetPerBox: LookupItem,
    treatments: LookupItem[],
    installationTypes: LookupItem[],
    clickType: LookupItem,
    impactInsulationClass: LookupItem,
    impactSoundConductionType: LookupItem,
    airborneSoundConductionType: LookupItem,
    warranties: LookupItem[],
    instructionsUrl: string,

    isNew: boolean,
    discontinued: boolean,
    imageUrls: imageUrl[],
    }
  export interface ProductSummary{
    id: string,
    name: string,
  }
  
  export interface Collection {
    id: number,
    name: string,
    description: string,
    detailDescription: string,
    orderNumber: number,
    imageUrls: imageUrl[],
  }
  export interface Color {
    id: number,
    name: string,
    description: string,
    orderNumber: number,
    imageUrls: imageUrl[],
  }

  export interface imageUrl {
    url: string,
    thumbnailUrl: string,
    isPortrait: boolean,
  }
  