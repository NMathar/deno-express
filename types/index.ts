import {PathHandler} from "./interfaces/PathHandler.ts"
import {Request} from "../src/Request.ts"
import {Response} from "../src/Response.ts"

export type JsonPrimitive = string | number | boolean | null
export interface JsonMap extends Record<string, JsonPrimitive | JsonArray | JsonMap> {}
export interface JsonArray extends Array<JsonPrimitive | JsonArray | JsonMap> {}
export type Json = JsonPrimitive | JsonMap | JsonArray
export type Method = "HEAD" | "OPTIONS" | "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type Next = () => Promise<void>;
export type Handler = (req: Request, res: Response, next: Next) => Promise<void>;
export type EndHandler = (req: Request, res: Response) => void;
export type Middleware = Handler | PathHandler;
export type Query = { [key: string]: string | string[] };
export type Params = { [key: string]: string };
export type PathMatcher = (pattern: string) => (path: string) => Params;
