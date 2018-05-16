/* tslint:disable jsdoc-format */
import { Url } from "url";

export interface IPointProperty {
  id: number;
  name: string;
  slug: string;
  icon?: Url | null;
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
  // TODO use Link interface
  links: Url[] | null;
  longitude: number;
  streetAddress: string;
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
  url: Url;
  title?: string;
  type?: LinkType;
}

export interface IImageUrls {
  large?: Url | null;
  medium?: Url | null;
  thumbnail?: Url | null;
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
  url: Url;
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
