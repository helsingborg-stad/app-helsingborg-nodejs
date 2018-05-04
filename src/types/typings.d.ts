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

export interface OpeningHourEception {
  date: Date;
  description: string;
}

export interface Location {
  id: number;
  latitude: number;
  /** @nullable */
  links: Url[];
  longitude: number;
  streetAddress: string;
  openHours: OpeningHours[];
  //openHourExceptions: OpeningHourEception[];
}

export interface GuideGroup {
  active: boolean;
  description: string;
  id: number;
  images: {
    large: Url;
    medium: Url;
    thumbnail: Url;
  };
  location: Location;
  name: string;
  slug: string;
  pointProperties: PointProperty[];
}
