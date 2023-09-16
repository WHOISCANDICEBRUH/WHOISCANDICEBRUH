import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { DeviceDetectorModule } from 'ngx-device-detector';

import { SharedModule } from '../app/shared/shared.module';

import { FooterComponent, NavbarComponent, ActiveMenuDirective, ErrorComponent } from './layouts';
import { HomeComponent } from './home/home.component';
import { CaringComponent } from './caring/caring.component';
import { SupportComponent } from './support/support.component';
import { ProductComponent } from './product/product.component';
import { ProductSearchComponent } from './product-search/product-search.component';
import { JobsComponent } from './jobs/jobs.component';

declare var $: any;

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent, NavbarComponent, ActiveMenuDirective, ErrorComponent, CaringComponent, SupportComponent, ProductComponent, ProductSearchComponent, JobsComponent, 
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    HomeModule,
    SharedModule,
    DeviceDetectorModule,
    RouterModule.forRoot([
    { path: 'jobs', component: JobsComponent },
    { path: 'caring', component: CaringComponent },
    { path: 'support', component: SupportComponent },
    { path: 'product', component: ProductComponent },
    { path: 'product-search', component: ProductSearchComponent },
    { path: 'gallery', component: HomeComponent, data: { scrollTo: 'gallery' } },
    { path: '', component: HomeComponent, pathMatch: 'full' },
], { relativeLinkResolution: 'legacy' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
