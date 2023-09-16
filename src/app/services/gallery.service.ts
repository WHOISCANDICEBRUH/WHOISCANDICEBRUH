import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LookupItem } from './lookup.service';
import { imageUrl, ProductSummary } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,) { }

  getGalleryItemSummaryDtoList (categoryId, pageNumber, pageSize)
  : Observable<any>
  {
    
    let parameters = new HttpParams({
        fromObject: {
          categoryId: categoryId,
          pageNumber: pageNumber,
          pageSize: pageSize,
        }
      });
  
    return this.http.get<SearchGalleryItemResult>(this.baseUrl + 'api/Gallery/ListGalleryItem',{params: parameters})
  }
}

export interface GalleryItemSummaryDto {
    id: string,
    name: string,
    description: string,
    disabled: boolean,
    image: imageUrl,
    productSummaryList: ProductSummary[],
    categoryList: LookupItem[],
    filterTags: string,
  }
  
export interface SearchGalleryItemResult{
    totalNumberOfProducts: number,
    currentPageNumber: number,
    pageSize: number,
    galleryItemSummaryDtoList: GalleryItemSummaryDto[]
}
  