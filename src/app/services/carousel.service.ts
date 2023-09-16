import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { InterfaceToClass } from '../shared/helpers/class-helper';
import * as _ from 'lodash';
import * as semver from 'semver';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,) { }

    // todo: (high) uncomment
    getTopCarouselList () : Observable<any> {
      return this.http.get<ITopCarouselItem[]>(this.baseUrl + 'api/TopCarousel/GetTopCarouselItems');
    }

    // todo: (high) remove
    // getTopCarouselList () : Observable<any> {
    //   var list: ITopCarouselItem[] = [{
    //       id: "abcde",
    //       name: "some floor",
    //       imageUrl: "/Data/Gallery/SPC810_AL.jpg",
    //       imageThumbnailUrl: "/Data/Gallery/SPC810_AL_thumbnail.png",
    //       title: "Deep Sea Collection",
    //       description: "High tech designed and manufactured Stone Plastic Composite floors, featuring perfect colors and patterns, durability, 100% waterproof, and easy of installation.",
    //       textLocation: 'botton-left',
    //       textDarkOrLight: "light", // possible: dark light
    //       links: [
    //         {
    //           id: "defg",
    //           name: "some floor",
    //           title: "some floor",
    //           type: 0,
    //         }
    //       ],
    //       textOptBundleSets: [
    //         TextOptBundleSet.CreateDefault('bottom-left', 3),
    //         new TextOptBundleSet(
    //           'ios-safari', 
    //           new TextOptBundleSetApplyTo(false, 'ios', 'safari', null), 
    //           new TextOptBundle().simpleSetValues('bottom-left', 3), 
    //           new TextOptBundle().simpleSetValues('bottom-left', 4).adjustForPortrait()),
    //       ],
    //     },
    //   ];
    //   return of<ITopCarouselItem[]>(list);
    // }
  }

export interface ITopCarouselItem {
  id: string;
  name: string;
  imageUrl: string;
  imageThumbnailUrl: string;
  title: string;
  description: string;
  textLocation: string; // possible: top-left top top-right center-left center center-right bottom-left bottom bottom-right
  textDarkOrLight: string; // possible: dark light
  links: ITopCarouselLink[];
  textOptBundleSets: ITextOptBundleSet[];
}

export class TopCarouselItem implements ITopCarouselItem {
  id: string;
  name: string;
  imageUrl: string;
  imageThumbnailUrl: string;
  title: string;
  description: string;
  textLocation: string; // possible: top-left top top-right center-left center center-right bottom-left bottom bottom-right
  textDarkOrLight: string; // possible: dark light
  links: TopCarouselLink[];
  textOptBundleSets: TextOptBundleSet[];
}

export class TopCarouselSlide {
  constructor (private topCarouselItem: ITopCarouselItem){
    this.regulateSlideOpt();
  }

  private _os: string;
  private _browser: string;
  private _browserVersion: string;
  private _bundleSets: TextOptBundleSet[] = [];

  setBrowser(os: string, browser: string, browserVersion: string) {
    this._os = os;
    this._browser = browser;
    this._browserVersion = browserVersion;
    this.setEffectiveTextOptBundleSet();
  }

  private _orientation: string;
  setOrientation(orientation: string) {
    this._orientation = orientation;
    this.setEffectiveTextOptBundleSet();
  }

