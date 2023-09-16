import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class LookupService {

constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,) { }

    GetSearchCategories () : Observable<any> {
      return this.http.get<MenuItem[]>(this.baseUrl + 'api/Lookup/GetSearchMenus')
    }
    GetGallerySearchCategories () : Observable<any> {
      return this.http.get<MenuItem[]>(this.baseUrl + 'api/Lookup/GetGallerySearchMenus')
    }
}

export interface MenuItem {
    id: number,
    name: string,
    description: string,
    subMenuItems: MenuItem[],
    filterTag: string
  }
  
export interface LookupItem {
    id: number,
    category: string,
    name: string,
    description: string,
    orderNumber: number,
    attributes: keyValuePair[],
  }
  
export interface keyValuePair {
    [key: string]: string,
  }
