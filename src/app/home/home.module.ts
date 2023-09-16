import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { TopCarouselComponent } from './top-carousel/top-carousel.component';
import { WhatsNewComponent } from './whats-new/whats-new.component';
import { GalleryComponent } from '../gallery/gallery.component';

import { SharedModule } from '../shared/shared.module';

declare var $: any;

@NgModule({
    declarations: [
        HomeComponent,
        TopCarouselComponent, 
        WhatsNewComponent,
        GalleryComponent,
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    entryComponents: [
        GalleryComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeModule {}