  private regulateSlideOpt () {
    // for bundle set, if portrait is not provided, set it to be the same as landscape
    // also, append text css classes
    this.topCarouselItem.textOptBundleSets.forEach((iBundleSet) => {
      var iName = iBundleSet.name;
      var iAppliesTo = iBundleSet.appliesTo; //InterfaceToClass<ITextOptBundleSetApplyTo, TextOptBundleSetApplyTo>(iBundleSet.appliesTo);
      var iLandscapeTextOptBundle = iBundleSet.landscapeTextOptBundle;
      var iPortraitTextOptBundle = iBundleSet.portraitTextOptBundle ?? _.cloneDeep(iLandscapeTextOptBundle);

      var bundleSet = new TextOptBundleSet();

      bundleSet.name = iName;
      bundleSet.appliesTo = InterfaceToClass(iAppliesTo, TextOptBundleSetApplyTo);

      bundleSet.landscapeTextOptBundle = InterfaceToClass(iLandscapeTextOptBundle, TextOptBundle);
      bundleSet.landscapeTextOptBundle.titleTextOpt = InterfaceToClass(iLandscapeTextOptBundle.titleTextOpt, TextOpt);
      bundleSet.landscapeTextOptBundle.descriptionTextOpt = InterfaceToClass(iLandscapeTextOptBundle.descriptionTextOpt, TextOpt);
      bundleSet.landscapeTextOptBundle.linksTextOpt = InterfaceToClass(iLandscapeTextOptBundle.linksTextOpt, TextOpt);

      bundleSet.portraitTextOptBundle = InterfaceToClass(iPortraitTextOptBundle, TextOptBundle);
      bundleSet.portraitTextOptBundle.titleTextOpt = InterfaceToClass(iPortraitTextOptBundle.titleTextOpt, TextOpt);
      bundleSet.portraitTextOptBundle.descriptionTextOpt = InterfaceToClass(iPortraitTextOptBundle.descriptionTextOpt, TextOpt);
      bundleSet.portraitTextOptBundle.linksTextOpt = InterfaceToClass(iPortraitTextOptBundle.linksTextOpt, TextOpt);
      if(! iBundleSet.portraitTextOptBundle) {
        bundleSet.portraitTextOptBundle.adjustForPortrait();
      }
      
      this.setTextColor(this.textDarkOrLight, bundleSet.landscapeTextOptBundle);
      this.setTextColor(this.textDarkOrLight, bundleSet.portraitTextOptBundle);

      this._bundleSets.push(bundleSet);
    });
  }

  private setTextColor(textDarkOrLight: string, bundle: TextOptBundle){
    switch(textDarkOrLight) {
      case 'light':
        bundle.titleTextOpt?.setMoreClasses({'large_bold_white': true});
        bundle.descriptionTextOpt?.setMoreClasses({'medium_light_white': true});
        bundle.linksTextOpt?.setMoreClasses({'small_light_white': true});
        break;
      case 'dark':
        bundle.titleTextOpt?.setMoreClasses({'large_bold_grey': true});
        bundle.descriptionTextOpt?.setMoreClasses({'medium_light_grey': true});
        bundle.linksTextOpt?.setMoreClasses({'small_light_grey': true});
        break;
    }
  }

  get effectiveTextOptBundleSet(): TextOptBundleSet {
    return this._effectiveTextOptBundleSet;
  }
  private _effectiveTextOptBundleSet: TextOptBundleSet;
  private setEffectiveTextOptBundleSet() {
    var highestLevel = -1;
    this._bundleSets.forEach(bundleSet => {
      var matchedLevel = (bundleSet.appliesTo as TextOptBundleSetApplyTo).matchLevel(this._os, this._browser, this._browserVersion);
      if (highestLevel < matchedLevel) {
        highestLevel = matchedLevel;
        this._effectiveTextOptBundleSet = bundleSet;
      }
    });
  }

  get id(): string {
    return this.topCarouselItem?.id;
  }
  get name(): string {
    return this.topCarouselItem?.name;
  }
  get imageUrl(): string {
    return this.topCarouselItem?.imageUrl;
  }
  get imageThumbnailUrl(): string {
    return this.topCarouselItem?.imageThumbnailUrl;
  }
  get title(): string {
    return this.topCarouselItem?.title;
  }
  get description(): string {
    return this.topCarouselItem?.description;
  }
  get textLocation(): string {
    return this.topCarouselItem?.textLocation;
  }
  get textDarkOrLight(): string {
    return this.topCarouselItem?.textDarkOrLight;
  }
  get links(): any[] {
    // todo: (low) for performance, make a private local field to store links, build the links in constructor
    var links = [];
    this.topCarouselItem?.links.forEach(item => {
      if (item.type === 0) {
        // product link
        links.push({
          name: item.name,
          title: item.title,
          url: '/product?id=' + item.id,
        })
      }
    });
    return links;
  }

