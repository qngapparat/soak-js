interface SoakOptionsType {
  bucket?: string,
  threshold?: number,
  forceSave?: boolean
}

declare function soak(
  func: (event: any, context?: any, callback?: any) => object, 
  soakOptions?: SoakOptionsType
 ): object | { _pointer: string };

export = soak;