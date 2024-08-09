import { Types } from "mongoose"

declare module "mongoose" {
  export namespace Types {
    export type ObjectId = Types.ObjectId
  }
}
