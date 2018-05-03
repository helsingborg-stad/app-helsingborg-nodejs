import { Url } from "url";

export interface PointProperty {
  id: number;
  name: string;
  slug: string;
  /** @nullable */
  icon?: Url,
}