  get titleTextOpt(): ITextOpt {
    var landscape = this._effectiveTextOptBundleSet?.landscapeTextOptBundle?.titleTextOpt;
    var portrait = this._effectiveTextOptBundleSet?.portraitTextOptBundle?.titleTextOpt;
    return this._orientation === 'portrait'? portrait : landscape;
  }
  get descriptionTextOpt(): ITextOpt {
    var landscape = this._effectiveTextOptBundleSet?.landscapeTextOptBundle?.descriptionTextOpt;
    var portrait = this._effectiveTextOptBundleSet?.portraitTextOptBundle?.descriptionTextOpt;
    return this._orientation === 'portrait'? portrait : landscape;
  }
  get linksTextOpt(): ITextOpt {
    var landscape = this._effectiveTextOptBundleSet?.landscapeTextOptBundle?.linksTextOpt;
    var portrait = this._effectiveTextOptBundleSet?.portraitTextOptBundle?.linksTextOpt;
    return this._orientation === 'portrait'? portrait : landscape;
  }
}


export interface ITopCarouselLink {
  id: string;
  name: string;
  title: string;
  type: number;
}
export class TopCarouselLink implements ITopCarouselLink {
  constructor (public id: string, public name: string, public title: string, public type: number){}
}

export interface ITextOptBundleSet {
  name: string;
  appliesTo: ITextOptBundleSetApplyTo;
  landscapeTextOptBundle: ITextOptBundle;
  portraitTextOptBundle: ITextOptBundle;
}
export class TextOptBundleSet implements ITextOptBundleSet {
  name: string;
  appliesTo: TextOptBundleSetApplyTo;
  landscapeTextOptBundle: TextOptBundle;
  portraitTextOptBundle: TextOptBundle;
  
  static CreateDefault(textLocation: string, linesOfDescription: number): TextOptBundleSet  {
    var result = new TextOptBundleSet();
    result.name ='default';
    result.appliesTo = InterfaceToClass({isDefault: true, os: null, browser: null, browserVersion: null}, TextOptBundleSetApplyTo);
    result.landscapeTextOptBundle = new TextOptBundle().simpleSetValues(textLocation, linesOfDescription);
    result.portraitTextOptBundle = new TextOptBundle().simpleSetValues(textLocation, linesOfDescription).adjustForPortrait();
    return result;  
  }
  // todo: add methods for matching browsers
}

/* ***************************************
Rules for matching if the text option bundle set applies to a browser.
* "default", when an unknow browser, or other options are not set, use the "default" option bundle
* first, match the operating system, "os", possible: "desktop", "android", "ios"
* second, match the browser type, "browser", possible: "default", "chrome", "firefox", "safari"
* next, match the browser version, "browserVersion", possible: all, 1.0, 2.0.1, <= 2.2.3, 5.0.0 - 7.2.3, 1.0 || >= 2.5.0 || 5 - 8
*************************************** */
export interface ITextOptBundleSetApplyTo {
  isDefault: boolean;
  os: string;
  browser: string;
  browserVersion: string;
}
export class TextOptBundleSetApplyTo implements ITextOptBundleSetApplyTo {
  isDefault: boolean;
  os: string;
  browser: string;
  browserVersion: string;

