import * as express from 'express'

// how the user configures soak
interface SoakOptionsType {
  bucket?: string,
  thresholdBytes?: number,
  forceSave?: boolean
}

declare function soak(
    func: (req: express.Request, res: express.Response) => object,
    soakOptions?: SoakOptionsType
  ): (req: express.Request, res: express.Response) => object | { _pointer: string }

export = soak;