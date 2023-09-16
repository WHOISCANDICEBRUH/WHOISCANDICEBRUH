import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CarouselService, TextOptBundleSetApplyTo, TextOptBundleSet, TextOptBundle, TopCarouselItem, TopCarouselSlide } from './carousel.service';
import { IterableDiffers } from '@angular/core';

describe('CarouselService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [{ provide: 'BASE_URL', useFactory: () => {return ''}, deps: [] }],
  }));

  it('should be created', () => {
    const service: CarouselService = TestBed.get(CarouselService);
    expect(service).toBeTruthy();
  });
});

describe('TextOptBundleSetApplyTo', () => {
  const defaultApplyTo = new TextOptBundleSetApplyTo(true, null, null, null);
  const applyToIosAllBrowsers = new TextOptBundleSetApplyTo(false, 'ios', null, null);
  const applyToIosSafariAllVersions = new TextOptBundleSetApplyTo(false, 'ios', 'safari', null);
  const applyToIosSafariBefore11 = new TextOptBundleSetApplyTo(false, 'ios', 'safari', '<=11.x');
  const applyToIosSafariV12 = new TextOptBundleSetApplyTo(false, 'ios', 'safari', '12.x');

  it('default applyTo matches everything', () => {
    expect(defaultApplyTo.matchLevel('windows', 'chrome', null)).toBeGreaterThan(0);
    expect(defaultApplyTo.matchLevel('ios', 'chrome', null)).toBeGreaterThan(0);
    expect(defaultApplyTo.matchLevel('android', 'chrome', null)).toBeGreaterThan(0);
  });

  it('matches to ios all browsers', () => {
    expect(applyToIosAllBrowsers.matchLevel('ios', 'chrome', '11')).toBeGreaterThan(0);
  });

  it('applyTo iOS bundle doesn\'t match to other OSes', () => {
    expect(applyToIosAllBrowsers.matchLevel('windows', 'chrome', '11')).toBeLessThanOrEqual(0);
  });

  it('matches to ios safari\'s all versions', () => {
    expect(applyToIosSafariAllVersions.matchLevel('ios', 'safari', '11')).toBeGreaterThan(0);
  });

  it('matches to ios safari\'s specified range of versions', () => {
    expect(applyToIosSafariBefore11.matchLevel('ios', 'safari', '10')).toBeGreaterThan(0);
    expect(applyToIosSafariBefore11.matchLevel('ios', 'safari', '11')).toBeGreaterThan(0);
  });

  it('matches to ios safari\'s specified version is better than only ios safari match', () => {
    var lessSpecificMatchLevel = applyToIosSafariAllVersions.matchLevel('ios', 'safari', '12');
    var moreSpecificMatchLevel = applyToIosSafariV12.matchLevel('ios', 'safari', '12');

    console.log(`less specific match level: ${lessSpecificMatchLevel}, more specific match level: ${moreSpecificMatchLevel}.`);
    expect(lessSpecificMatchLevel).toBeGreaterThan(0);
    expect(moreSpecificMatchLevel).toBeGreaterThan(0);
    expect(lessSpecificMatchLevel < moreSpecificMatchLevel).toBeTruthy();
  });  
});

describe('TopCarouselSlide', () => {
  const topCarousleItemDefiningDefaultAndIos12TextOpt: TopCarouselItem = {    
    id: "abcde",
    name: "some floor",
    imageUrl: "/Data/Gallery/SPC810_AL.jpg",
    imageThumbnailUrl: "/Data/Gallery/SPC810_AL_thumbnail.png",
    title: "Deep Sea Collection",
    description: "High tech designed and manufactured Stone Plastic Composite floors, featuring perfect colors and patterns, durability, 100% waterproof, and easy of installation.",
    textLocation: 'botton-left',
    textDarkOrLight: "light", // possible: dark light
    links: [
      {
        id: "defg",
        name: "some floor",
        title: "some floor",
        type: 1,
      }
    ],
    textOptBundleSets: [
      new TextOptBundleSet('default', new TextOptBundleSetApplyTo(true, null, null, null), new TextOptBundle().simpleSetValues('bottom-left', 3), new TextOptBundle().simpleSetValues('bottom-left', 3)),
      new TextOptBundleSet('ios-safari', new TextOptBundleSetApplyTo(false, 'ios', 'safari', null), new TextOptBundle().simpleSetValues('center', 3), new TextOptBundle().simpleSetValues('center', 3)),
      new TextOptBundleSet('ios-safari-below-12', new TextOptBundleSetApplyTo(false, 'ios', 'safari', '<12.0.0'), new TextOptBundle().simpleSetValues('center', 3), new TextOptBundle().simpleSetValues('center', 3)),
      new TextOptBundleSet('ios-safari-12', new TextOptBundleSetApplyTo(false, 'ios', 'safari', '12.x'), new TextOptBundle().simpleSetValues('center-left', 3), new TextOptBundle().simpleSetValues('center-left', 3)),
    ],
  };
  
  it('undefined os + browser + browser version choose default TextOptBundleSet.', () => {
    var slide = new TopCarouselSlide(topCarousleItemDefiningDefaultAndIos12TextOpt);
    slide.setBrowser('unknown', 'unknown', '10');
    expect(slide.effectiveTextOptBundle?.name).toBe('default');
  });

  it('specific os + browser + browser version best matches', () => {
    var slide = new TopCarouselSlide(topCarousleItemDefiningDefaultAndIos12TextOpt);
    slide.setBrowser('ios', 'safari', '12');
    expect(slide.effectiveTextOptBundle?.name).toBe('ios-safari-12');
  });

  it('specific os + browser + browser version matches version range', () => {
    var slide = new TopCarouselSlide(topCarousleItemDefiningDefaultAndIos12TextOpt);
    slide.setBrowser('ios', 'safari', '11');
    expect(slide.effectiveTextOptBundle?.name).toBe('ios-safari-below-12');
  });
});