  // 0 - not match
  // the higher the match level is, the better the match is
  // general match, such as "default", "all", is 1 level
  // exact match, such as "chrome", "firefox", or specified version, add 2 levels
  // OS -> Browser -> Browser Version
  // if defines OS, and testing OS isn't matching to the defined OS, it's not a match (level = 0)
  // browser definitions must have OS definition (can't define browser without OS). 
  // 
  matchLevel(os: string, browser: string, browserVersion: string): number {
    var level = 0;

    // if the bundle config is default, add up match level
    if (this.isDefault) {
      level++;
    }

    // os is not defined, it's a generic match (defined for all os)
    if (!this.os) {
      level++;
    } else if (this.os.toLowerCase() !== os?.toLowerCase()) {
      // os is defined, but not matching the testing os, it's not a match
      level = 0;
    } else {
      // os is defined, and matches the testing os, it's a specified match
      level += 2;
      
      // continue to verify browser and/or browser version
      // browser is not defined, it's a generic match (all browsers on that OS)
      if (!this.browser) {
        level++;
      } else if (this.browser.toLowerCase() !== browser?.toLowerCase()) {
        // browser is defined, but not matching the testing browser, it's not a match
        level = 0;
      } else {
        // browser is defined, and matches the testing browser, it's a specified match
        level += 2;

        // continue to verify browser version
        // browser version is not defined, it's a generic match (all versions for that os + browser)
        if (!this.browserVersion) {
          level++;
        } else if (!semver.satisfies(semver.coerce(browserVersion), this.browserVersion)) {
          // browser version is defined, but doesn't match (satisfy) the testing browser version, it's not a match
          level = 0;
        } else {
          // browser version is defined, and it matches (satisfies) the teseting browser version, it's a specific match
          level += 2;
        }
      }
    }
    
    return level;
  }
}

export interface ITextOptBundle {
  titleTextOpt: ITextOpt;
  descriptionTextOpt: ITextOpt;
  linksTextOpt: ITextOpt;
}

export class TextOptBundle implements ITextOptBundle {
  titleTextOpt: TextOpt;
  descriptionTextOpt: TextOpt;
  linksTextOpt: TextOpt;

