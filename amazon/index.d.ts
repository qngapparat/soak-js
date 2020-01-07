interface SoakOptionsType {
  bucket?: string,
  thresholdBytes?: number,
  forceSave?: boolean
}

declare function soak(
  func: (event: any, context?: any, callback?: any) => object, 
  soakOptions?: SoakOptionsType
 ): (event:any , context:any , callback: any) => object | { _pointer: string }

export = soak;