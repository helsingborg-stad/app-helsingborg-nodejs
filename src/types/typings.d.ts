import { Url } from "url";

export interface PointProperty {
  id: number;
  name: string;
  slug: string;
  icon?: Url | null;
}

export interface OpeningHours {
  closed: boolean;
  closing?: string | null;
  dayNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  opening: string | null;
  weekday: string;
}

export interface OpeningHourException {
  /** @format date-time*/
  date: string;
  description: string;
}

export interface Location {
  id: number;
  latitude: number;
  links: Link[] | null;
  longitude: number;
  streetAddress: string;
  openingHours?: OpeningHours[];
  openingHourExceptions?: OpeningHourException[];
}
export enum LinkType {
  WEB = "web",
  INSTAGRAM = "instagram",
  FACEBOOK = "facebook",
  TWITTER = "twitter",
  SPOTIFY = "spotify",
  YOUTUBE = "youtube",
  VIMEO = "vimeo"
}

export interface Link {
  url: Url;
  title?: string;
  type?: LinkType;
}

export interface ImageUrls {
  large?: Url | null;
  medium?: Url | null;
  thumbnail?: Url | null;
}

export interface GuideGroup {
  active: boolean;
  description: string;
  id: number;
  images: ImageUrls;
  location: Location;
  name: string;
  slug: string;
  pointProperties: PointProperty[];
}

export enum ContentType {
  AUDIO = "audio",
  VIDEO = "video"
}

export interface MediaContent {
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

export interface ContentObject {
  order: number;
  postStatus: PostStatus;
  id: number;
  searchableId: string;
  title: string;
  description?: string;
  images: ImageUrls[];
  audio?: MediaContent;
  video?: MediaContent;
  links?: Link[];
}

export enum PostStatus {
  PUBLISH = "publish",
  DRAFT = "draft"
}

export enum GuideType {
  GUIDE = "guide",
  TRAIL = "trail"
}

export interface Guide {
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
  images: ImageUrls;
  contentObjects: ContentObject[];
}
