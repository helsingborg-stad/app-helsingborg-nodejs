import { Url } from "url";

export interface PointProperty {
  id: number;
  name: string;
  slug: string;
  /** @nullable */
  icon?: Url;
}

export interface OpeningHours {
  closed: boolean;
  /** @nullable */
  closing?: string;
  dayNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** @nullable */
  opening: string;
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
  /** @nullable */
  links: Url[];
  longitude: number;
  streetAddress: string;
  openingHours?: OpeningHours[];
  openingHourExceptions?: OpeningHourException[];
}

export interface ImageUrls {
  /** @nullable */
  large?: Url;
  /** @nullable */
  medium?: Url;
  /** @nullable */
  thumbnail?: Url;
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

export interface ContentObject {
  //TODO To be done
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
  /** @nullable */
  tagline?: string;
  /** @nullable */
  description?: string;
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
