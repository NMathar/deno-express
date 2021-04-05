import {EndHandler, Method} from "../index.ts"

export interface PathHandler {
    method: Method;
    pattern: string;
    match: (path: string) => any;
    handle: EndHandler;
  }