  simpleSetValues(textLocation: string, linesOfDescription: number): TextOptBundle {
    switch(textLocation.toLowerCase()){
      case 'center':
        this.titleTextOpt = InterfaceToClass({dataX: 'center', dataY: 'center', hOffset: null, vOffset: -50, classes: {}}, TextOpt);
        this.descriptionTextOpt = InterfaceToClass({dataX: 'center', dataY: 'center', hOffset: null, vOffset: 50, classes: {}}, TextOpt);
        this.linksTextOpt = InterfaceToClass({dataX: 'right', dataY: 'bottom', hOffset: -50, vOffset: -50, classes: {}}, TextOpt);
        break;
      case 'top-left':
        this.titleTextOpt = InterfaceToClass({dataX: 'left', dataY: 'top', hOffset: 50, vOffset: 80, classes: {'text-left': true}}, TextOpt);
        this.descriptionTextOpt = InterfaceToClass({dataX: 'left', dataY: 'top', hOffset: 50, vOffset: 220, classes: {'text-left': true}}, TextOpt);
        this.linksTextOpt = InterfaceToClass({dataX: 'right', dataY: 'bottom', hOffset: -50, vOffset: -50, classes: {}}, TextOpt);
        break;
      case 'center-left':
        this.titleTextOpt = InterfaceToClass({dataX: 'left', dataY: 'center', hOffset: 50, vOffset: -50, classes: {'text-left': true}}, TextOpt);
        this.descriptionTextOpt = InterfaceToClass({dataX: 'left', dataY: 'center', hOffset: 50, vOffset: 50, classes: {'text-left': true}}, TextOpt);
        this.linksTextOpt = InterfaceToClass({dataX: 'right', dataY: 'bottom', hOffset: -50, vOffset: -50, classes: {}}, TextOpt);
        break;
      case 'bottom-left':
        this.titleTextOpt = InterfaceToClass({dataX: 'left', dataY: 'bottom', hOffset: 50, vOffset: -160 - (linesOfDescription - 1) * 40, classes: {'text-left': true}}, TextOpt);
        this.descriptionTextOpt = InterfaceToClass({dataX: 'left', dataY: 'bottom', hOffset: 50, vOffset: -120, classes: {'text-left': true}}, TextOpt);
        this.linksTextOpt = InterfaceToClass({dataX: 'right', dataY: 'bottom', hOffset: -50, vOffset: -50, classes: {}}, TextOpt);
        break;
      case 'top':
        this.titleTextOpt = InterfaceToClass({dataX: 'center', dataY: 'top', hOffset: null, vOffset: 120, classes: {}}, TextOpt);
        this.descriptionTextOpt = InterfaceToClass({dataX: 'center', dataY: 'top', hOffset: null, vOffset: 250, classes: {}}, TextOpt);
        this.linksTextOpt = InterfaceToClass({dataX: 'right', dataY: 'bottom', hOffset: -50, vOffset: -50, classes: {}}, TextOpt);
        break;
      case 'bottom':
        this.titleTextOpt = InterfaceToClass({dataX: 'center', dataY: 'bottom', hOffset: null, vOffset: -160 - (linesOfDescription - 1) * 40, classes: {}}, TextOpt);
        this.descriptionTextOpt = InterfaceToClass({dataX: 'center', dataY: 'bottom', hOffset: null, vOffset: -120, classes: {}}, TextOpt);
        this.linksTextOpt = InterfaceToClass({dataX: 'right', dataY: 'bottom', hOffset: -50, vOffset: -50, classes: {}}, TextOpt);
        break;
      case 'top-right':
        this.titleTextOpt = InterfaceToClass({dataX: 'right', dataY: 'top', hOffset: -50, vOffset: 80, classes: {'text-righ': true}}, TextOpt);
        this.descriptionTextOpt = InterfaceToClass({dataX: 'right', dataY: 'top', hOffset: -50, vOffset: 220, classes: {'text-right': true}}, TextOpt);
        this.linksTextOpt = InterfaceToClass({dataX: 'right', dataY: 'bottom', hOffset: -50, vOffset: -50, classes: {}}, TextOpt);
        break;
      case 'center-right':
        this.titleTextOpt = InterfaceToClass({dataX: 'right', dataY: 'center', hOffset: -50, vOffset: -50, classes: {'text-right': true}}, TextOpt);
        this.descriptionTextOpt = InterfaceToClass({dataX: 'right', dataY: 'center', hOffset: -50, vOffset: 50, classes: {'text-right': true}}, TextOpt);
        this.linksTextOpt = InterfaceToClass({dataX: 'right', dataY: 'bottom', hOffset: -50, vOffset: -50, classes: {}}, TextOpt);
        break;
      default:
          throw new Error('not supported textlocation: ' + textLocation);
      }
      return this;
  }

  adjustForPortrait(): TextOptBundle {
    this.titleTextOpt?.adjustForPortrait();
    this.descriptionTextOpt?.adjustForPortrait();
    this.linksTextOpt?.adjustForPortrait();
    return this;
  }
}

export interface ITextOpt {
  dataX: string;
  dataY: string;
  hOffset: number;
  vOffset: number;
  classes: {};
}

export class TextOpt implements ITextOpt{
  dataX: string;
  dataY: string;
  hOffset: number;
  vOffset: number;
  classes: {};

  setDataX(dataX: string) {
    this.dataX = dataX;
  }
  setDataY(dataY: string) {
    this.dataY = dataY;
  }
  setDataHOffset(hOffset: number) {
    this.hOffset = hOffset;
  }
  setVOffset(vOffset: number) {
    this.vOffset = vOffset;
  }
  setMoreClasses (moreClasses: {}){
    this.classes = this.classes ?? {};
     Object.assign(this.classes, this.classes, moreClasses);
  }

  private portraitBottomExtraVOffset: number = 400;
  private portraitTopExtraVOffset: number = -400;
  adjustForPortrait() {
    if (this.dataY?.toLowerCase().indexOf('bottom') >= 0) {
      this.vOffset += this.portraitBottomExtraVOffset;
    }
    if (this.dataY?.toLowerCase().indexOf('top') >= 0) {
      this.vOffset += this.portraitTopExtraVOffset;
    }
  }
}
