import { Url } from "url";

declare module "*.json" {
  const value: any;
  export default value;
}

declare interface PointProperty {
  id : number;
  name: string;
  slug : string;
  icon : Url;
}
