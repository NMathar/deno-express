import {Method, Params, Query} from "../types/index.ts"

export class Request {
    get method(): Method {
      return this.raw.method;
    }

    get url(): string {
      return this.raw.url;
    }

    get headers(): Headers {
      return this.raw.headers;
    }

    get body(): Uint8Array {
      return this.raw.r.buf;
    }

    path: string;
    search: string;
    query: Query;
    params!: Params;
    data: any;
    error?: Error;
    extra: any = {};

    constructor(public raw: any) {
      const url = new URL("http://a.b" + raw.url);
      this.path = url.pathname;
      this.search = url.search;
      const query: Query = {};
      for (const [k, v] of new URLSearchParams(url.search) as any) {
        if (Array.isArray(query[k])) query[k] = [...query[k], v];
        else if (typeof query[k] === "string") query[k] = [query[k], v];
        else query[k] = v;
      }
      this.query = query;
    }
  }
