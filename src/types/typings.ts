/* tslint:disable jsdoc-format */
export interface IPointProperty {
  id: number;
  name: string;
  slug: string;
  icon?: string | null;
}

export interface IOpeningHours {
  closed: boolean;
  closing?: string | null;
  dayNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  opening: string | null;
  weekday: string;
}

export interface IOpeningHourException {
  /** @format date-time*/
  date: string;
  description: string;
}

export interface ILocation {
  id: number;
  // TODO use Position interface
  latitude: number;
  links: ILink[] | null;
  longitude: number;
  streetAddress: string|null;
  openingHours?: IOpeningHours[];
  openingHourExceptions?: IOpeningHourException[];
}

export enum LinkType {
  WEB = "web",
  INSTAGRAM = "instagram",
  FACEBOOK = "facebook",
  TWITTER = "twitter",
  SPOTIFY = "spotify",
  YOUTUBE = "youtube",
  VIMEO = "vimeo",
}

export interface ILink {
  url: string;
  title?: string;
  type?: LinkType;
}

export interface IImageUrls {
  large?: string | null;
  medium?: string | null;
  thumbnail?: string | null;
}

export interface IGuideGroup {
  active: boolean;
  description: string;
  id: number;
  images: IImageUrls;
  location: ILocation;
  name: string;
  slug: string;
  pointProperties: IPointProperty[];
}

export enum ContentType {
  AUDIO = "audio",
  VIDEO = "video",
}

export interface IMediaContent {
  contentType: ContentType;
  description: string;
  id: number;
  title: string;
  /** @format date-time*/
  created: string;
  /** @format date-time*/
  modified: string;
  url: string;
}

export interface IPosition {
  longitude: number;
  latitude: number;
}

export interface IBeacon {
  id: string;
  nid: string;
  distance?: number;
}

export interface IContentObject {
  id: string;
  order: number;
  postStatus: PostStatus;
  searchableId: string;
  title: string;
  description?: string;
  images: IImageUrls[];
  audio?: IMediaContent;
  video?: IMediaContent;
  links?: ILink[];
  beacon?: IBeacon;
  location?: ILocation;
}

export enum PostStatus {
  PUBLISH = "publish",
  DRAFT = "draft",
}

export enum GuideType {
  GUIDE = "guide",
  TRAIL = "trail",
}

export interface IGuide {
  id: number;
  slug: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  postStatus: PostStatus;
  guideGroupId: number;
  /** @format date-time*/
  dateStart?: string;
  /** @format date-time*/
  dateEnd?: string;
  guideType: GuideType;
  childFriendly: boolean;
  images: IImageUrls;
  contentObjects: IContentObject[];
}

export enum NavigationItemType {
  GUIDE = "guide",
  GUIDE_GROUP = "guidegroup",
}

export interface INavigationItem {
  id: number;
  type: NavigationItemType;
}

export interface INavigationCategory {
  id: number;
  description: string;
  name: string;
  slug: string;
  items: INavigationItem[];
}
